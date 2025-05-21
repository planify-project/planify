import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAWNcKFTwctuQ8KQT0kQTV-cA51P6IJce4",
  authDomain: "planify-b92db.firebaseapp.com",
  projectId: "planify-b92db",
  storageBucket: "planify-b92db.firebasestorage.app",
  messagingSenderId: "300175244459",
  appId: "1:300175244459:web:bc1273ac294f3d0150cbee",
  measurementId: "G-YEXT4TPCN4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
