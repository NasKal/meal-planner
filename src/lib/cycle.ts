// Ημερομηνίες του κύκλου των 4 εβδομάδων. Όλες οι ημερομηνίες είναι τοπικές και
// αποθηκεύονται ως "ΕΕΕΕ-ΜΜ-ΗΗ" (χωρίς ώρα, ώστε να μη μετράει η ζώνη ώρας).

const DAY_MS = 24 * 60 * 60 * 1000;

export function isoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Αριθμός ημέρας (ακέραιος) για τοπική ημερομηνία, ανεξάρτητος από ώρες και αλλαγή ώρας. */
function dayNumber(d: Date): number {
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
}

export function mondayOf(d: Date): string {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const back = (copy.getDay() + 6) % 7; // Δευτέρα = 0
  copy.setDate(copy.getDate() - back);
  return isoDate(copy);
}

export function isMonday(iso: string): boolean {
  return parseIso(iso).getDay() === 1;
}

export function addDays(iso: string, n: number): Date {
  const d = parseIso(iso);
  d.setDate(d.getDate() + n);
  return d;
}

export const CYCLE_WEEKS = 4;
export const PLAN_DAYS = 5; // Δευτέρα έως Παρασκευή

export type CyclePosition = {
  /** Ημέρες από την έναρξη του κύκλου. Αρνητικό: ο κύκλος δεν έχει ξεκινήσει. */
  daysSinceStart: number;
  week: number; // 0..3
  /** 0 = Δευτέρα … 6 = Κυριακή. */
  weekday: number;
  /** Θέση μεσημεριανού στη σημερινή εβδομάδα, ή null Σάββατο/Κυριακή. */
  slot: number | null;
  started: boolean;
};

export function cyclePosition(startIso: string, now: Date): CyclePosition {
  const since = dayNumber(now) - dayNumber(parseIso(startIso));
  const mod = ((since % (7 * CYCLE_WEEKS)) + 7 * CYCLE_WEEKS) % (7 * CYCLE_WEEKS);
  const week = Math.floor(mod / 7);
  const weekday = mod % 7;
  return { daysSinceStart: since, week, weekday, slot: weekday < PLAN_DAYS ? weekday : null, started: since >= 0 };
}

/** Επόμενες `count` θέσεις πλάνου μετά από την (week, slot), με κυκλική περιέλιξη. */
export function nextSlots(week: number, slot: number, count: number): { week: number; slot: number }[] {
  const out: { week: number; slot: number }[] = [];
  let w = week;
  let s = slot;
  for (let i = 0; i < count; i++) {
    s += 1;
    if (s >= PLAN_DAYS) {
      s = 0;
      w = (w + 1) % CYCLE_WEEKS;
    }
    out.push({ week: w, slot: s });
  }
  return out;
}
