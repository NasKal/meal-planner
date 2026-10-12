import { useState } from 'react';
import { Notice, Screen } from '../ui/components';
import { useData } from '../state/data';
import { useSession } from '../state/session';
import { cyclePosition } from '../lib/cycle';
import { changeExtraCount } from '../lib/shopping';
import { friendlyError } from '../lib/errors';
import type { Dish } from '../data/types';

const MAX_PER_PERIOD = 14;

export default function Evening({ onSettings }: { onSettings: () => void }) {
  const data = useData();
  const session = useSession();
  const [period, setPeriod] = useState<number | null>(null);
  const [error, setError] = useState('');

  if (data.status !== 'ready' || session.status !== 'ready') {
    return (
      <Screen onSettings={onSettings}>
        <p className="empty">Φόρτωση…</p>
      </Screen>
    );
  }

  const { dishes, extras, cycleStartDate } = data.data;
  const { household, user } = session;
  const pos = cyclePosition(cycleStartDate, new Date());
  const current = period ?? (pos.started ? Math.floor(pos.week / 2) : 0);

  const count = (dish: Dish) => extras.get(`${dish.id}_${current}`) ?? 0;
  const dinners = dishes.filter((d) => d.kind === 'dinner' && !d.hidden);
  const breakfasts = dishes.filter((d) => d.kind === 'breakfast' && !d.hidden);
  const total = (list: Dish[]) => list.reduce((sum, d) => sum + count(d), 0);

  async function change(dish: Dish, delta: number) {
    const next = count(dish) + delta;
    if (next < 0 || next > MAX_PER_PERIOD) return;
    setError('');
    try {
      await changeExtraCount(household.id, dish.id, current, delta, user.uid);
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  const renderRow = (dish: Dish) => (
    <li key={dish.id} className="extra-row">
      <div className="extra-text">
        <strong>{dish.name}</strong>
        <span>{dish.ingredients.map((i) => i.name).join(', ')}</span>
      </div>
      <div className="stepper" role="group" aria-label={dish.name}>
        <button type="button" aria-label={`Λιγότερο: ${dish.name}`} disabled={count(dish) === 0} onClick={() => change(dish, -1)}>
          −
        </button>
        <output aria-live="polite">{count(dish)}</output>
        <button
          type="button"
          aria-label={`Περισσότερο: ${dish.name}`}
          disabled={count(dish) >= MAX_PER_PERIOD}
          onClick={() => change(dish, 1)}
        >
          +
        </button>
      </div>
    </li>
  );

  return (
    <Screen onSettings={onSettings}>
      <h1 className="title">Βραδινά και πρωινό</h1>

      <div className="store-tabs" role="group" aria-label="Περίοδος">
        {[0, 1].map((p) => (
          <button key={p} type="button" className="store-tab" aria-pressed={current === p} onClick={() => setPeriod(p)}>
            Εβδ. {2 * p + 1}–{2 * p + 2}
          </button>
        ))}
      </div>

      {error && (
        <div className="stack">
          <Notice>{error}</Notice>
        </div>
      )}

      <p className="hint">
        Πόσες φορές θα φάτε το καθένα σε αυτές τις 2 εβδομάδες (περίπου 10 καθημερινές). Τα υλικά μπαίνουν μόνα τους στη λίστα
        αγορών.
      </p>

      <div className="extras-head">
        <h2>Βραδινά</h2>
        <span>σύνολο {total(dinners)}</span>
      </div>
      <ul className="extras">{dinners.map(renderRow)}</ul>

      <div className="extras-head">
        <h2>Πρωινό για ένα άτομο</h2>
        <span>σύνολο {total(breakfasts)}</span>
      </div>
      <ul className="extras">{breakfasts.map(renderRow)}</ul>
    </Screen>
  );
}
