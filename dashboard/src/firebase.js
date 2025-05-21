
import { getAuth } from 'firebase/auth';
import Auth from './configs/firebase_config';


const auth = getAuth(Auth);

export { auth };
