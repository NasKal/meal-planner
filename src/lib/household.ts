import type { User } from 'firebase/auth';
import { arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

export type Household = {
  id: string;
  name: string;
  memberIds: string[];
  members: Record<string, { displayName: string }>;
  /** Υπάρχει μόνο αφού γεμίσει το νοικοκυριό με τον αρχικό κατάλογο. */
  seededAt?: unknown;
  /** Πρώτη μέρα (Δευτέρα) της εβδομάδας 1, μορφή ΕΕΕΕ-ΜΜ-ΗΗ. */
  cycleStartDate?: string;
};

// Χωρίς I, L, O, 0, 1 για να μη μπερδεύονται όταν γράφονται με το χέρι.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;
const INVITE_DAYS = 7;

export class InviteError extends Error {
  constructor(public reason: 'not-found' | 'expired') {
    super(reason);
  }
}

export function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function formatCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

function randomCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
}

export async function createHousehold(user: User, name: string, displayName: string): Promise<void> {
  const ref = doc(collection(db, 'households'));
  const batch = writeBatch(db);
  batch.set(ref, {
    name,
    memberIds: [user.uid],
    members: { [user.uid]: { displayName } },
    createdAt: serverTimestamp(),
    schemaVersion: 1,
  });
  batch.set(doc(db, 'users', user.uid), { displayName, householdId: ref.id }, { merge: true });
  await batch.commit();
}

export async function joinHousehold(user: User, rawCode: string, displayName: string): Promise<void> {
  const code = normalizeCode(rawCode);
  const inviteRef = doc(db, 'invites', code);
  const invite = await getDoc(inviteRef);
  if (!invite.exists()) throw new InviteError('not-found');

  const { householdId, expiresAt } = invite.data() as { householdId: string; expiresAt: Timestamp };
  if (expiresAt.toMillis() < Date.now()) throw new InviteError('expired');

  const batch = writeBatch(db);
  batch.update(doc(db, 'households', householdId), {
    memberIds: arrayUnion(user.uid),
    [`members.${user.uid}`]: { displayName },
    joinCode: code,
  });
  batch.set(doc(db, 'users', user.uid), { displayName, householdId }, { merge: true });
  batch.delete(inviteRef); // ο κωδικός είναι μιας χρήσης
  await batch.commit();
}

/** Δημιουργεί κωδικό πρόσκλησης που λήγει σε 7 ημέρες. Επιστρέφει τον κωδικό. */
export async function createInvite(householdId: string, uid: string): Promise<{ code: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000);
  const code = randomCode();
  await setDoc(doc(db, 'invites', code), {
    householdId,
    createdBy: uid,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
  });
  return { code, expiresAt };
}
