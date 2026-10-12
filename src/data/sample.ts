// Δεδομένα δείγματος μόνο για τη λίστα αγορών. Αντικαθίστανται στο Βήμα 4.

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
