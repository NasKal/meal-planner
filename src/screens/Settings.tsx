import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { createInvite, formatCode } from '../lib/household';
import { friendlyError } from '../lib/errors';
import { Button, Notice } from '../ui/components';
import { Icon } from '../ui/icons';
import { useSession } from '../state/session';

const dateFormat = new Intl.DateTimeFormat('el-GR', { day: 'numeric', month: 'long' });

export default function Settings({ onBack }: { onBack: () => void }) {
  const session = useSession();
  const [invite, setInvite] = useState<{ code: string; expiresAt: Date } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (session.status !== 'ready') return null;
  const { user, household, displayName } = session;
  const members = household.memberIds.map((id) => household.members?.[id]?.displayName || 'Μέλος');

  async function makeInvite() {
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      setInvite(await createInvite(household.id, user.uid));
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(formatCode(invite.code));
      setCopied(true);
    } catch {
      setError('Δεν έγινε αντιγραφή. Επίλεξε τον κωδικό και αντίγραψέ τον με το χέρι.');
    }
  }

  return (
    <main className="screen">
      <header className="settings-head">
        <button type="button" className="icon-btn static" aria-label="Πίσω" onClick={onBack}>
          <Icon name="back" />
        </button>
        <h1 className="title">Λογαριασμός</h1>
      </header>

      <section className="panel">
        <h2 className="panel-title">Εσύ</h2>
        <p className="panel-main">{displayName}</p>
        <p className="panel-sub">{user.email}</p>
      </section>

      <section className="panel">
        <h2 className="panel-title">Νοικοκυριό</h2>
        <p className="panel-main">{household.name}</p>
        <p className="panel-sub">{members.join(' · ')}</p>
      </section>

      <section className="panel">
        <h2 className="panel-title">Πρόσκληση</h2>
        <p className="panel-sub">
          Φτιάξε έναν κωδικό και δώσ' τον στο άλλο άτομο. Ισχύει για 7 ημέρες και μία χρήση.
        </p>
        {invite && (
          <div className="invite">
            <p className="invite-code" aria-label={`Κωδικός ${formatCode(invite.code)}`}>
              {formatCode(invite.code)}
            </p>
            <p className="panel-sub">Λήγει στις {dateFormat.format(invite.expiresAt)}.</p>
            <Button tone="light" className="outline" onClick={copy}>
              {copied ? 'Αντιγράφηκε' : 'Αντιγραφή κωδικού'}
            </Button>
          </div>
        )}
        {error && <Notice>{error}</Notice>}
        <Button onClick={makeInvite} disabled={busy}>
          {busy ? 'Μια στιγμή…' : invite ? 'Νέος κωδικός' : 'Δημιουργία κωδικού πρόσκλησης'}
        </Button>
      </section>

      <div className="settings-foot">
        <Button tone="light" className="outline" onClick={() => signOut(auth)}>
          Αποσύνδεση
        </Button>
      </div>
    </main>
  );
}
