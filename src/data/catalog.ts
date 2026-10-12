// Αυτό το αρχείο παράγεται από τον κατάλογο του legacy/index.html. Είναι τα αρχικά πιάτα
// που αντιγράφονται στο νοικοκυριό όταν δημιουργείται (μετά επεξεργάζονται ελεύθερα).
import type { SeedDish } from './types';

export const CATALOG: SeedDish[] = [
  {
    "id": "fakes",
    "kind": "lunch",
    "name": "Φακές με φέτα και ελιές",
    "category": "legume",
    "minutes": 40,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Φακές",
        "qty": 250,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Καρότα",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φέτα",
        "qty": 120,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Ελιές",
        "qty": 60,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      }
    ]
  },
  {
    "id": "fasolada",
    "kind": "lunch",
    "name": "Φασολάδα",
    "category": "legume",
    "minutes": 100,
    "minutesPressure": 35,
    "tags": [],
    "note": "Μούλιασμα από το βράδυ. Βγάζει περισσεύματα.",
    "batch": true,
    "people": null,
    "ingredients": [
      {
        "name": "Φασόλια ξερά",
        "qty": 250,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Καρότα",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Σέλινο (κλωναράκια)",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      }
    ]
  },
  {
    "id": "rev-kari",
    "kind": "lunch",
    "name": "Ρεβίθια κάρυ με σπανάκι",
    "category": "legume",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Ρεβίθια κονσέρβα",
        "qty": 2,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Γάλα καρύδας",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Πάστα ή σκόνη κάρυ",
        "qty": 1,
        "unit": "βαζάκι",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Σπανάκι",
        "qty": 300,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Σκόρδο",
        "qty": 2,
        "unit": "σκελίδες",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πίτες",
        "qty": 2,
        "unit": "τμχ",
        "store": "varda",
        "section": "bread"
      }
    ]
  },
  {
    "id": "burrito",
    "kind": "lunch",
    "name": "Burrito με μαύρα φασόλια, καλαμπόκι και αβοκάντο",
    "category": "legume",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Μαύρα φασόλια",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Καλαμπόκι",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Τορτίγιες",
        "qty": 4,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Αβοκάντο",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Τυρί τριμμένο",
        "qty": 80,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "rev-fournou",
    "kind": "lunch",
    "name": "Ρεβίθια λεμονάτα φούρνου με πατάτες",
    "category": "legume",
    "minutes": 90,
    "minutesPressure": 40,
    "tags": [],
    "note": "Μούλιασμα από το βράδυ.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Ρεβίθια ξερά",
        "qty": 250,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Πατάτες",
        "qty": 400,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Λεμόνια",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "gigantes",
    "kind": "lunch",
    "name": "Γίγαντες φούρνου",
    "category": "legume",
    "minutes": 100,
    "minutesPressure": 45,
    "tags": [],
    "note": "Μούλιασμα από το βράδυ.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Γίγαντες",
        "qty": 250,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πιπεριές",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φέτα",
        "qty": 80,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      }
    ]
  },
  {
    "id": "fava",
    "kind": "lunch",
    "name": "Φάβα με κρεμμύδια, κάπαρη και ελιές",
    "category": "legume",
    "minutes": 35,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Φάβα",
        "qty": 250,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κάπαρη",
        "qty": 1,
        "unit": "βαζάκι",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Λεμόνια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντοματίνια",
        "qty": 150,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ελιές",
        "qty": 60,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      }
    ]
  },
  {
    "id": "mak-kolok",
    "kind": "lunch",
    "name": "Μακαρόνια με κολοκυθάκια, ντοματίνια και φέτα",
    "category": "veg",
    "minutes": 25,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Μακαρόνια",
        "qty": 250,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Κολοκυθάκια",
        "qty": 3,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντοματίνια",
        "qty": 250,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φέτα",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Σκόρδο",
        "qty": 2,
        "unit": "σκελίδες",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "gemista",
    "kind": "lunch",
    "name": "Γεμιστά (ντομάτες, πιπεριές) με πλιγούρι και φέτα",
    "category": "veg",
    "minutes": 80,
    "minutesPressure": null,
    "tags": [],
    "note": "Ταψί: φαγητό για 2-3 γεύματα.",
    "batch": true,
    "people": null,
    "ingredients": [
      {
        "name": "Ντομάτες",
        "qty": 4,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πιπεριές",
        "qty": 3,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πλιγούρι",
        "qty": 150,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Μαϊντανός",
        "qty": 1,
        "unit": "ματσάκι",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φέτα",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Πατάτες",
        "qty": 300,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "noodles",
    "kind": "lunch",
    "name": "Noodles με λαχανικά wok και σόγια",
    "category": "veg",
    "minutes": 20,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Noodles",
        "qty": 200,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Καρότα",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πιπεριές",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Μπρόκολο",
        "qty": 200,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Σάλτσα σόγιας",
        "qty": 1,
        "unit": "μπουκάλι",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Τζίντζερ",
        "qty": 1,
        "unit": "κομμάτι",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "imam",
    "kind": "lunch",
    "name": "Μελιτζάνες ιμάμ με κους κους",
    "category": "veg",
    "minutes": 60,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Μελιτζάνες",
        "qty": 3,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 3,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Σκόρδο",
        "qty": 3,
        "unit": "σκελίδες",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κους κους",
        "qty": 150,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      }
    ]
  },
  {
    "id": "penes",
    "kind": "lunch",
    "name": "Πένες με μελιτζάνα, ντομάτα και ρίγανη",
    "category": "veg",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Πένες",
        "qty": 250,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Μελιτζάνες",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Μυζήθρα ή φέτα",
        "qty": 80,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      }
    ]
  },
  {
    "id": "spanaki-avga",
    "kind": "lunch",
    "name": "Σπανάκι με αυγά και φέτα, με πατάτες φούρνου",
    "category": "veg",
    "minutes": 45,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Σπανάκι",
        "qty": 600,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Αυγά",
        "qty": 4,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Φέτα",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Πατάτες",
        "qty": 400,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φρέσκα κρεμμυδάκια",
        "qty": 1,
        "unit": "ματσάκι",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "kritharoto",
    "kind": "lunch",
    "name": "Κριθαρότο με αρακά και μανιτάρια",
    "category": "veg",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [
      "mush"
    ],
    "note": "Μανιτάρια: μία φορά τον μήνα.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Κριθαράκι",
        "qty": 200,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Αρακάς κατεψυγμένος",
        "qty": 200,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Μανιτάρια",
        "qty": 250,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Παρμεζάνα",
        "qty": 40,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      }
    ]
  },
  {
    "id": "tortigies",
    "kind": "lunch",
    "name": "Τορτίγιες με ψητά λαχανικά, τυρί και αβοκάντο",
    "category": "veg",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Τορτίγιες",
        "qty": 4,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Κολοκυθάκια",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πιπεριές",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Τυρί τριμμένο",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Αβοκάντο",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "kouskous-veg",
    "kind": "lunch",
    "name": "Κους κους με ψητά λαχανικά και φέτα",
    "category": "veg",
    "minutes": 25,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Κους κους",
        "qty": 200,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Κολοκυθάκια",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Μελιτζάνες",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πιπεριές",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντοματίνια",
        "qty": 150,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φέτα",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      }
    ]
  },
  {
    "id": "kolokithokeftedes",
    "kind": "lunch",
    "name": "Κολοκυθοκεφτέδες φούρνου με τζατζίκι",
    "category": "veg",
    "minutes": 45,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Κολοκυθάκια",
        "qty": 600,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Αυγά",
        "qty": 1,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Φέτα",
        "qty": 120,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Μαϊντανός",
        "qty": 1,
        "unit": "ματσάκι",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Τριμμένη φρυγανιά",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Γιαούρτι",
        "qty": 200,
        "unit": "γρ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Αγγούρια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "fasolakia",
    "kind": "lunch",
    "name": "Φασολάκια λαδερά με πατάτες",
    "category": "veg",
    "minutes": 60,
    "minutesPressure": 25,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Φασολάκια",
        "qty": 500,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πατάτες",
        "qty": 400,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "frittata",
    "kind": "lunch",
    "name": "Ομελέτα φούρνου (frittata) με λαχανικά",
    "category": "veg",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Αυγά",
        "qty": 6,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Κολοκυθάκια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πιπεριές",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φέτα",
        "qty": 80,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "kotopoulo-fournou",
    "kind": "lunch",
    "name": "Κοτόπουλο φούρνου με πατάτες",
    "category": "meat",
    "minutes": 75,
    "minutesPressure": null,
    "tags": [],
    "note": "Ο φούρνος δουλεύει μόνος του.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Κοτόπουλο (μπούτια ή στήθος)",
        "qty": 800,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Πατάτες",
        "qty": 700,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Λεμόνια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "biftekia",
    "kind": "lunch",
    "name": "Μπιφτέκια με πατάτες φούρνου και σαλάτα",
    "category": "meat",
    "minutes": 45,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Κιμάς μοσχαρίσιος",
        "qty": 400,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πατάτες",
        "qty": 600,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Αγγούρια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Τριμμένη φρυγανιά",
        "qty": 50,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      }
    ]
  },
  {
    "id": "souvlakia",
    "kind": "lunch",
    "name": "Σουβλάκια κοτόπουλο με πίτες και τζατζίκι",
    "category": "meat",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [],
    "note": "Τζατζίκι: γιαούρτι, αγγούρι, σκόρδο.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Στήθος κοτόπουλο",
        "qty": 400,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Πίτες",
        "qty": 4,
        "unit": "τμχ",
        "store": "varda",
        "section": "bread"
      },
      {
        "name": "Γιαούρτι",
        "qty": 200,
        "unit": "γρ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Αγγούρια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "moschari",
    "kind": "lunch",
    "name": "Μοσχάρι κοκκινιστό με κοφτό μακαρονάκι",
    "category": "meat",
    "minutes": 120,
    "minutesPressure": 40,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Μοσχάρι σε κύβους",
        "qty": 500,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Κοφτό μακαρονάκι",
        "qty": 200,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "kotopoulo-pan",
    "kind": "lunch",
    "name": "Κοτόπουλο στο τηγάνι με πιπεριές και πατάτες",
    "category": "meat",
    "minutes": 35,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Στήθος κοτόπουλο",
        "qty": 400,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Πιπεριές",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πατάτες",
        "qty": 500,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "keftedakia",
    "kind": "lunch",
    "name": "Κεφτεδάκια με σάλτσα ντομάτας και μακαρόνια",
    "category": "meat",
    "minutes": 40,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Κιμάς μοσχαρίσιος",
        "qty": 400,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Μακαρόνια",
        "qty": 200,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Μαϊντανός",
        "qty": 1,
        "unit": "ματσάκι",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "xoirino",
    "kind": "lunch",
    "name": "Χοιρινό λεμονάτο με πατάτες",
    "category": "meat",
    "minutes": 70,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Χοιρινό (μπριζόλες ή κύβοι)",
        "qty": 500,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Πατάτες",
        "qty": 600,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Λεμόνια",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "pastitsio",
    "kind": "lunch",
    "name": "Παστίτσιο",
    "category": "meat",
    "minutes": 120,
    "minutesPressure": null,
    "tags": [],
    "note": "Ταψί: φαγητό για 2-3 γεύματα.",
    "batch": true,
    "people": null,
    "ingredients": [
      {
        "name": "Κιμάς μοσχαρίσιος",
        "qty": 500,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Μακαρόνια (παστίτσιο)",
        "qty": 400,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Γάλα μακράς διαρκείας",
        "qty": 1,
        "unit": "λίτρο",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Αυγά",
        "qty": 3,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Κεφαλοτύρι τριμμένο",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Βούτυρο",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      }
    ]
  },
  {
    "id": "mousakas",
    "kind": "lunch",
    "name": "Μουσακάς",
    "category": "meat",
    "minutes": 130,
    "minutesPressure": null,
    "tags": [],
    "note": "Ταψί: φαγητό για 2-3 γεύματα.",
    "batch": true,
    "people": null,
    "ingredients": [
      {
        "name": "Μελιτζάνες",
        "qty": 4,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πατάτες",
        "qty": 500,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κιμάς μοσχαρίσιος",
        "qty": 500,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Γάλα μακράς διαρκείας",
        "qty": 1,
        "unit": "λίτρο",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Αυγά",
        "qty": 2,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Κεφαλοτύρι τριμμένο",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Βούτυρο",
        "qty": 80,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      }
    ]
  },
  {
    "id": "bakaliaros",
    "kind": "lunch",
    "name": "Μπακαλιάρος πλακί με πατάτες",
    "category": "fish",
    "minutes": 45,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Μπακαλιάρος φιλέτο",
        "qty": 400,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Ντομάτα τριμμένη",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πατάτες",
        "qty": 400,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Μαϊντανός",
        "qty": 1,
        "unit": "ματσάκι",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Σκόρδο",
        "qty": 2,
        "unit": "σκελίδες",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "solomos-fournou",
    "kind": "lunch",
    "name": "Σολομός φούρνου με μπρόκολο και πατάτες",
    "category": "fish",
    "minutes": 35,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Σολομός φιλέτο",
        "qty": 300,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Μπρόκολο",
        "qty": 300,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Πατάτες",
        "qty": 400,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Λεμόνια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "solomos-teriyaki",
    "kind": "lunch",
    "name": "Σολομός teriyaki με noodles και λαχανικά",
    "category": "fish",
    "minutes": 25,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Σολομός φιλέτο",
        "qty": 300,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Noodles",
        "qty": 150,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Σάλτσα σόγιας",
        "qty": 1,
        "unit": "μπουκάλι",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Τζίντζερ",
        "qty": 1,
        "unit": "κομμάτι",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Καρότα",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Μπρόκολο",
        "qty": 200,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "tonos",
    "kind": "lunch",
    "name": "Τόνος ψητός με σαλάτα κους κους",
    "category": "fish",
    "minutes": 25,
    "minutesPressure": null,
    "tags": [],
    "note": "Δοκιμή: δεν τον έχετε ξαναφάει.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Τόνος φέτες",
        "qty": 300,
        "unit": "γρ",
        "store": "skl",
        "section": "frozen"
      },
      {
        "name": "Κους κους",
        "qty": 120,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Ντοματίνια",
        "qty": 150,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Αγγούρια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Λεμόνια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ελιές",
        "qty": 60,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      }
    ]
  },
  {
    "id": "sardeles",
    "kind": "lunch",
    "name": "Σαρδέλες στο φούρνο με λεμόνι, σαλάτα και ψωμί",
    "category": "fish",
    "minutes": 35,
    "minutesPressure": null,
    "tags": [],
    "note": "Ζητήστε από τον ψαρά να τις καθαρίσει.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Σαρδέλες φρέσκες",
        "qty": 600,
        "unit": "γρ",
        "store": "psaras",
        "section": "fish"
      },
      {
        "name": "Λεμόνια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Αγγούρια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ψωμί",
        "qty": 1,
        "unit": "τμχ",
        "store": "varda",
        "section": "bread"
      }
    ]
  },
  {
    "id": "gavros",
    "kind": "lunch",
    "name": "Γαύρος στο φούρνο με ντομάτα και κρεμμύδι",
    "category": "fish",
    "minutes": 40,
    "minutesPressure": null,
    "tags": [],
    "note": "Ζητήστε από τον ψαρά να τον καθαρίσει.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Γαύρος φρέσκος",
        "qty": 500,
        "unit": "γρ",
        "store": "psaras",
        "section": "fish"
      },
      {
        "name": "Ντομάτες",
        "qty": 3,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Κρεμμύδια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Μαϊντανός",
        "qty": 1,
        "unit": "ματσάκι",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ψωμί",
        "qty": 1,
        "unit": "τμχ",
        "store": "varda",
        "section": "bread"
      }
    ]
  },
  {
    "id": "atherina",
    "kind": "lunch",
    "name": "Αθερίνα τηγανητή με σαλάτα",
    "category": "fish",
    "minutes": 30,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Αθερίνα φρέσκια",
        "qty": 500,
        "unit": "γρ",
        "store": "psaras",
        "section": "fish"
      },
      {
        "name": "Λεμόνια",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Αγγούρια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ψωμί",
        "qty": 1,
        "unit": "τμχ",
        "store": "varda",
        "section": "bread"
      }
    ]
  },
  {
    "id": "psaras-fresh",
    "kind": "lunch",
    "name": "Ό,τι φρέσκο έχει ο ψαράς (όχι τσιπούρα/λαβράκι)",
    "category": "fish",
    "minutes": 40,
    "minutesPressure": null,
    "tags": [],
    "note": "Δεν ξέρετε από πριν τι θα έχει. Αν δεν έχει κάτι που σας αρέσει, αλλάξτε το πιάτο.",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Ψάρι φρέσκο (ό,τι έχει)",
        "qty": 600,
        "unit": "γρ",
        "store": "psaras",
        "section": "fish"
      },
      {
        "name": "Πατάτες",
        "qty": 400,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Λεμόνια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "d1",
    "kind": "dinner",
    "name": "Ομελέτα με φέτα και ντομάτα ή σπανάκι",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Αυγά",
        "qty": 4,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Φέτα",
        "qty": 60,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Ντομάτες",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "d2",
    "kind": "dinner",
    "name": "Τοστ ολικής με γαλοπούλα και τυρί + σαλάτα",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Ψωμί τοστ ολικής",
        "qty": 4,
        "unit": "φέτες",
        "store": "varda",
        "section": "bread"
      },
      {
        "name": "Γαλοπούλα",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Τυρί κίτρινο",
        "qty": 80,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Μαρούλι",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "d3",
    "kind": "dinner",
    "name": "Σαλάτα με τόνο και αυγό",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Τόνος κονσέρβα",
        "qty": 2,
        "unit": "κονσέρβες",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Αυγά",
        "qty": 2,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Μαρούλι",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Ντομάτες",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "d4",
    "kind": "dinner",
    "name": "Γιαούρτι με φρούτο, μέλι και καρύδια",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Γιαούρτι",
        "qty": 400,
        "unit": "γρ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Φρούτα εποχής",
        "qty": 2,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Καρύδια",
        "qty": 40,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      }
    ]
  },
  {
    "id": "d5",
    "kind": "dinner",
    "name": "Ψωμί με χούμους, τυρί και ντοματίνια",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Χούμους",
        "qty": 200,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Ψωμί",
        "qty": 1,
        "unit": "τμχ",
        "store": "varda",
        "section": "bread"
      },
      {
        "name": "Φέτα",
        "qty": 60,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Ντοματίνια",
        "qty": 150,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "d6",
    "kind": "dinner",
    "name": "Quesadilla με τυρί και λαχανικά",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Τορτίγιες",
        "qty": 2,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Τυρί τριμμένο",
        "qty": 100,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      },
      {
        "name": "Πιπεριές",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "d7",
    "kind": "dinner",
    "name": "Ρεβιθοσαλάτα με αγγούρι και φέτα",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": null,
    "ingredients": [
      {
        "name": "Ρεβίθια κονσέρβα",
        "qty": 1,
        "unit": "κουτί",
        "store": "skl",
        "section": "can"
      },
      {
        "name": "Ντοματίνια",
        "qty": 150,
        "unit": "γρ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Αγγούρια",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      },
      {
        "name": "Φέτα",
        "qty": 60,
        "unit": "γρ",
        "store": "skl",
        "section": "dairy"
      }
    ]
  },
  {
    "id": "b1",
    "kind": "breakfast",
    "name": "Γιαούρτι με βρώμη, καρύδια και φρούτο",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": 1,
    "ingredients": [
      {
        "name": "Γιαούρτι",
        "qty": 200,
        "unit": "γρ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Βρώμη",
        "qty": 50,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Καρύδια",
        "qty": 20,
        "unit": "γρ",
        "store": "skl",
        "section": "dry"
      },
      {
        "name": "Φρούτα εποχής",
        "qty": 1,
        "unit": "τμχ",
        "store": "laiki",
        "section": "veg"
      }
    ]
  },
  {
    "id": "b2",
    "kind": "breakfast",
    "name": "Αυγά (3) με ψωμί",
    "category": null,
    "minutes": 0,
    "minutesPressure": null,
    "tags": [],
    "note": "",
    "batch": false,
    "people": 1,
    "ingredients": [
      {
        "name": "Αυγά",
        "qty": 3,
        "unit": "τμχ",
        "store": "varda",
        "section": "dairy"
      },
      {
        "name": "Ψωμί",
        "qty": 2,
        "unit": "φέτες",
        "store": "varda",
        "section": "bread"
      }
    ]
  }
];

/** Προεπιλεγμένο πλάνο 4 εβδομάδων: ids πιάτων ανά εβδομάδα και ημέρα (Δευ–Παρ). */
export const DEFAULT_PLAN: string[][] = [
  [
    "fakes",
    "mak-kolok",
    "kotopoulo-fournou",
    "bakaliaros",
    "gemista"
  ],
  [
    "rev-kari",
    "noodles",
    "biftekia",
    "sardeles",
    "imam"
  ],
  [
    "fasolada",
    "penes",
    "souvlakia",
    "tonos",
    "spanaki-avga"
  ],
  [
    "burrito",
    "kritharoto",
    "moschari",
    "solomos-teriyaki",
    "tortigies"
  ]
];

/** Προεπιλεγμένες φορές ανά περίοδο 2 εβδομάδων [περίοδος 1, περίοδος 2] για βραδινά και πρωινό. */
export const DEFAULT_EXTRAS: Record<string, [number, number]> = {
  "d1": [
    2,
    2
  ],
  "d2": [
    2,
    2
  ],
  "d3": [
    2,
    2
  ],
  "d4": [
    1,
    1
  ],
  "d5": [
    1,
    1
  ],
  "d6": [
    1,
    1
  ],
  "d7": [
    1,
    1
  ],
  "b1": [
    6,
    6
  ],
  "b2": [
    4,
    4
  ]
};
