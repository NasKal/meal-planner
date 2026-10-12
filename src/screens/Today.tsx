import { useState } from 'react';
import { Button, CategoryTag, CATEGORY_NAME, Label, Screen } from '../ui/components';
import { useData } from '../state/data';
import { useSession } from '../state/session';
import { CYCLE_WEEKS, cyclePosition, nextSlots, parseIso } from '../lib/cycle';
import { slotKey } from '../lib/plan';
import { fmtQty, upperEl } from '../lib/text';
import { WEEKDAYS } from '../data/types';

const headFormat = new Intl.DateTimeFormat('el-GR', { weekday: 'long', day: 'numeric', month: 'long' });
const startFormat = new Intl.DateTimeFormat('el-GR', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Today({ onSettings }: { onSettings: () => void }) {
  const data = useData();
  const session = useSession();
  const [open, setOpen] = useState(false);

  if (data.status !== 'ready') {
    return (
      <Screen onSettings={onSettings}>
        <p className="empty">{data.status === 'failed' ? 'Δεν φορτώθηκαν τα δεδομένα. Δοκίμασε ξανά.' : 'Φόρτωση…'}</p>
      </Screen>
    );
  }

  const { plan, dishById, cycleStartDate } = data.data;
  const now = new Date();
  const pos = cyclePosition(cycleStartDate, now);

  // Ποιο πιάτο δείχνουμε: το σημερινό, ή στο Σαββατοκύριακο / πριν την έναρξη το επόμενο.
  let focus = { week: pos.week, slot: pos.slot ?? 0 };
  let lead = 'Σήμερα';
  if (!pos.started) {
    focus = { week: 0, slot: 0 };
    lead = `Ξεκινά ${startFormat.format(parseIso(cycleStartDate))}`;
  } else if (pos.slot === null) {
    focus = nextSlots(pos.week, 4, 1)[0];
    lead = 'Τη Δευτέρα';
  }

  const dish = dishById.get(plan.get(slotKey(focus.week, focus.slot))?.dishId ?? '');
  const upcoming = nextSlots(focus.week, focus.slot, 2)
    .map((p) => ({ ...p, dish: dishById.get(plan.get(slotKey(p.week, p.slot))?.dishId ?? '') }))
    .filter((p) => p.dish);

  const daysLeft = pos.started ? null : -pos.daysSinceStart;
  const changedBy = (() => {
    const by = plan.get(slotKey(focus.week, focus.slot))?.updatedBy;
    if (!by || session.status !== 'ready') return null;
    return by === session.user.uid ? null : session.household.members?.[by]?.displayName ?? null;
  })();

  return (
    <Screen onSettings={onSettings}>
      <header className="day-head">
        <strong>{upperEl(headFormat.format(now))}</strong>
        <span>
          Εβδομάδα {focus.week + 1} από {CYCLE_WEEKS}
          {daysLeft ? ` · ο κύκλος ξεκινά σε ${daysLeft} ${daysLeft === 1 ? 'ημέρα' : 'ημέρες'}` : ''}
        </span>
      </header>

      {dish ? (
        <section className="hero" data-cat={dish.category ?? undefined} aria-label={lead}>
          <p className="hero-lead">{lead === 'Σήμερα' ? '' : upperEl(lead)}</p>
          {dish.category && <CategoryTag category={dish.category} />}
          <h3>{dish.name}</h3>
          <p className="hero-meta">
            {dish.minutes}′
            {dish.minutesPressure ? ` (${dish.minutesPressure}′ με χύτρα)` : ''}
            {dish.note ? ` · ${dish.note}` : ''}
          </p>
          <Button tone="light" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Κρύψε τα υλικά' : 'Δες τα υλικά'}
          </Button>
          {open && (
            <ul className="ingredients">
              {dish.ingredients.map((i) => (
                <li key={`${i.name}-${i.unit}`}>
                  <span>{i.name}</span>
                  <span>{fmtQty(i.qty, i.unit)}</span>
                </li>
              ))}
            </ul>
          )}
          {changedBy && <p className="hero-by">Αλλαγή από {changedBy}</p>}
        </section>
      ) : (
        <p className="empty">Δεν υπάρχει πιάτο για αυτή τη μέρα. Διάλεξε από το Πλάνο.</p>
      )}

      {upcoming.length > 0 && (
        <>
          <Label>Επόμενες μέρες</Label>
          <ul className="upcoming">
            {upcoming.map((u) => (
              <li key={slotKey(u.week, u.slot)} data-cat={u.dish!.category ?? undefined}>
                <span>
                  <span className="day">{upperEl(WEEKDAYS[u.slot])}</span>
                  <span className="dish">{u.dish!.name}</span>
                </span>
                <span
                  className="time"
                  aria-label={`${u.dish!.minutes} λεπτά${u.dish!.category ? ', ' + CATEGORY_NAME[u.dish!.category] : ''}`}
                >
                  {u.dish!.minutes}′
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Screen>
  );
}
