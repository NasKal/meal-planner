import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { BottomNav, Button, Notice, Screen, TextButton, type TabId } from './ui/components';
import { SessionProvider, useSession } from './state/session';
import { DataProvider, useData } from './state/data';
import Auth from './screens/Auth';
import Setup from './screens/Setup';
import Settings from './screens/Settings';
import Today from './screens/Today';
import Plan from './screens/Plan';
import Evening from './screens/Evening';
import ShoppingList from './screens/ShoppingList';

function Placeholder({ onSettings }: { onSettings: () => void }) {
  return (
    <Screen onSettings={onSettings}>
      <h1 className="title">Έρχεται σύντομα</h1>
      <p className="empty">Αυτή η οθόνη χτίζεται στα επόμενα βήματα.</p>
    </Screen>
  );
}

function Main() {
  const [tab, setTab] = useState<TabId>('today');
  const [settings, setSettings] = useState(false);
  const data = useData();

  if (data.status === 'seeding') {
    return (
      <main className="screen gate">
        <p className="brand">Meal Planner</p>
        <h1 className="title gate-title">Ετοιμάζουμε το νοικοκυριό σας</h1>
        <p className="gate-lead">Φορτώνουμε τα πιάτα και το πλάνο. Θα πάρει λίγα δευτερόλεπτα.</p>
      </main>
    );
  }

  if (settings) return <Settings onBack={() => setSettings(false)} />;

  const open = () => setSettings(true);
  return (
    <>
      {tab === 'today' && <Today onSettings={open} />}
      {tab === 'plan' && <Plan onSettings={open} />}
      {tab === 'list' && <ShoppingList onSettings={open} />}
      {tab === 'evening' && <Evening onSettings={open} />}
      {tab === 'dishes' && <Placeholder onSettings={open} />}
      <BottomNav current={tab} onSelect={setTab} />
    </>
  );
}

function Gate() {
  const session = useSession();

  switch (session.status) {
    case 'loading':
      return (
        <main className="screen gate">
          <p className="brand">Meal Planner</p>
          <p className="gate-lead">Φόρτωση…</p>
        </main>
      );
    case 'signedOut':
      return <Auth />;
    case 'needsHousehold':
      return <Setup user={session.user} displayName={session.displayName} />;
    case 'error':
      return (
        <main className="screen gate">
          <p className="brand">Meal Planner</p>
          <h1 className="title gate-title">Δεν φορτώθηκαν τα δεδομένα</h1>
          <Notice>Έλεγξε τη σύνδεση στο ίντερνετ και δοκίμασε ξανά. Αν συνεχιστεί, αποσυνδέσου και συνδέσου πάλι.</Notice>
          <div className="form">
            <Button onClick={() => window.location.reload()}>Δοκίμασε ξανά</Button>
          </div>
          <div className="gate-links">
            <TextButton onClick={() => signOut(auth)}>Αποσύνδεση</TextButton>
          </div>
        </main>
      );
    case 'ready':
      return (
        <DataProvider>
          <Main />
        </DataProvider>
      );
  }
}

export default function App() {
  return (
    <SessionProvider>
      <Gate />
    </SessionProvider>
  );
}
