import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Category, Dish, PlanSlot } from '../data/types';
import { WEEK_BALANCE } from '../data/types';

export const slotKey = (week: number, slot: number) => `${week}-${slot}`;

export function setPlanSlot(householdId: string, week: number, slot: number, dishId: string, uid: string) {
  return setDoc(doc(db, 'households', householdId, 'plan', slotKey(week, slot)), {
    week,
    slot,
    dishId,
    updatedBy: uid,
    updatedAt: serverTimestamp(),
  });
}

/** Πόσα πιάτα από κάθε κατηγορία έχει μια εβδομάδα, και αν ταιριάζει με την ισορροπία. */
export function weekBalance(week: number, plan: Map<string, PlanSlot>, dishById: Map<string, Dish>) {
  const counts: Record<Category, number> = { legume: 0, veg: 0, meat: 0, fish: 0 };
  for (let s = 0; s < 5; s++) {
    const dish = dishById.get(plan.get(slotKey(week, s))?.dishId ?? '');
    if (dish?.category) counts[dish.category] += 1;
  }
  return (Object.keys(WEEK_BALANCE) as Category[]).map((category) => ({
    category,
    count: counts[category],
    target: WEEK_BALANCE[category],
    ok: counts[category] === WEEK_BALANCE[category],
  }));
}

export function dishesWithTag(tag: string, plan: Map<string, PlanSlot>, dishById: Map<string, Dish>): number {
  let n = 0;
  plan.forEach((p) => {
    if (dishById.get(p.dishId)?.tags.includes(tag)) n += 1;
  });
  return n;
}

/** Τυχαίο πιάτο ίδιας κατηγορίας που δεν υπάρχει ήδη στο πλάνο. Αν δεν υπάρχει, από όλα της κατηγορίας. */
export function randomDish(current: Dish | undefined, plan: Map<string, PlanSlot>, dishes: Dish[]): Dish | null {
  const category = current?.category;
  if (!category) return null;
  const used = new Set([...plan.values()].map((p) => p.dishId));
  const sameCategory = dishes.filter((d) => d.kind === 'lunch' && !d.hidden && d.category === category && d.id !== current?.id);
  const fresh = sameCategory.filter((d) => !used.has(d.id));
  const pool = fresh.length ? fresh : sameCategory;
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
