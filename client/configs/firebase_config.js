import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCtcxLaRb4amBYm8sDSPfSrKra0K7He_dM",
  authDomain: "planify-a9124.firebaseapp.com", // Fix: authDomain instead of AuthDomain
  projectId: "planify-a9124",
  storageBucket: "planify-a9124.appspot.com", // Fix: .appspot.com
  messagingSenderId: "941109727528",
  appId: "1:941109727528:web:5ed694e76e3840dac0801d",
  measurementId: "G-8RQG4TJWVY"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore with offline persistence
const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    }
  });
} catch (error) {
  console.warn('Error enabling offline persistence:', error);
}

export { app, Auth, db };