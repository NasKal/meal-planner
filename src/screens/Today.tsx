import { useState } from 'react';
import { Button, CategoryTag, Label, Screen, CATEGORY_NAME } from '../ui/components';
import { DINNER_TONIGHT, TODAY_DISH, UPCOMING } from '../data/sample';
import { fmtQty, upperEl } from '../lib/text';

const dateFormat = new Intl.DateTimeFormat('el-GR', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Today({ onSettings }: { onSettings: () => void }) {
  const [open, setOpen] = useState(false);
  const dish = TODAY_DISH;

  return (
    <Screen onSettings={onSettings}>
      <header className="day-head">
        <strong>{upperEl(dateFormat.format(new Date()))}</strong>
        <span>Εβδομάδα 1 από 4</span>
      </header>

      <section className="hero" data-cat={dish.category} aria-label="Σημερινό φαγητό">
        <CategoryTag category={dish.category} />
        <h3>{dish.name}</h3>
        <p className="hero-meta">
          {dish.minutes}′{dish.note ? ` · ${dish.note.toLowerCase()}` : ''}
        </p>
        <Button tone="light" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'Κρύψε τα υλικά' : 'Δες τα υλικά'}
        </Button>
        {open && (
          <ul className="ingredients">
            {dish.ingredients.map((i) => (
              <li key={i.name}>
                <span>{i.name}</span>
                <span>{fmtQty(i.qty, i.unit)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Label>Επόμενες μέρες</Label>
      <ul className="upcoming">
        {UPCOMING.map((u) => (
          <li key={u.day} data-cat={u.category}>
            <span>
              <span className="day">{upperEl(u.day)}</span>
              <span className="dish">{u.dish}</span>
            </span>
            <span className="time" aria-label={`${u.minutes} λεπτά, ${CATEGORY_NAME[u.category]}`}>
              {u.minutes}′
            </span>
          </li>
        ))}
      </ul>

      <p className="note-card">
        <strong>Βραδινό:</strong> {DINNER_TONIGHT.toLowerCase()}
      </p>
    </Screen>
  );
}
