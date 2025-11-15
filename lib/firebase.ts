import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBEAC51bheW_WN78V20RvFFfj61Dvy8DaU",
  authDomain: "kennedy-4135f.firebaseapp.com",
  projectId: "kennedy-4135f",
  storageBucket: "kennedy-4135f.firebasestorage.app",
  messagingSenderId: "722910692732",
  appId: "1:722910692732:web:60e4551c7f1013781310f9",
  measurementId: "G-6LX1RH5JX2"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const getAnalyticsInstance = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(app);
  }
  return null;
};

