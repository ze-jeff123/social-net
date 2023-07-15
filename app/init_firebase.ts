import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase_config"
import { collection, connectFirestoreEmulator, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
export {db, auth, storage}
