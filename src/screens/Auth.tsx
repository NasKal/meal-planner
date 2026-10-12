import { useState, type FormEvent } from 'react';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { friendlyError } from '../lib/errors';
import { Button, Notice, TextButton, TextField } from '../ui/components';

type Mode = 'signin' | 'signup' | 'reset';

export default function Auth() {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setInfo('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (mode === 'signup' && !name.trim()) return setError('Γράψε το όνομά σου, για να φαίνεται στο άλλο άτομο.');
    if (mode === 'signup' && password.length < 8) return setError('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.');

    setBusy(true);
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const displayName = name.trim();
        await setDoc(doc(db, 'users', cred.user.uid), { displayName }, { merge: true });
        updateProfile(cred.user, { displayName }).catch(() => {});
      } else {
        await sendPasswordResetEmail(auth, email.trim());
        setInfo('Σου στείλαμε email για να βάλεις νέο κωδικό. Έλεγξε και τον φάκελο ανεπιθύμητων.');
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  const title = mode === 'signin' ? 'Σύνδεση' : mode === 'signup' ? 'Νέος λογαριασμός' : 'Ξέχασα τον κωδικό';
  const action = mode === 'signin' ? 'Σύνδεση' : mode === 'signup' ? 'Δημιουργία λογαριασμού' : 'Στείλε μου email';

  return (
    <main className="screen gate">
      <p className="brand">Meal Planner</p>
      <h1 className="title gate-title">{title}</h1>

      <form className="form" onSubmit={submit} noValidate>
        {mode === 'signup' && (
          <TextField
            label="Το όνομά σου"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
            autoCapitalize="words"
          />
        )}
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
        />
        {mode !== 'reset' && (
          <TextField
            label="Κωδικός"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            hint={mode === 'signup' ? 'Τουλάχιστον 8 χαρακτήρες.' : undefined}
          />
        )}

        {error && <Notice>{error}</Notice>}
        {info && <Notice tone="info">{info}</Notice>}

        <Button type="submit" disabled={busy}>
          {busy ? 'Μια στιγμή…' : action}
        </Button>
      </form>

      <div className="gate-links">
        {mode === 'signin' && (
          <>
            <TextButton onClick={() => switchMode('signup')}>Δεν έχω λογαριασμό</TextButton>
            <TextButton onClick={() => switchMode('reset')}>Ξέχασα τον κωδικό</TextButton>
          </>
        )}
        {mode !== 'signin' && <TextButton onClick={() => switchMode('signin')}>Πίσω στη σύνδεση</TextButton>}
      </div>
    </main>
  );
}
