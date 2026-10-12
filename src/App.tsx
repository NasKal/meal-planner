import { useState } from 'react';
import { BottomNav, Screen, type TabId } from './ui/components';
import Today from './screens/Today';
import ShoppingList from './screens/ShoppingList';

// Βήμα 1: δοκιμαστική εφαρμογή του συστήματος σχεδίασης με δεδομένα δείγματος.
// Οι οθόνες Πλάνο, Βραδινά και Πιάτα έρχονται στα επόμενα βήματα.
export default function App() {
  const [tab, setTab] = useState<TabId>('today');

  return (
    <>
      {tab === 'today' && <Today />}
      {tab === 'list' && <ShoppingList />}
      {tab !== 'today' && tab !== 'list' && (
        <Screen>
          <h1 className="title">Έρχεται σύντομα</h1>
          <p className="empty">Αυτή η οθόνη χτίζεται στα επόμενα βήματα.</p>
        </Screen>
      )}
      <BottomNav current={tab} onSelect={setTab} />
    </>
  );
}
