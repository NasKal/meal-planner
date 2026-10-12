import { useMemo, useState, type FormEvent } from 'react';
import { Button, Notice, Screen } from '../ui/components';
import { useData } from '../state/data';
import { useSession } from '../state/session';
import { cyclePosition, parseIso } from '../lib/cycle';
import {
  addManualItem,
  buildList,
  checkId,
  periodsFor,
  removeManualItem,
  setCheck,
  setManualDone,
  type ListItem,
} from '../lib/shopping';
import { fmtQty, upperEl } from '../lib/text';
import { friendlyError } from '../lib/errors';
import { BASICS, SECTIONS } from '../data/types';

const rangeFormat = new Intl.DateTimeFormat('el-GR', { day: 'numeric', month: 'short' });

/** Μια γραμμή της οθόνης: ό,τι χρειάζεται για να εμφανιστεί, είτε προέρχεται από πιάτα, είτε είναι χειροκίνητο. */
type Row = {
  id: string;
  name: string;
  qty: string;
  section: string;
  kind: 'dish' | 'basic' | 'manual';
  state: 'pending' | 'bought' | 'have';
  by: string | null;
  manualId?: string;
};

export default function ShoppingList({ onSettings }: { onSettings: () => void }) {
  const data = useData();
  const session = useSession();
  const [pick, setPick] = useState<{ storeId: string; periodIdx: number | null } | null>(null);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const ready = data.status === 'ready' && session.status === 'ready';
  const d = ready ? data.data : null;

  // Ποιος κύκλος και ποια εβδομάδα: από Παρασκευή και μετά δείχνουμε την επόμενη, γιατί τότε γίνονται τα ψώνια.
  const view = useMemo(() => {
    if (!d) return null;
    const pos = cyclePosition(d.cycleStartDate, new Date());
    const absWeek = pos.started ? Math.floor(pos.daysSinceStart / 7) + (pos.weekday >= 4 ? 1 : 0) : 0;
    return { cycleNo: Math.floor(absWeek / 4), week: absWeek % 4 };
  }, [d]);

  if (!ready || !d || !view) {
    return (
      <Screen onSettings={onSettings}>
        <p className="empty">Φόρτωση…</p>
      </Screen>
    );
  }

  const { household, user } = session;
  const memberName = (uid: string | null) =>
    uid && uid !== user.uid ? household.members?.[uid]?.displayName ?? null : null;

  const store = d.stores.find((s) => s.id === (pick?.storeId ?? d.stores[0]?.id)) ?? d.stores[0];
  if (!store) {
    return (
      <Screen onSettings={onSettings}>
        <p className="empty">Δεν υπάρχουν καταστήματα.</p>
      </Screen>
    );
  }
  const isFirstStore = store.id === d.stores[0].id;
  const periods = periodsFor(store, d.cycleStartDate, view.cycleNo);
  const defaultIdx = Math.min(periods.length - 1, Math.floor(view.week / (store.cadence === 'twoWeeks' ? 2 : 1)));
  const periodIdx = pick && pick.storeId === store.id && pick.periodIdx !== null ? pick.periodIdx : defaultIdx;
  const period = periods[periodIdx];

  // ---- Γραμμές
  const items: ListItem[] = buildList(store, period, d);
  const rows: Row[] = items.map((i) => {
    const c = d.checks.get(checkId(store.id, period.startIso, i.key));
    return {
      id: i.key,
      name: i.name,
      qty: fmtQty(i.qty, i.unit),
      section: i.section,
      kind: 'dish',
      state: c?.state ?? 'pending',
      by: c?.by ?? null,
    };
  });
  if (isFirstStore) {
    for (const name of BASICS) {
      const key = `b:${name}`;
      const c = d.checks.get(checkId(store.id, period.startIso, key));
      rows.push({ id: key, name, qty: '', section: 'basic', kind: 'basic', state: c?.state ?? 'pending', by: c?.by ?? null });
    }
  }
  for (const m of d.manualItems) {
    if (m.storeId !== store.id || m.periodStart !== period.startIso) continue;
    rows.push({
      id: `m:${m.id}`,
      name: m.name,
      qty: '',
      section: 'manual',
      kind: 'manual',
      state: m.done ? 'bought' : 'pending',
      by: m.by,
      manualId: m.id,
    });
  }

  const pending = rows.filter((r) => r.state === 'pending');
  const bought = rows.filter((r) => r.state === 'bought');
  const have = rows.filter((r) => r.state === 'have');
  const total = pending.length + bought.length;

  // ---- Ενέργειες
  async function run(action: Promise<unknown>) {
    setError('');
    try {
      await action;
    } catch (err) {
      setError(friendlyError(err));
    }
  }
  const mark = (row: Row, state: 'bought' | 'have' | null) => {
    if (row.kind === 'manual' && row.manualId) {
      return run(setManualDone(household.id, row.manualId, state === 'bought', user.uid));
    }
    return run(setCheck(household.id, checkId(store.id, period.startIso, row.id), state, user.uid));
  };

  function submitNew(e: FormEvent) {
    e.preventDefault();
    const name = newItem.trim();
    if (!name) return;
    setNewItem('');
    void run(addManualItem(household.id, store.id, period.startIso, name, user.uid));
  }

  async function copyList() {
    const lines = [`${store.name} · ${period.label}`];
    const sections = [...SECTIONS.map(([code, label]) => [code, label] as const), ['basic', 'Βασικά'] as const, ['manual', 'Άλλα προϊόντα'] as const];
    for (const [code, label] of sections) {
      const group = pending.filter((r) => r.section === code);
      if (!group.length) continue;
      lines.push('', label);
      group.sort((a, b) => a.name.localeCompare(b.name, 'el')).forEach((r) => lines.push(`- ${r.name}${r.qty ? ' — ' + r.qty : ''}`));
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Δεν έγινε αντιγραφή. Δοκίμασε ξανά.');
    }
  }

  // ---- Εμφάνιση
  const sectionRows = (code: string) =>
    pending.filter((r) => r.section === code).sort((a, b) => a.name.localeCompare(b.name, 'el'));
  const sectionList: [string, string][] = [
    ...SECTIONS,
    ['basic', 'Βασικά: έλεγξε αν τελείωσαν'],
    ['manual', 'Άλλα προϊόντα'],
  ];
  const dateRange = `${rangeFormat.format(parseIso(period.startIso))} – ${rangeFormat.format(parseIso(period.endIso))}`;

  return (
    <Screen onSettings={onSettings}>
      <h1 className="title">Λίστα αγορών</h1>

      <div className="store-tabs" role="group" aria-label="Κατάστημα">
        {d.stores.map((s) => (
          <button
            key={s.id}
            type="button"
            className="store-tab"
            aria-pressed={s.id === store.id}
            onClick={() => setPick({ storeId: s.id, periodIdx: null })}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="store-tabs period-tabs" role="group" aria-label="Περίοδος">
        {periods.map((p, i) => (
          <button
            key={p.startIso}
            type="button"
            className="store-tab"
            aria-pressed={i === periodIdx}
            onClick={() => setPick({ storeId: store.id, periodIdx: i })}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="progress">
        <div className="progress-text">
          <span>
            {bought.length} από {total}
          </span>
          <span>{dateRange}</span>
        </div>
        <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={bought.length}>
          <i style={{ width: total ? `${(bought.length / total) * 100}%` : '0%' }} />
        </div>
      </div>

      {error && (
        <div className="stack">
          <Notice>{error}</Notice>
        </div>
      )}

      {items.length === 0 && manualCount(d.manualItems, store.id, period.startIso) === 0 && !isFirstStore && (
        <p className="empty">Δεν υπάρχει τίποτα για αυτό το κατάστημα αυτή την περίοδο.</p>
      )}

      {sectionList.map(([code, label]) => {
        const group = sectionRows(code);
        if (!group.length) return null;
        return (
          <section key={code}>
            <h2 className="section-title">{upperEl(label)}</h2>
            {group.map((r) => (
              <ListRow key={r.id} row={r} onTick={() => mark(r, 'bought')} onHave={r.kind === 'dish' ? () => mark(r, 'have') : undefined} />
            ))}
          </section>
        );
      })}

      {bought.length > 0 && (
        <section>
          <h2 className="section-title">{upperEl('Στο καλάθι')}</h2>
          {bought.map((r) => (
            <ListRow
              key={r.id}
              row={r}
              note={memberName(r.by) ? `τικ από ${memberName(r.by)}` : undefined}
              onTick={() => mark(r, null)}
              onRemove={r.kind === 'manual' && r.manualId ? () => run(removeManualItem(household.id, r.manualId!)) : undefined}
            />
          ))}
        </section>
      )}

      {have.length > 0 && (
        <section>
          <h2 className="section-title">{upperEl(`Τα έχετε ήδη (${have.length})`)}</h2>
          {have.map((r) => (
            <div key={r.id} className="have-row">
              <span>
                <strong>{r.name}</strong>
                {r.qty && <span className="check-qty"> {r.qty}</span>}
              </span>
              <button type="button" className="text-btn" onClick={() => mark(r, null)}>
                Πίσω στη λίστα
              </button>
            </div>
          ))}
        </section>
      )}

      <form className="add-item" onSubmit={submitNew}>
        <label htmlFor="new-item">Πρόσθεσε κάτι που λείπει</label>
        <div className="add-item-row">
          <input
            id="new-item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="π.χ. χαρτί κουζίνας"
            autoComplete="off"
          />
          <Button type="submit" disabled={!newItem.trim()}>
            Πρόσθεσε
          </Button>
        </div>
      </form>

      <div className="stack list-foot">
        <Button tone="outline" onClick={copyList}>
          {copied ? 'Αντιγράφηκε' : 'Αντιγραφή λίστας'}
        </Button>
        <p className="hint">Οι ποσότητες είναι εκτιμήσεις για να μην ξεχάσετε κάτι. Στο μάρκετ πάρτε την πιο κοντινή συσκευασία.</p>
      </div>
    </Screen>
  );
}

function manualCount(items: { storeId: string; periodStart: string }[], storeId: string, periodStart: string) {
  return items.filter((m) => m.storeId === storeId && m.periodStart === periodStart).length;
}

function ListRow({
  row,
  note,
  onTick,
  onHave,
  onRemove,
}: {
  row: Row;
  note?: string;
  onTick: () => void;
  onHave?: () => void;
  onRemove?: () => void;
}) {
  const done = row.state === 'bought';
  return (
    <label className={`check-row${done ? ' is-done' : ''}`}>
      <input type="checkbox" checked={done} onChange={onTick} />
      <span className="check-box" aria-hidden="true">
        {done && <TickIcon />}
      </span>
      <span className="check-text">
        <span className="check-name">{row.name}</span>
        {note && <span className="check-note">{note}</span>}
        {(onHave || onRemove) && (
          <span className="check-actions">
            {onHave && (
              <button
                type="button"
                className="mini-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onHave();
                }}
              >
                Το έχω
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                className="mini-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
              >
                Διαγραφή
              </button>
            )}
          </span>
        )}
      </span>
      {row.qty && <span className="check-qty">{row.qty}</span>}
    </label>
  );
}

function TickIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

