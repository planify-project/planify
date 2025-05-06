import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import app from './configs/config';

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 