import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

// Δημόσια στοιχεία σύνδεσης. Η προστασία των δεδομένων γίνεται από τους
// κανόνες του Firestore, όχι από την απόκρυψη αυτών των τιμών.
const firebaseConfig = {
  apiKey: 'AIzaSyB4OONAo0K_i-GBiOx7BH8kIjc4oy7yGwg',
  authDomain: 'meal-planner-a6aee.firebaseapp.com',
  projectId: 'meal-planner-a6aee',
  messagingSenderId: '839733841821',
  appId: '1:839733841821:web:83c813f6618c789ac0e974',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Τοπική cache: δουλεύει offline και στέλνει τις αλλαγές όταν γυρίσει η σύνδεση.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
