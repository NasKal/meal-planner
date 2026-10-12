import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { app, auth } from './firebase';

// Προσωρινή σελίδα ελέγχου του Βήματος 0: επιβεβαιώνει ότι το deploy και η
// σύνδεση με το Firebase δουλεύουν. Αντικαθίσταται στα επόμενα βήματα.
export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return (
    <main className="shell">
      <h1>Meal Planner</h1>
      <p>Η εφαρμογή στήθηκε. Ακολουθούν είσοδος, πλάνο και λίστα αγορών.</p>
      <dl>
        <dt>Firebase project</dt>
        <dd>{app.options.projectId}</dd>
        <dt>Σύνδεση χρήστη</dt>
        <dd>
          {user === undefined
            ? 'Έλεγχος…'
            : user
              ? `Συνδεδεμένος: ${user.email}`
              : 'Κανένας χρήστης συνδεδεμένος'}
        </dd>
      </dl>
    </main>
  );
}
