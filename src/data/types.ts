import type { Category } from '../ui/components';

export type { Category };

export type DishKind = 'lunch' | 'dinner' | 'breakfast';

/** Πού ψωνίζεται το υλικό (id καταστήματος) και σε ποια ενότητα της λίστας ανήκει. */
export type Ingredient = {
  name: string;
  qty: number;
  unit: string;
  store: string;
  section: string;
};

export type SeedDish = {
  id: string;
  kind: DishKind;
  name: string;
  category: Category | null;
  minutes: number;
  minutesPressure: number | null;
  tags: string[];
  note: string;
  batch: boolean;
  /** null = όσα άτομα έχει το νοικοκυριό. */
  people: number | null;
  ingredients: Ingredient[];
};

export type Dish = SeedDish & {
  favorite: boolean;
  rating: number | null;
  hidden: boolean;
};

export type Store = {
  id: string;
  name: string;
  color: string;
  /** week = ψώνια κάθε εβδομάδα, twoWeeks = ανά 2 εβδομάδες. */
  cadence: 'week' | 'twoWeeks';
  sort: number;
};

export type PlanSlot = {
  dishId: string;
  updatedBy: string | null;
};

export const SECTIONS: [string, string][] = [
  ['veg', 'Λαχανικά & φρούτα'],
  ['fish', 'Φρέσκο ψάρι'],
  ['frozen', 'Κατεψυγμένα (κρέας, ψάρι)'],
  ['dry', 'Ξηρά, όσπρια, ζυμαρικά'],
  ['can', 'Κονσέρβες & σάλτσες'],
  ['dairy', 'Γαλακτοκομικά & τυριά'],
  ['bread', 'Ψωμί & πίτες'],
  ['other', 'Άλλα'],
];

/** Ισορροπία εβδομάδας: πόσα πιάτα από κάθε κατηγορία. Θα γίνει ρύθμιση νοικοκυριού. */
export const WEEK_BALANCE: Record<Category, number> = { legume: 1, veg: 2, meat: 1, fish: 1 };

export const WEEKDAYS = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή'];
