import type { Category } from '../ui/components';

// Δεδομένα δείγματος από το πραγματικό πλάνο (εβδομάδα 1). Αντικαθίστανται από το Firestore στο Βήμα 3.

export type SampleDish = {
  name: string;
  category: Category;
  minutes: number;
  note?: string;
  ingredients: { name: string; qty: number; unit: string }[];
};

export const TODAY_DISH: SampleDish = {
  name: 'Φακές με φέτα και ελιές',
  category: 'legume',
  minutes: 40,
  note: 'Χωρίς μούλιασμα',
  ingredients: [
    { name: 'Φακές', qty: 250, unit: 'γρ' },
    { name: 'Κρεμμύδια', qty: 1, unit: 'τμχ' },
    { name: 'Καρότα', qty: 1, unit: 'τμχ' },
    { name: 'Ντομάτες', qty: 2, unit: 'τμχ' },
    { name: 'Φέτα', qty: 120, unit: 'γρ' },
    { name: 'Ελιές', qty: 60, unit: 'γρ' },
  ],
};

export const UPCOMING: { day: string; dish: string; category: Category; minutes: number }[] = [
  { day: 'Τρίτη', dish: 'Μακαρόνια με κολοκυθάκια, ντοματίνια και φέτα', category: 'veg', minutes: 25 },
  { day: 'Τετάρτη', dish: 'Κοτόπουλο φούρνου με πατάτες', category: 'meat', minutes: 75 },
];

export const DINNER_TONIGHT = 'Ομελέτα με φέτα και ντομάτα';

export type SampleItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  section: string;
  /** Αρχικά τσεκαρισμένο από το άλλο κινητό. */
  doneByOther?: boolean;
};

export const STORES = ['Σκλαβενίτης', 'Λαϊκή', 'Ψαράς', 'Market Βάρδα'];

export const SECTIONS = [
  'Ξηρά, όσπρια, ζυμαρικά',
  'Κονσέρβες & σάλτσες',
  'Γαλακτοκομικά & τυριά',
  'Κατεψυγμένα',
];

export const LIST_ITEMS: SampleItem[] = [
  { id: 'fakes', name: 'Φακές', qty: 250, unit: 'γρ', section: 'Ξηρά, όσπρια, ζυμαρικά', doneByOther: true },
  { id: 'makaronia', name: 'Μακαρόνια', qty: 250, unit: 'γρ', section: 'Ξηρά, όσπρια, ζυμαρικά' },
  { id: 'elies', name: 'Ελιές', qty: 60, unit: 'γρ', section: 'Ξηρά, όσπρια, ζυμαρικά' },
  { id: 'ntomata', name: 'Ντομάτα τριμμένη', qty: 1, unit: 'κουτί', section: 'Κονσέρβες & σάλτσες' },
  { id: 'feta', name: 'Φέτα', qty: 320, unit: 'γρ', section: 'Γαλακτοκομικά & τυριά' },
  { id: 'kotopoulo', name: 'Κοτόπουλο μπούτια', qty: 800, unit: 'γρ', section: 'Κατεψυγμένα' },
];
