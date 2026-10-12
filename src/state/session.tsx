import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
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

type Profile = { displayName?: string; householdId?: string };

/**
 * Ακούει ένα έγγραφο. Αν ο server το απορρίψει (π.χ. αμέσως μετά από εγγραφή που δεν έχει
 * ακόμα επιβεβαιωθεί), ξαναδοκιμάζει με αυξανόμενη καθυστέρηση πριν δηλώσει σφάλμα.
 */
function listen(
  path: [string, string],
  onData: (snap: DocumentSnapshot<DocumentData>) => void,
  onFail: () => void,
  maxRetries = 4,
): () => void {
  let cancelled = false;
  let unsubscribe: () => void = () => {};
  let timer: ReturnType<typeof setTimeout> | undefined;

  const subscribe = (attempt: number) => {
    unsubscribe = onSnapshot(
      doc(db, path[0], path[1]),
      { includeMetadataChanges: true },
      (snap) => {
        // Μια cache χωρίς το έγγραφο δεν είναι απάντηση: περίμενε τον server.
        if (!snap.exists() && snap.metadata.fromCache) return;
        onData(snap);
      },
      () => {
        if (cancelled) return;
        if (attempt >= maxRetries) onFail();
        else timer = setTimeout(() => subscribe(attempt + 1), 600 * 2 ** attempt);
      },
    );
  };
  subscribe(0);

  return () => {
    cancelled = true;
    unsubscribe();
    clearTimeout(timer);
  };
}

/** Συνδυάζει σύνδεση χρήστη, προφίλ και νοικοκυριό σε μία κατάσταση. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
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
    return listen(
      ['users', uid],
      (snap) => {
        // Δικό μας εγγραφή που δεν έχει φτάσει στον server: μην προχωράς ακόμα.
        if (snap.metadata.hasPendingWrites) return;
        setProfile(snap.exists() ? (snap.data() as Profile) : null);
      },
      () => setFailed(true),
    );
  }, [uid]);

  const householdId = profile?.householdId;
  useEffect(() => {
    if (!householdId) return;
    return listen(
      ['households', householdId],
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
