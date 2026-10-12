import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { CATALOG, DEFAULT_EXTRAS, DEFAULT_PLAN } from '../data/catalog';
import { mondayOf } from './cycle';

const CATALOG_VERSION = 1;

export const DEFAULT_STORES = [
  { id: 'skl', name: 'Σκλαβενίτης', color: '#d33b3b', cadence: 'twoWeeks', sort: 1 },
  { id: 'laiki', name: 'Λαϊκή', color: '#4f8a3c', cadence: 'week', sort: 2 },
  { id: 'psaras', name: 'Ψαράς', color: '#2f7fa6', cadence: 'week', sort: 3 },
  { id: 'varda', name: 'Market Βάρδα', color: '#d98324', cadence: 'week', sort: 4 },
] as const;

/**
 * Γεμίζει το νοικοκυριό με τον αρχικό κατάλογο, καταστήματα και πλάνο.
 * Τρέχει μία φορά: το δεύτερο άτομο που θα το δοκιμάσει θα δει ότι έγινε ήδη (transaction).
 */
export async function seedHousehold(householdId: string): Promise<void> {
  const householdRef = doc(db, 'households', householdId);
  const sub = (name: string, id: string) => doc(db, 'households', householdId, name, id);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(householdRef);
    if (snap.get('seededAt')) return;

    for (const d of CATALOG) {
      tx.set(sub('dishes', d.id), { ...d, favorite: false, rating: null, hidden: false, sourceId: d.id });
    }
    for (const s of DEFAULT_STORES) {
      const { id, ...rest } = s;
      tx.set(sub('stores', id), rest);
    }
    DEFAULT_PLAN.forEach((week, w) =>
      week.forEach((dishId, s) => {
        tx.set(sub('plan', `${w}-${s}`), { week: w, slot: s, dishId, updatedBy: null, updatedAt: serverTimestamp() });
      }),
    );
    for (const [dishId, counts] of Object.entries(DEFAULT_EXTRAS)) {
      counts.forEach((count, period) => {
        tx.set(sub('extras', `${dishId}_${period}`), { dishId, period, count, updatedBy: null, updatedAt: serverTimestamp() });
      });
    }
    tx.update(householdRef, {
      seededAt: serverTimestamp(),
      catalogVersion: CATALOG_VERSION,
      cycleStartDate: mondayOf(new Date()),
    });
  });
}
