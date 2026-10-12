import { InviteError } from './household';

/** Μήνυμα στα ελληνικά για σφάλμα του Firebase Auth, του Firestore ή του κωδικού πρόσκλησης. */
export function friendlyError(err: unknown): string {
  if (err instanceof InviteError) {
    return err.reason === 'expired'
      ? 'Ο κωδικός πρόσκλησης έχει λήξει. Ζήτησε νέο από το άλλο άτομο.'
      : 'Δεν βρέθηκε αυτός ο κωδικός. Έλεγξε ότι τον έγραψες σωστά ή ζήτησε νέο.';
  }
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: unknown }).code) : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Λάθος email ή κωδικός.';
    case 'auth/email-already-in-use':
      return 'Υπάρχει ήδη λογαριασμός με αυτό το email. Δοκίμασε να συνδεθείς.';
    case 'auth/invalid-email':
      return 'Το email δεν φαίνεται σωστό.';
    case 'auth/weak-password':
      return 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.';
    case 'auth/too-many-requests':
      return 'Πολλές προσπάθειες. Περίμενε λίγα λεπτά και ξαναδοκίμασε.';
    case 'auth/network-request-failed':
    case 'unavailable':
      return 'Δεν υπάρχει σύνδεση στο ίντερνετ. Δοκίμασε ξανά όταν συνδεθείς.';
    case 'permission-denied':
      return 'Δεν έχεις δικαίωμα για αυτή την ενέργεια.';
    default:
      return 'Κάτι πήγε στραβά. Δοκίμασε ξανά.';
  }
}
