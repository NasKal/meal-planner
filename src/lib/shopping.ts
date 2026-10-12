import { deleteDoc, doc, increment, serverTimestamp, setDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import type { CheckState, Dish, PlanSlot, Store } from '../data/types';
import { PLAN_DAYS, addDays, isoDate } from './cycle';
import { slotKey } from './plan';

export type ListItem = {
  /** name|unit, μοναδικό μέσα σε μια λίστα. */
  key: string;
  name: string;
  qty: number;
  unit: string;
  section: string;
};

export type Period = {
  /** Εβδομάδα του κύκλου (0..3) όπου ξεκινά η περίοδος. */
  firstWeek: number;
  weeks: number[];
  label: string;
  /** Έναρξη της περιόδου (ΕΕΕΕ-ΜΜ-ΗΗ) στον κύκλο που εμφανίζεται. */
  startIso: string;
  /** Λήξη της περιόδου (Παρασκευή της τελευταίας εβδομάδας). */
  endIso: string;
};

/** Οι περίοδοι ενός καταστήματος μέσα σε έναν κύκλο: ανά εβδομάδα ή ανά δύο. */
export function periodsFor(store: Store, cycleStartIso: string, cycleNo: number): Period[] {
  const step = store.cadence === 'twoWeeks' ? 2 : 1;
  const out: Period[] = [];
  for (let first = 0; first < 4; first += step) {
    const weeks = Array.from({ length: step }, (_, i) => first + i);
    const startOffset = cycleNo * 28 + first * 7;
    const endOffset = cycleNo * 28 + (first + step - 1) * 7 + (PLAN_DAYS - 1);
    out.push({
      firstWeek: first,
      weeks,
      label: step === 1 ? `Εβδ. ${first + 1}` : `Εβδ. ${first + 1}–${first + 2}`,
      startIso: isoDate(addDays(cycleStartIso, startOffset)),
      endIso: isoDate(addDays(cycleStartIso, endOffset)),
    });
  }
  return out;
}

type Inputs = {
  plan: Map<string, PlanSlot>;
  dishById: Map<string, Dish>;
  dishes: Dish[];
  extras: Map<string, number>;
};

/** Τι χρειάζεται από ένα κατάστημα για μια περίοδο: μεσημεριανά του πλάνου συν βραδινά και πρωινό. */
export function buildList(store: Store, period: Period, { plan, dishById, dishes, extras }: Inputs): ListItem[] {
  const merged = new Map<string, ListItem>();
  const add = (name: string, qty: number, unit: string, section: string, times: number) => {
    if (times <= 0) return;
    const key = `${name}|${unit}`;
    const existing = merged.get(key);
    if (existing) existing.qty += qty * times;
    else merged.set(key, { key, name, qty: qty * times, unit, section });
  };

  for (const week of period.weeks) {
    for (let slot = 0; slot < PLAN_DAYS; slot++) {
      const dish = dishById.get(plan.get(slotKey(week, slot))?.dishId ?? '');
      dish?.ingredients.filter((i) => i.store === store.id).forEach((i) => add(i.name, i.qty, i.unit, i.section, 1));
    }
  }

  // Τα βραδινά και το πρωινό μετριούνται ανά 2 εβδομάδες (περίοδος 0 = εβδ. 1–2, 1 = εβδ. 3–4).
  const extraPeriod = Math.floor(period.firstWeek / 2);
  for (const dish of dishes) {
    if (dish.kind === 'lunch' || dish.hidden) continue;
    const count = extras.get(`${dish.id}_${extraPeriod}`) ?? 0;
    if (!count) continue;
    // Σε κατάστημα εβδομαδιαίο μοιράζουμε τις φορές στις δύο εβδομάδες (η πρώτη παίρνει το μεγαλύτερο μισό).
    const times = store.cadence === 'twoWeeks' ? count : period.firstWeek % 2 === 0 ? Math.ceil(count / 2) : Math.floor(count / 2);
    dish.ingredients.filter((i) => i.store === store.id).forEach((i) => add(i.name, i.qty, i.unit, i.section, times));
  }

  return [...merged.values()];
}

// ---------- Αναγνωριστικά εγγράφων ----------

const safe = (s: string) => s.replace(/\//g, '-');

/** id του εγγράφου τικ: κατάστημα, έναρξη περιόδου, είδος. Αλλάζει μόνο του σε κάθε νέο κύκλο. */
export const checkId = (storeId: string, periodStart: string, itemKey: string) =>
  `${storeId}_${periodStart}_${safe(itemKey)}`;

// ---------- Εγγραφές ----------

export function setCheck(householdId: string, id: string, state: CheckState['state'] | null, uid: string) {
  const ref = doc(db, 'households', householdId, 'checks', id);
  if (state === null) return deleteDoc(ref);
  return setDoc(ref, { state, by: uid, at: serverTimestamp() });
}

export function addManualItem(householdId: string, storeId: string, periodStart: string, name: string, uid: string) {
  return addDoc(collection(db, 'households', householdId, 'manualItems'), {
    name,
    storeId,
    periodStart,
    done: false,
    by: uid,
    createdAt: serverTimestamp(),
  });
}

export function setManualDone(householdId: string, id: string, done: boolean, uid: string) {
  return updateDoc(doc(db, 'households', householdId, 'manualItems', id), { done, by: uid });
}

export function removeManualItem(householdId: string, id: string) {
  return deleteDoc(doc(db, 'households', householdId, 'manualItems', id));
}

/** Αλλαγή φορών βραδινού/πρωινού. Το increment() μετράει σωστά δύο ταυτόχρονα πατήματα. */
export function changeExtraCount(householdId: string, dishId: string, period: number, delta: number, uid: string) {
  return setDoc(
    doc(db, 'households', householdId, 'extras', `${dishId}_${period}`),
    { dishId, period, count: increment(delta), updatedBy: uid, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
