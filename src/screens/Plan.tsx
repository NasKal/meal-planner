import { useEffect, useRef, useState } from 'react';
import { Button, CategoryTag, Notice, Screen } from '../ui/components';
import { Sheet } from '../ui/Sheet';
import { useData } from '../state/data';
import { useSession } from '../state/session';
import { CYCLE_WEEKS, PLAN_DAYS, addDays, cyclePosition } from '../lib/cycle';
import { dishesWithTag, randomDish, setPlanSlot, slotKey, weekBalance } from '../lib/plan';
import { upperEl } from '../lib/text';
import { CATEGORY_NAME } from '../ui/components';
import { WEEKDAYS, type Dish } from '../data/types';
import { friendlyError } from '../lib/errors';

const rangeFormat = new Intl.DateTimeFormat('el-GR', { day: 'numeric', month: 'short' });

type Editing = { week: number; slot: number } | null;

export default function Plan({ onSettings }: { onSettings: () => void }) {
  const data = useData();
  const session = useSession();
  const [editing, setEditing] = useState<Editing>(null);
  const [allCategories, setAllCategories] = useState(false);
  const [error, setError] = useState('');
  const currentRef = useRef<HTMLElement | null>(null);

  // Στην πρώτη εμφάνιση, κύλισε στη σημερινή εβδομάδα.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'start' });
  }, [data.status]);

  if (data.status !== 'ready' || session.status !== 'ready') {
    return (
      <Screen onSettings={onSettings}>
        <p className="empty">Φόρτωση…</p>
      </Screen>
    );
  }

  const { plan, dishById, dishes, cycleStartDate } = data.data;
  const { household, user } = session;
  const pos = cyclePosition(cycleStartDate, new Date());
  const mushrooms = dishesWithTag('mush', plan, dishById);

  const editingDish = editing ? dishById.get(plan.get(slotKey(editing.week, editing.slot))?.dishId ?? '') : undefined;
  const options: Dish[] = editing
    ? dishes
        .filter((d) => d.kind === 'lunch' && !d.hidden)
        .filter((d) => allCategories || !editingDish?.category || d.category === editingDish.category)
        .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.name.localeCompare(b.name, 'el'))
    : [];

  async function pick(dishId: string) {
    if (!editing) return;
    setError('');
    const { week, slot } = editing;
    setEditing(null);
    try {
      await setPlanSlot(household.id, week, slot, dishId, user.uid);
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  function pickRandom() {
    const dish = randomDish(editingDish, plan, dishes);
    if (dish) void pick(dish.id);
  }

  return (
    <Screen onSettings={onSettings}>
      <h1 className="title">Πλάνο 4 εβδομάδων</h1>
      {error && (
        <div className="stack">
          <Notice>{error}</Notice>
        </div>
      )}
      {mushrooms > 1 && (
        <div className="stack">
          <Notice tone="info">Έχετε {mushrooms} πιάτα με μανιτάρια στον κύκλο. Ο στόχος είναι ένα.</Notice>
        </div>
      )}

      {Array.from({ length: CYCLE_WEEKS }, (_, week) => {
        const weekStart = addDays(cycleStartDate, week * 7);
        const weekEnd = addDays(cycleStartDate, week * 7 + PLAN_DAYS - 1);
        const isCurrent = pos.started && pos.week === week;
        return (
          <section
            key={week}
            className="plan-week"
            ref={isCurrent ? currentRef : undefined}
            aria-labelledby={`week-${week}`}
          >
            <div className="plan-week-head">
              <h2 id={`week-${week}`}>Εβδομάδα {week + 1}</h2>
              <span>
                {rangeFormat.format(weekStart)} – {rangeFormat.format(weekEnd)}
              </span>
            </div>
            <ul className="balance" aria-label="Ισορροπία εβδομάδας">
              {weekBalance(week, plan, dishById).map((b) => (
                <li key={b.category} className={b.ok ? 'ok' : 'warn'}>
                  <span aria-hidden="true">{b.ok ? '✓' : '!'}</span> {CATEGORY_NAME[b.category]} {b.count}/{b.target}
                </li>
              ))}
            </ul>

            {Array.from({ length: PLAN_DAYS }, (_, slot) => {
              const entry = plan.get(slotKey(week, slot));
              const dish = dishById.get(entry?.dishId ?? '');
              const isToday = isCurrent && pos.slot === slot;
              const by = entry?.updatedBy && entry.updatedBy !== user.uid ? household.members?.[entry.updatedBy]?.displayName : null;
              return (
                <article
                  key={slot}
                  className={`plan-card${isToday ? ' is-today' : ''}`}
                  data-cat={dish?.category ?? undefined}
                >
                  <div className="plan-top">
                    <span className="day">{upperEl(WEEKDAYS[slot])}</span>
                    {isToday && <span className="today-mark">ΣΗΜΕΡΑ</span>}
                    {dish && <span className="time">{dish.minutes}′</span>}
                  </div>
                  <h3>{dish ? dish.name : 'Χωρίς πιάτο'}</h3>
                  <div className="plan-meta">
                    {dish?.category && <CategoryTag category={dish.category} />}
                    {dish?.batch && <span>ταψί, βγαίνουν περισσεύματα</span>}
                    {by && <span>Αλλαγή από {by}</span>}
                  </div>
                  <Button tone="outline" onClick={() => setEditing({ week, slot })}>
                    Άλλαξε
                  </Button>
                </article>
              );
            })}
          </section>
        );
      })}

      <Sheet
        open={editing !== null}
        title={editing ? `Εβδομάδα ${editing.week + 1} · ${WEEKDAYS[editing.slot]}` : ''}
        onClose={() => setEditing(null)}
      >
        <div className="sheet-actions">
          <Button onClick={pickRandom}>Τυχαίο πιάτο</Button>
          <div className="store-tabs" role="group" aria-label="Φίλτρο">
            <button type="button" className="store-tab" aria-pressed={!allCategories} onClick={() => setAllCategories(false)}>
              Ίδια κατηγορία
            </button>
            <button type="button" className="store-tab" aria-pressed={allCategories} onClick={() => setAllCategories(true)}>
              Όλα
            </button>
          </div>
        </div>
        <ul className="options">
          {options.map((d) => {
            const isCurrent = d.id === editingDish?.id;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  className="option"
                  data-cat={d.category ?? undefined}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => pick(d.id)}
                >
                  <strong>{d.name}</strong>
                  <span>
                    {d.category ? CATEGORY_NAME[d.category] : ''} · {d.minutes}′{isCurrent ? ' · τώρα' : ''}{d.favorite ? ' · αγαπημένο' : ''}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    </Screen>
  );
}
