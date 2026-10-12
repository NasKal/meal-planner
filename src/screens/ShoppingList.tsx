import { useState } from 'react';
import { CheckRow, Screen } from '../ui/components';
import { LIST_ITEMS, SECTIONS, STORES } from '../data/sample';
import { fmtQty, upperEl } from '../lib/text';

const CHECKED_BY_OTHER = 'τικ από το άλλο κινητό';

export default function ShoppingList() {
  const [store, setStore] = useState(STORES[0]);
  const [done, setDone] = useState<Set<string>>(
    () => new Set(LIST_ITEMS.filter((i) => i.doneByOther).map((i) => i.id)),
  );

  const hasData = store === STORES[0];
  const total = LIST_ITEMS.length;
  const count = done.size;

  function toggle(id: string, checked: boolean) {
    setDone((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const pending = LIST_ITEMS.filter((i) => !done.has(i.id));
  const inCart = LIST_ITEMS.filter((i) => done.has(i.id));

  return (
    <Screen>
      <h1 className="title">Λίστα αγορών</h1>

      <div className="store-tabs" role="group" aria-label="Κατάστημα">
        {STORES.map((s) => (
          <button key={s} type="button" className="store-tab" aria-pressed={s === store} onClick={() => setStore(s)}>
            {s}
          </button>
        ))}
      </div>

      {!hasData ? (
        <p className="empty">Δεν υπάρχει τίποτα για αυτό το κατάστημα αυτή την περίοδο.</p>
      ) : (
        <>
          <div className="progress">
            <div className="progress-text">
              <span>
                {count} από {total}
              </span>
              <span>Εβδ. 1–2</span>
            </div>
            <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count}>
              <i style={{ width: `${(count / total) * 100}%` }} />
            </div>
          </div>

          {SECTIONS.map((section) => {
            const items = pending.filter((i) => i.section === section);
            if (!items.length) return null;
            return (
              <section key={section}>
                <h2 className="section-title">{upperEl(section)}</h2>
                {items.map((i) => (
                  <CheckRow
                    key={i.id}
                    name={i.name}
                    qty={fmtQty(i.qty, i.unit)}
                    checked={false}
                    onChange={(c) => toggle(i.id, c)}
                  />
                ))}
              </section>
            );
          })}

          {inCart.length > 0 && (
            <section>
              <h2 className="section-title">{upperEl('Στο καλάθι')}</h2>
              {inCart.map((i) => (
                <CheckRow
                  key={i.id}
                  name={i.name}
                  qty={fmtQty(i.qty, i.unit)}
                  note={i.doneByOther ? CHECKED_BY_OTHER : undefined}
                  checked
                  onChange={(c) => toggle(i.id, c)}
                />
              ))}
            </section>
          )}
        </>
      )}
    </Screen>
  );
}
