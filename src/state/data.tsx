import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { collection, onSnapshot, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import type { CheckState, Dish, ManualItem, PlanSlot, Store } from '../data/types';
import { seedHousehold } from '../lib/seed';
import { useSession } from './session';

export type HouseholdData = {
  dishes: Dish[];
  dishById: Map<string, Dish>;
  stores: Store[];
  /** Κλειδί "εβδομάδα-θέση", π.χ. "0-2" = εβδομάδα 1, Τετάρτη. */
  plan: Map<string, PlanSlot>;
  /** Φορές ανά περίοδο 2 εβδομάδων για βραδινά και πρωινό. Κλειδί "dishId_period". */
  extras: Map<string, number>;
  /** Τικ της λίστας αγορών. Κλειδί: id εγγράφου (βλ. lib/shopping.checkId). */
  checks: Map<string, CheckState>;
  manualItems: ManualItem[];
  cycleStartDate: string;
};

type DataState = { status: 'loading' } | { status: 'seeding' } | { status: 'failed' } | { status: 'ready'; data: HouseholdData };

const DataContext = createContext<DataState>({ status: 'loading' });
export const useData = () => useContext(DataContext);

/**
 * Ακούει μια υποσυλλογή. Μια κενή cache δεν μετράει ως απάντηση: περιμένει τον server,
 * εκτός αν η συλλογή μπορεί νόμιμα να είναι άδεια (`mayBeEmpty`), ώστε να ανοίγει και offline.
 */
function useCollection(
  householdId: string | undefined,
  name: string,
  onData: (snap: QuerySnapshot<DocumentData>) => void,
  mayBeEmpty = false,
) {
  const handler = useRef(onData);
  handler.current = onData;

  useEffect(() => {
    if (!householdId) return;
    return onSnapshot(
      collection(db, 'households', householdId, name),
      { includeMetadataChanges: true },
      (snap) => {
        if (!mayBeEmpty && snap.empty && snap.metadata.fromCache) return;
        handler.current(snap);
      },
      () => {
        /* οι αποτυχίες χειρίζονται από το session */
      },
    );
  }, [householdId, name, mayBeEmpty]);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const household = session.status === 'ready' ? session.household : null;
  const householdId = household?.id;
  const needsSeed = !!household && !household.seededAt;

  const [dishes, setDishes] = useState<Dish[] | null>(null);
  const [stores, setStores] = useState<Store[] | null>(null);
  const [plan, setPlan] = useState<Map<string, PlanSlot> | null>(null);
  const [extras, setExtras] = useState<Map<string, number> | null>(null);
  const [checks, setChecks] = useState<Map<string, CheckState> | null>(null);
  const [manualItems, setManualItems] = useState<ManualItem[] | null>(null);
  const [seedFailed, setSeedFailed] = useState(false);
  const seeding = useRef(false);

  useEffect(() => {
    if (!householdId || !needsSeed || seeding.current) return;
    seeding.current = true;
    seedHousehold(householdId).catch(() => {
      seeding.current = false;
      setSeedFailed(true);
    });
  }, [householdId, needsSeed]);

  useCollection(householdId, 'dishes', (snap) =>
    setDishes(snap.docs.map((d) => ({ ...(d.data() as Omit<Dish, 'id'>), id: d.id }))),
  );
  useCollection(householdId, 'stores', (snap) =>
    setStores(snap.docs.map((d) => ({ ...(d.data() as Omit<Store, 'id'>), id: d.id })).sort((a, b) => a.sort - b.sort)),
  );
  useCollection(householdId, 'plan', (snap) =>
    setPlan(new Map(snap.docs.map((d) => [d.id, d.data() as PlanSlot]))),
  );
  useCollection(householdId, 'extras', (snap) =>
    setExtras(new Map(snap.docs.map((d) => [d.id, (d.data().count as number) ?? 0]))),
  );
  useCollection(
    householdId,
    'checks',
    (snap) => setChecks(new Map(snap.docs.map((d) => [d.id, d.data() as CheckState]))),
    true,
  );
  useCollection(
    householdId,
    'manualItems',
    (snap) => setManualItems(snap.docs.map((d) => ({ ...(d.data() as Omit<ManualItem, 'id'>), id: d.id }))),
    true,
  );

  let state: DataState;
  if (!household) state = { status: 'loading' };
  else if (seedFailed) state = { status: 'failed' };
  else if (needsSeed) state = { status: 'seeding' };
  else if (!dishes || !stores || !plan || !extras || !checks || !manualItems) state = { status: 'loading' };
  else {
    state = {
      status: 'ready',
      data: {
        dishes,
        dishById: new Map(dishes.map((d) => [d.id, d])),
        stores,
        plan,
        extras,
        checks,
        manualItems,
        cycleStartDate: household.cycleStartDate ?? '',
      },
    };
  }

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}
