import { useState, type FormEvent } from 'react';
import { Button, Notice, TextButton, TextField } from '../ui/components';
import { Icon } from '../ui/icons';
import { useData } from '../state/data';
import { emptyDish, saveDish, toInput, UNITS, type DishInput } from '../lib/dishes';
import { friendlyError } from '../lib/errors';
import { SECTIONS, type Category, type DishKind } from '../data/types';
import { CATEGORY_NAME } from '../ui/components';

type Props = {
  householdId: string;
  /** null = νέο πιάτο. */
  dishId: string | null;
  kind: DishKind;
  onDone: (savedId: string | null) => void;
};

const DEFAULT_SECTION: Record<string, string> = { skl: 'dry', laiki: 'veg', psaras: 'fish', varda: 'dairy' };

const KIND_LABEL: Record<DishKind, string> = { lunch: 'Μεσημεριανό', dinner: 'Βραδινό', breakfast: 'Πρωινό' };

export default function DishEditor({ householdId, dishId, kind, onDone }: Props) {
  const data = useData();
  const existing = data.status === 'ready' && dishId ? data.data.dishById.get(dishId) : undefined;
  const stores = data.status === 'ready' ? data.data.stores : [];

  const [form, setForm] = useState<DishInput>(() => (existing ? toInput(existing) : emptyDish(kind)));
  const [minutes, setMinutes] = useState(String(form.minutes || ''));
  const [pressure, setPressure] = useState(form.minutesPressure ? String(form.minutesPressure) : '');
  const [qty, setQty] = useState<string[]>(() => form.ingredients.map((i) => String(i.qty)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof DishInput>(key: K, value: DishInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const defaultStore = stores[0]?.id ?? 'skl';

  function updateIngredient(index: number, patch: Partial<DishInput['ingredients'][number]>) {
    set(
      'ingredients',
      form.ingredients.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)),
    );
  }

  function addIngredient() {
    set('ingredients', [
      ...form.ingredients,
      { name: '', qty: 0, unit: 'γρ', store: defaultStore, section: DEFAULT_SECTION[defaultStore] ?? 'other' },
    ]);
    setQty((q) => [...q, '']);
  }

  function removeIngredient(index: number) {
    set(
      'ingredients',
      form.ingredients.filter((_, i) => i !== index),
    );
    setQty((q) => q.filter((_, i) => i !== index));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const name = form.name.trim();
    if (!name) return setError('Γράψε ένα όνομα για το πιάτο.');
    const mins = Number(minutes.replace(',', '.'));
    if (form.kind === 'lunch' && (!Number.isFinite(mins) || mins < 1)) return setError('Γράψε πόσα λεπτά κάνει το πιάτο.');
    const pressureMins = pressure.trim() ? Number(pressure.replace(',', '.')) : null;
    if (pressureMins !== null && (!Number.isFinite(pressureMins) || pressureMins < 1)) {
      return setError('Οι χρόνοι με χύτρα πρέπει να είναι αριθμός λεπτών, ή άφησέ τους κενούς.');
    }

    const ingredients = form.ingredients
      .map((ing, i) => ({ ...ing, name: ing.name.trim(), qty: Number(String(qty[i] ?? '').replace(',', '.')) || 0 }))
      .filter((ing) => ing.name);
    if (ingredients.length === 0 && form.kind !== 'lunch') return setError('Πρόσθεσε τουλάχιστον ένα υλικό.');

    setBusy(true);
    try {
      const id = await saveDish(householdId, dishId, {
        ...form,
        name,
        minutes: form.kind === 'lunch' ? Math.round(mins) : 0,
        minutesPressure: pressureMins === null ? null : Math.round(pressureMins),
        note: form.note.trim(),
        ingredients,
      });
      onDone(id);
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  const hasMushrooms = form.tags.includes('mush');

  return (
    <main className="screen">
      <header className="settings-head">
        <button type="button" className="icon-btn static" aria-label="Πίσω" onClick={() => onDone(dishId)}>
          <Icon name="back" />
        </button>
        <h1 className="title">{dishId ? 'Επεξεργασία πιάτου' : `Νέο πιάτο`}</h1>
      </header>

      <form className="form editor" onSubmit={submit} noValidate>
        {!dishId && <p className="panel-sub">{KIND_LABEL[form.kind]}</p>}

        <TextField label="Όνομα" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="off" />

        {form.kind === 'lunch' && (
          <>
            <div className="field">
              <label htmlFor="dish-category">Κατηγορία</label>
              <select
                id="dish-category"
                value={form.category ?? 'veg'}
                onChange={(e) => set('category', e.target.value as Category)}
              >
                {(Object.keys(CATEGORY_NAME) as Category[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_NAME[c]}
                  </option>
                ))}
              </select>
            </div>

            <div className="two-cols">
              <TextField
                label="Λεπτά"
                inputMode="numeric"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                autoComplete="off"
              />
              <TextField
                label="Λεπτά με χύτρα"
                inputMode="numeric"
                value={pressure}
                onChange={(e) => setPressure(e.target.value)}
                autoComplete="off"
                hint="Προαιρετικό"
              />
            </div>

            <TextField
              label="Σημείωση"
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              autoComplete="off"
              hint="Π.χ. «Μούλιασμα από το βράδυ.» Με τη λέξη μούλιασμα εμφανίζεται υπενθύμιση."
            />

            <label className="toggle">
              <input type="checkbox" checked={form.batch} onChange={(e) => set('batch', e.target.checked)} />
              <span>Βγάζει περισσεύματα (ταψί)</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={hasMushrooms}
                onChange={(e) =>
                  set('tags', e.target.checked ? [...form.tags, 'mush'] : form.tags.filter((t) => t !== 'mush'))
                }
              />
              <span>Έχει μανιτάρια</span>
            </label>
          </>
        )}

        <h2 className="editor-title">Υλικά για {form.kind === 'breakfast' ? '1 άτομο' : '2 άτομα'}</h2>
        {form.ingredients.length === 0 && <p className="panel-sub">Δεν έχεις προσθέσει υλικά ακόμα.</p>}

        {form.ingredients.map((ing, i) => (
          <fieldset key={i} className="ing-card">
            <legend className="sr-only">Υλικό {i + 1}</legend>
            <TextField
              label="Υλικό"
              id={`ing-name-${i}`}
              value={ing.name}
              onChange={(e) => updateIngredient(i, { name: e.target.value })}
              autoComplete="off"
            />
            <div className="two-cols">
              <TextField
                label="Ποσότητα"
                id={`ing-qty-${i}`}
                inputMode="decimal"
                value={qty[i] ?? ''}
                onChange={(e) => setQty((q) => q.map((v, j) => (j === i ? e.target.value : v)))}
                autoComplete="off"
              />
              <div className="field">
                <label htmlFor={`ing-unit-${i}`}>Μονάδα</label>
                <select id={`ing-unit-${i}`} value={ing.unit} onChange={(e) => updateIngredient(i, { unit: e.target.value })}>
                  {[...new Set([...UNITS, ing.unit])].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="one-col">
              <div className="field">
                <label htmlFor={`ing-store-${i}`}>Κατάστημα</label>
                <select id={`ing-store-${i}`} value={ing.store} onChange={(e) =>
                    updateIngredient(i, { store: e.target.value, section: DEFAULT_SECTION[e.target.value] ?? ing.section })
                  }>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor={`ing-section-${i}`}>Ενότητα</label>
                <select
                  id={`ing-section-${i}`}
                  value={ing.section}
                  onChange={(e) => updateIngredient(i, { section: e.target.value })}
                >
                  {SECTIONS.map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <TextButton onClick={() => removeIngredient(i)}>Αφαίρεση υλικού</TextButton>
          </fieldset>
        ))}

        <Button tone="outline" onClick={addIngredient}>
          Πρόσθεσε υλικό
        </Button>

        {error && <Notice>{error}</Notice>}
        <Button type="submit" disabled={busy}>
          {busy ? 'Μια στιγμή…' : 'Αποθήκευση'}
        </Button>
        <TextButton onClick={() => onDone(dishId)}>Ακύρωση</TextButton>
      </form>
    </main>
  );
}
