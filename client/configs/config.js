import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtcxLaRb4amBYm8sDSPfSrKra0K7He_dM",
  authDomain: "planify-a9124.firebaseapp.com",
  projectId: "planify-a9124",
  storageBucket: "planify-a9124.firebasestorage.app",
  messagingSenderId: "941109727528",
  appId: "1:941109727528:web:5ed694e76e3840dac0801d",
  measurementId: "G-8RQG4TJWVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;