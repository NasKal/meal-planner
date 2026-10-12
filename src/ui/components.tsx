import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { upperEl } from '../lib/text';
import { Icon, type IconName } from './icons';
import './ui.css';

export type Category = 'legume' | 'veg' | 'meat' | 'fish';

export const CATEGORY_NAME: Record<Category, string> = {
  legume: 'Όσπριο',
  veg: 'Λαχανικά',
  meat: 'Κρέας',
  fish: 'Ψάρι',
};

/** Τίτλος ενότητας με κεφαλαία, χωρίς τόνους. */
export function Label({ children }: { children: string }) {
  return <h2 className="label">{upperEl(children)}</h2>;
}

export function CategoryTag({ category }: { category: Category }) {
  return <span className="cat-tag">{CATEGORY_NAME[category]}</span>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'primary' | 'light' };

export function Button({ tone = 'primary', className = '', ...rest }: ButtonProps) {
  return <button type="button" className={`btn btn-${tone} ${className}`} {...rest} />;
}

type CheckRowProps = {
  name: string;
  qty?: string;
  note?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Ολόκληρη η γραμμή είναι στόχος αφής. Το native checkbox μένει για προσβασιμότητα. */
export function CheckRow({ name, qty, note, checked, onChange }: CheckRowProps) {
  return (
    <label className={`check-row${checked ? ' is-done' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="check-box" aria-hidden="true">
        {checked && <Icon name="check" size={22} strokeWidth={3.2} />}
      </span>
      <span className="check-text">
        <span className="check-name">{name}</span>
        {note && <span className="check-note">{note}</span>}
      </span>
      {qty && <span className="check-qty">{qty}</span>}
    </label>
  );
}

export type TabId = 'today' | 'plan' | 'evening' | 'list' | 'dishes';

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'today', label: 'Σήμερα', icon: 'today' },
  { id: 'plan', label: 'Πλάνο', icon: 'plan' },
  { id: 'evening', label: 'Βραδινά', icon: 'evening' },
  { id: 'list', label: 'Λίστα', icon: 'list' },
  { id: 'dishes', label: 'Πιάτα', icon: 'dishes' },
];

export function BottomNav({ current, onSelect }: { current: TabId; onSelect: (tab: TabId) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Κύρια πλοήγηση">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className="nav-item"
          aria-current={t.id === current ? 'page' : undefined}
          onClick={() => onSelect(t.id)}
        >
          <Icon name={t.icon} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/** Οθόνη εφαρμογής. Με `onSettings` εμφανίζει το κουμπί λογαριασμού πάνω δεξιά. */
export function Screen({ children, onSettings }: { children: ReactNode; onSettings?: () => void }) {
  return (
    <main className="screen">
      {onSettings && (
        <button type="button" className="icon-btn" aria-label="Λογαριασμός και ρυθμίσεις" onClick={onSettings}>
          <Icon name="person" />
        </button>
      )}
      {children}
    </main>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string };

export function TextField({ label, hint, id, ...rest }: TextFieldProps) {
  const fieldId = id ?? `f-${label}`;
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      <input id={fieldId} {...rest} />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function Notice({ tone = 'error', children }: { tone?: 'error' | 'info'; children: ReactNode }) {
  return (
    <p className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

/** Κουμπί που μοιάζει με σύνδεσμο, για δευτερεύουσες ενέργειες. */
export function TextButton({ className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`text-btn ${className}`} {...rest} />;
}
