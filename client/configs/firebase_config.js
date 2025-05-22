import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAWNcKFTwctuQ8KQT0kQTV-cA51P6IJce4",
  authDomain: "planify-b92db.firebaseapp.com",
  projectId: "planify-b92db",
  storageBucket: "planify-b92db.firebasestorage.app",
  messagingSenderId: "300175244459",
  appId: "1:300175244459:web:bc1273ac294f3d0150cbee",
  measurementId: "G-YEXT4TPCN4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore with offline persistence
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);


export { app, Auth, db, storage };