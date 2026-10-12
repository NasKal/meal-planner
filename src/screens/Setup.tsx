import { useState, type FormEvent } from 'react';
import { signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';
import { createHousehold, joinHousehold } from '../lib/household';
import { friendlyError } from '../lib/errors';
import { Button, Notice, TextButton, TextField } from '../ui/components';

type Choice = 'new' | 'join' | null;

export default function Setup({ user, displayName }: { user: User; displayName: string }) {
  const [choice, setChoice] = useState<Choice>(null);
  const [householdName, setHouseholdName] = useState('Το σπίτι μας');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const greetingName = displayName || user.displayName || '';
  const name = greetingName || user.email || '';

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (choice === 'new' && !householdName.trim()) return setError('Γράψε ένα όνομα για το νοικοκυριό.');
    if (choice === 'join' && code.trim().length < 8) return setError('Ο κωδικός πρόσκλησης έχει 8 χαρακτήρες.');

    setBusy(true);
    try {
      if (choice === 'new') await createHousehold(user, householdName.trim(), name);
      else await joinHousehold(user, code, name);
      // Η οθόνη αλλάζει μόνη της μόλις ενημερωθεί το προφίλ.
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <main className="screen gate">
      <p className="brand">Meal Planner</p>
      <h1 className="title gate-title">Γεια σου{greetingName ? `, ${greetingName}` : ''}</h1>

      {choice === null ? (
        <>
          <p className="gate-lead">Το πλάνο και η λίστα αγορών μοιράζονται μέσα σε ένα νοικοκυριό. Τι θέλεις να κάνεις;</p>
          <div className="choices">
            <button type="button" className="choice" onClick={() => setChoice('new')}>
              <strong>Φτιάχνω νέο νοικοκυριό</strong>
              <span>Αν είσαι το πρώτο άτομο που ξεκινά. Μετά καλείς το άλλο άτομο.</span>
            </button>
            <button type="button" className="choice" onClick={() => setChoice('join')}>
              <strong>Έχω κωδικό πρόσκλησης</strong>
              <span>Αν σε κάλεσε κάποιος. Θα μπεις στο δικό του νοικοκυριό.</span>
            </button>
          </div>
        </>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          {choice === 'new' ? (
            <TextField
              label="Όνομα νοικοκυριού"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              autoComplete="off"
            />
          ) : (
            <TextField
              label="Κωδικός πρόσκλησης"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              hint="Π.χ. K7MQ-4XZP"
            />
          )}
          {error && <Notice>{error}</Notice>}
          <Button type="submit" disabled={busy}>
            {busy ? 'Μια στιγμή…' : choice === 'new' ? 'Δημιουργία' : 'Μπες στο νοικοκυριό'}
          </Button>
          <TextButton
            onClick={() => {
              setChoice(null);
              setError('');
            }}
          >
            Πίσω
          </TextButton>
        </form>
      )}

      <div className="gate-links">
        <TextButton onClick={() => signOut(auth)}>Αποσύνδεση ({user.email})</TextButton>
      </div>
    </main>
  );
}
