import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Mock configuration - replace with real data later
const firebaseConfig = {
  apiKey: "MOCK_API_KEY",
  authDomain: "neggo-mock.firebaseapp.com",
  projectId: "neggo-mock",
  storageBucket: "neggo-mock.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const authenticateWithFirebase = async (customToken: string) => {
  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    console.log('Firebase Auth Success:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    throw error;
  }
};
