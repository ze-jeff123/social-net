import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase_config"
import { collection, connectFirestoreEmulator, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app);

export {db, auth}
