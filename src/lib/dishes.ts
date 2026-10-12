import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import type { Category, Dish, DishKind, Ingredient, PlanSlot } from '../data/types';
import { WEEKDAYS } from '../data/types';

/** Τα πεδία που επεξεργάζεται ο χρήστης στη φόρμα πιάτου. */
export type DishInput = {
  kind: DishKind;
  name: string;
  category: Category | null;
  minutes: number;
  minutesPressure: number | null;
  tags: string[];
  note: string;
  batch: boolean;
  people: number | null;
  ingredients: Ingredient[];
};

export const UNITS = ['γρ', 'τμχ', 'κουτί', 'κονσέρβες', 'ματσάκι', 'σκελίδες', 'λίτρο', 'φέτες', 'βαζάκι', 'μπουκάλι', 'κομμάτι'];

const dishRef = (householdId: string, id: string) => doc(db, 'households', householdId, 'dishes', id);

/** Αποθήκευση πιάτου. Χωρίς id δημιουργεί νέο και επιστρέφει το id του. */
export async function saveDish(householdId: string, id: string | null, input: DishInput): Promise<string> {
  if (id) {
    await setDoc(dishRef(householdId, id), { ...input, updatedAt: serverTimestamp() }, { merge: true });
    return id;
  }
  const created = await addDoc(collection(db, 'households', householdId, 'dishes'), {
    ...input,
    favorite: false,
    rating: null,
    hidden: false,
    sourceId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return created.id;
}

export const setFavorite = (householdId: string, id: string, favorite: boolean) =>
  updateDoc(dishRef(householdId, id), { favorite });

export const setRating = (householdId: string, id: string, rating: number | null) =>
  updateDoc(dishRef(householdId, id), { rating });

export const setHidden = (householdId: string, id: string, hidden: boolean) =>
  updateDoc(dishRef(householdId, id), { hidden });

/** Διαγράφει το πιάτο και τις φορές του (βραδινά/πρωινό) στις δύο περιόδους. */
export async function deleteDish(householdId: string, id: string) {
  const batch = writeBatch(db);
  batch.delete(dishRef(householdId, id));
  [0, 1].forEach((p) => batch.delete(doc(db, 'households', householdId, 'extras', `${id}_${p}`)));
  await batch.commit();
}

/** Σε ποιες θέσεις του πλάνου χρησιμοποιείται το πιάτο, π.χ. "Εβδ. 1 · Τρίτη". */
export function planUses(dishId: string, plan: Map<string, PlanSlot>): string[] {
  const uses: string[] = [];
  plan.forEach((p, key) => {
    if (p.dishId !== dishId) return;
    const [week, slot] = key.split('-').map(Number);
    uses.push(`Εβδ. ${week + 1} · ${WEEKDAYS[slot]}`);
  });
  return uses.sort();
}

export function emptyDish(kind: DishKind): DishInput {
  return {
    kind,
    name: '',
    category: kind === 'lunch' ? 'veg' : null,
    minutes: kind === 'lunch' ? 30 : 0,
    minutesPressure: null,
    tags: [],
    note: '',
    batch: false,
    people: kind === 'breakfast' ? 1 : null,
    ingredients: [],
  };
}

export const toInput = (d: Dish): DishInput => ({
  kind: d.kind,
  name: d.name,
  category: d.category,
  minutes: d.minutes,
  minutesPressure: d.minutesPressure,
  tags: d.tags,
  note: d.note,
  batch: d.batch,
  people: d.people,
  ingredients: d.ingredients,
});
