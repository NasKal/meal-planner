import { useState } from 'react';
import { Button, CategoryTag, CATEGORY_NAME, Label, Screen } from '../ui/components';
import { useData } from '../state/data';
import { useSession } from '../state/session';
import { CYCLE_WEEKS, cyclePosition, nextSlots, parseIso } from '../lib/cycle';
import { slotKey } from '../lib/plan';
import { fmtQty, upperEl } from '../lib/text';
import { WEEKDAYS, type Dish } from '../data/types';

const headFormat = new Intl.DateTimeFormat('el-GR', { weekday: 'long', day: 'numeric', month: 'long' });
const startFormat = new Intl.DateTimeFormat('el-GR', { weekday: 'long', day: 'numeric', month: 'long' });

const needsSoaking = (dish: Dish | undefined) => !!dish && /μούλιασμα/i.test(dish.note);

function Ingredients({ dish }: { dish: Dish }) {
  return (
    <ul className="ingredients">
      {dish.ingredients.map((i) => (
        <li key={`${i.name}-${i.unit}`}>
          <span>{i.name}</span>
          <span>{fmtQty(i.qty, i.unit)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Today({ onSettings }: { onSettings: () => void }) {
  const data = useData();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [openNext, setOpenNext] = useState<string | null>(null);

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
  const dishAt = (week: number, slot: number) => dishById.get(plan.get(slotKey(week, slot))?.dishId ?? '');

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

  const dish = dishAt(focus.week, focus.slot);
  const upcoming = nextSlots(focus.week, focus.slot, 2)
    .map((p) => ({ ...p, dish: dishAt(p.week, p.slot) }))
    .filter((p): p is { week: number; slot: number; dish: Dish } => !!p.dish);

  // Το φαγητό της επόμενης μέρας (για υπενθύμιση μουλιάσματος): Δευτέρα–Πέμπτη το επόμενο πιάτο,
  // Κυριακή βράδυ η Δευτέρα. Παρασκευή και Σάββατο δεν υπάρχει μεσημεριανό την επόμενη μέρα.
  let tomorrow: { slot: number; dish: Dish | undefined } | null = null;
  if (pos.started) {
    if (pos.weekday <= 3) tomorrow = { slot: pos.weekday + 1, dish: dishAt(pos.week, pos.weekday + 1) };
    else if (pos.weekday === 6) {
      const next = nextSlots(pos.week, 4, 1)[0];
      tomorrow = { slot: 0, dish: dishAt(next.week, next.slot) };
    }
  }

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

      {tomorrow && needsSoaking(tomorrow.dish) && (
        <div className="reminder" role="note">
          <strong>Απόψε</strong>
          <span>
            Βάλε στο νερό από το βράδυ για αύριο: {tomorrow.dish!.name}.
          </span>
        </div>
      )}

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
          {open && <Ingredients dish={dish} />}
          {changedBy && <p className="hero-by">Αλλαγή από {changedBy}</p>}
        </section>
      ) : (
        <p className="empty">Δεν υπάρχει πιάτο για αυτή τη μέρα. Διάλεξε από το Πλάνο.</p>
      )}

      {upcoming.length > 0 && (
        <>
          <Label>Επόμενες μέρες</Label>
          <ul className="upcoming">
            {upcoming.map((u) => {
              const key = slotKey(u.week, u.slot);
              const isOpen = openNext === key;
              return (
                <li key={key} data-cat={u.dish.category ?? undefined} className={isOpen ? 'is-open' : undefined}>
                  <button
                    type="button"
                    className="upcoming-btn"
                    aria-expanded={isOpen}
                    onClick={() => setOpenNext(isOpen ? null : key)}
                  >
                    <span className="upcoming-text">
                      <span className="day">{upperEl(WEEKDAYS[u.slot])}</span>
                      <span className="dish">{u.dish.name}</span>
                      {u.dish.note && <span className="upcoming-note">{u.dish.note}</span>}
                      <span className="upcoming-more">{isOpen ? 'Κρύψε τα υλικά' : 'Δες τα υλικά'}</span>
                    </span>
                    <span
                      className="time"
                      aria-label={`${u.dish.minutes} λεπτά${u.dish.category ? ', ' + CATEGORY_NAME[u.dish.category] : ''}`}
                    >
                      {u.dish.minutes}′
                    </span>
                  </button>
                  {isOpen && (
                    <div className="upcoming-ings">
                      <Ingredients dish={u.dish} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Screen>
  );
}
