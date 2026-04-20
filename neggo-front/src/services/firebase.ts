import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Mock configuration - replace with real data later
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "",
  authDomain: "neggo-cca92.firebaseapp.com",
  projectId: "neggo-cca92",
  storageBucket: "neggo-cca92.firebasestorage.app",
  messagingSenderId: "549571875470",
  appId: "1:549571875470:web:dc929fb0cd3a3b4b81afdf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const authenticateWithFirebase = async (customToken: string) => {
  if (!auth) return null;
  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    console.log('Firebase Auth Success:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    throw error;
  }
};
