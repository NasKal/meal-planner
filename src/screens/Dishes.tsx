import { useMemo, useState } from 'react';
import { Button, CATEGORY_NAME, CategoryTag, Notice, Screen, TextButton } from '../ui/components';
import { Icon } from '../ui/icons';
import { useData } from '../state/data';
import { useSession } from '../state/session';
import { deleteDish, planUses, setFavorite, setHidden, setRating } from '../lib/dishes';
import { friendlyError } from '../lib/errors';
import { fmtQty, upperEl } from '../lib/text';
import { SECTIONS, type Category, type Dish, type DishKind } from '../data/types';
import DishEditor from './DishEditor';

type Filter = 'all' | 'fav' | Category | 'dinner' | 'breakfast';

const FILTERS: [Filter, string][] = [
  ['all', 'Όλα'],
  ['fav', 'Αγαπημένα'],
  ['legume', 'Όσπρια'],
  ['veg', 'Λαχανικά'],
  ['meat', 'Κρέας'],
  ['fish', 'Ψάρι'],
  ['dinner', 'Βραδινά'],
  ['breakfast', 'Πρωινό'],
];

type View = { name: 'list' } | { name: 'detail'; id: string } | { name: 'edit'; id: string | null; kind: DishKind };

const norm = (s: string) => s.toLocaleLowerCase('el').normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Dishes({ onSettings }: { onSettings: () => void }) {
  const data = useData();
  const session = useSession();
  const [view, setView] = useState<View>({ name: 'list' });
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const dishes = data.status === 'ready' ? data.data.dishes : [];
  const visible = useMemo(() => {
    const q = norm(query.trim());
    return dishes
      .filter((d) => {
        if (filter === 'all') return true;
        if (filter === 'fav') return d.favorite;
        if (filter === 'dinner' || filter === 'breakfast') return d.kind === filter;
        return d.kind === 'lunch' && d.category === filter;
      })
      .filter((d) => !q || norm(d.name).includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, 'el'));
  }, [dishes, filter, query]);

  if (data.status !== 'ready' || session.status !== 'ready') {
    return (
      <Screen onSettings={onSettings}>
        <p className="empty">Φόρτωση…</p>
      </Screen>
    );
  }
  const householdId = session.household.id;

  if (view.name === 'edit') {
    return (
      <DishEditor
        householdId={householdId}
        dishId={view.id}
        kind={view.kind}
        onDone={(id) => setView(id ? { name: 'detail', id } : { name: 'list' })}
      />
    );
  }

  if (view.name === 'detail') {
    const dish = data.data.dishById.get(view.id);
    if (!dish) {
      // Το πιάτο διαγράφηκε (ίσως από το άλλο κινητό).
      return (
        <Screen onSettings={onSettings}>
          <p className="empty">Το πιάτο δεν υπάρχει πια.</p>
          <div className="stack">
            <Button onClick={() => setView({ name: 'list' })}>Πίσω στα πιάτα</Button>
          </div>
        </Screen>
      );
    }
    return (
      <DishDetail
        dish={dish}
        householdId={householdId}
        onBack={() => setView({ name: 'list' })}
        onEdit={() => setView({ name: 'edit', id: dish.id, kind: dish.kind })}
      />
    );
  }

  return (
    <Screen onSettings={onSettings}>
      <h1 className="title">Πιάτα</h1>

      <div className="stack">
        {adding ? (
          <div className="kind-picker" role="group" aria-label="Τι είδους πιάτο;">
            <Button onClick={() => setView({ name: 'edit', id: null, kind: 'lunch' })}>Μεσημεριανό</Button>
            <Button tone="outline" onClick={() => setView({ name: 'edit', id: null, kind: 'dinner' })}>
              Βραδινό
            </Button>
            <Button tone="outline" onClick={() => setView({ name: 'edit', id: null, kind: 'breakfast' })}>
              Πρωινό
            </Button>
            <TextButton onClick={() => setAdding(false)}>Ακύρωση</TextButton>
          </div>
        ) : (
          <Button onClick={() => setAdding(true)}>Νέο πιάτο</Button>
        )}
      </div>

      <div className="stack">
        <label className="sr-only" htmlFor="dish-search">
          Αναζήτηση πιάτου
        </label>
        <input
          id="dish-search"
          className="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Αναζήτηση πιάτου"
          autoComplete="off"
        />
      </div>

      <div className="store-tabs" role="group" aria-label="Φίλτρο">
        {FILTERS.map(([id, label]) => (
          <button key={id} type="button" className="store-tab" aria-pressed={filter === id} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      <p className="hint">
        {visible.length} {visible.length === 1 ? 'πιάτο' : 'πιάτα'}
      </p>

      <ul className="dish-list">
        {visible.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              className={`dish-row${d.hidden ? ' is-hidden' : ''}`}
              data-cat={d.category ?? undefined}
              onClick={() => setView({ name: 'detail', id: d.id })}
            >
              <span className="dish-row-main">
                <strong>{d.name}</strong>
                <span>
                  {d.kind === 'lunch' && d.category ? CATEGORY_NAME[d.category] : d.kind === 'dinner' ? 'Βραδινό' : d.kind === 'breakfast' ? 'Πρωινό' : ''}
                  {d.kind === 'lunch' ? ` · ${d.minutes}′` : ''}
                  {d.hidden ? ' · κρυμμένο' : ''}
                </span>
              </span>
              {d.favorite && (
                <span className="fav-mark" aria-label="Αγαπημένο">
                  <Star filled />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="empty">Δεν βρέθηκε πιάτο.</p>}
    </Screen>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </svg>
  );
}

function DishDetail({
  dish,
  householdId,
  onBack,
  onEdit,
}: {
  dish: Dish;
  householdId: string;
  onBack: () => void;
  onEdit: () => void;
}) {
  const data = useData();
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const stores = data.status === 'ready' ? data.data.stores : [];
  const plan = data.status === 'ready' ? data.data.plan : new Map();
  const uses = planUses(dish.id, plan);

  const run = async (action: Promise<unknown>) => {
    setError('');
    try {
      await action;
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  async function remove() {
    setError('');
    try {
      await deleteDish(householdId, dish.id);
      onBack();
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;
  const bySection = SECTIONS.map(([code, label]) => ({
    code,
    label,
    items: dish.ingredients.filter((i) => i.section === code),
  })).filter((s) => s.items.length);

  return (
    <main className="screen">
      <header className="settings-head">
        <button type="button" className="icon-btn static" aria-label="Πίσω" onClick={onBack}>
          <Icon name="back" />
        </button>
        <h1 className="title detail-title">{dish.name}</h1>
      </header>

      <div className="stack detail-meta" data-cat={dish.category ?? undefined}>
        {dish.category && <CategoryTag category={dish.category} />}
        {dish.kind !== 'lunch' && <span className="kind-tag">{dish.kind === 'dinner' ? 'Βραδινό' : 'Πρωινό'}</span>}
        {dish.kind === 'lunch' && (
          <span>
            {dish.minutes}′{dish.minutesPressure ? ` (${dish.minutesPressure}′ με χύτρα)` : ''}
          </span>
        )}
        {dish.hidden && <span className="kind-tag">Κρυμμένο</span>}
      </div>
      {dish.note && <p className="hint">{dish.note}</p>}

      <div className="stack detail-actions">
        <button
          type="button"
          className={`fav-btn${dish.favorite ? ' is-on' : ''}`}
          aria-pressed={dish.favorite}
          onClick={() => run(setFavorite(householdId, dish.id, !dish.favorite))}
        >
          <Star filled={dish.favorite} /> {dish.favorite ? 'Αγαπημένο' : 'Βάλε στα αγαπημένα'}
        </button>

        <div className="rating" role="group" aria-label="Αξιολόγηση">
          <span>Αξιολόγηση</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} από 5`}
              aria-pressed={(dish.rating ?? 0) >= n}
              onClick={() => run(setRating(householdId, dish.id, dish.rating === n ? null : n))}
            >
              <Star filled={(dish.rating ?? 0) >= n} />
            </button>
          ))}
        </div>
      </div>

      <section className="panel">
        <h2 className="panel-title">{upperEl(`Υλικά για ${dish.kind === 'breakfast' ? '1 άτομο' : '2 άτομα'}`)}</h2>
        {bySection.length === 0 && <p className="panel-sub">Δεν έχουν οριστεί υλικά.</p>}
        {bySection.map((s) => (
          <div key={s.code}>
            <p className="ing-section">{s.label}</p>
            <ul className="ingredients plain">
              {s.items.map((i) => (
                <li key={`${i.name}-${i.unit}`}>
                  <span>
                    {i.name}
                    <small>{storeName(i.store)}</small>
                  </span>
                  <span>{fmtQty(i.qty, i.unit)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {uses.length > 0 && (
        <p className="hint">Χρησιμοποιείται στο πλάνο: {uses.join(', ')}.</p>
      )}

      {error && (
        <div className="stack">
          <Notice>{error}</Notice>
        </div>
      )}

      <div className="stack detail-buttons">
        <Button onClick={onEdit}>Επεξεργασία</Button>
        <Button tone="outline" onClick={() => run(setHidden(householdId, dish.id, !dish.hidden))}>
          {dish.hidden ? 'Εμφάνιση ξανά στις επιλογές' : 'Απόκρυψη από τις επιλογές'}
        </Button>

        {uses.length > 0 ? (
          <p className="hint">Για να το διαγράψεις, αντικατάστησέ το πρώτα στο πλάνο. Μέχρι τότε μπορείς να το κρύψεις.</p>
        ) : confirming ? (
          <div className="confirm">
            <p>Να διαγραφεί οριστικά το «{dish.name}»;</p>
            <Button tone="danger" onClick={remove}>
              Ναι, διαγραφή
            </Button>
            <TextButton onClick={() => setConfirming(false)}>Όχι</TextButton>
          </div>
        ) : (
          <Button tone="outline" className="danger-outline" onClick={() => setConfirming(true)}>
            Διαγραφή πιάτου
          </Button>
        )}
      </div>
    </main>
  );
}
