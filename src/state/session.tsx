import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { Household } from '../lib/household';

export type Session =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'needsHousehold'; user: User; displayName: string }
  | { status: 'ready'; user: User; displayName: string; household: Household }
  | { status: 'error'; user: User };

const SessionContext = createContext<Session>({ status: 'loading' });

export const useSession = () => useContext(SessionContext);

/** Συνδυάζει σύνδεση χρήστη, προφίλ και νοικοκυριό σε μία κατάσταση. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ displayName?: string; householdId?: string } | null | undefined>(undefined);
  const [household, setHousehold] = useState<Household | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setAuthReady(true);
        setProfile(undefined);
        setHousehold(undefined);
        setFailed(false);
      }),
    [],
  );

  const uid = user?.uid;
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, 'users', uid),
      (snap) => setProfile(snap.exists() ? (snap.data() as { displayName?: string; householdId?: string }) : null),
      () => setFailed(true),
    );
  }, [uid]);

  const householdId = profile?.householdId;
  useEffect(() => {
    if (!householdId) return;
    return onSnapshot(
      doc(db, 'households', householdId),
      (snap) => setHousehold(snap.exists() ? ({ id: snap.id, ...snap.data() } as Household) : null),
      () => setFailed(true),
    );
  }, [householdId]);

  let session: Session;
  if (!authReady) session = { status: 'loading' };
  else if (!user) session = { status: 'signedOut' };
  else if (failed) session = { status: 'error', user };
  else if (profile === undefined) session = { status: 'loading' };
  else if (!profile?.householdId) {
    session = { status: 'needsHousehold', user, displayName: profile?.displayName ?? user.displayName ?? '' };
  } else if (household === undefined) session = { status: 'loading' };
  else if (household === null) {
    session = { status: 'needsHousehold', user, displayName: profile.displayName ?? user.displayName ?? '' };
  } else {
    session = {
      status: 'ready',
      user,
      displayName: profile.displayName ?? user.displayName ?? user.email ?? '',
      household,
    };
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
