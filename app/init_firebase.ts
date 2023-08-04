import { initializeApp } from "firebase/app";
import { collection, connectFirestoreEmulator, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import {firebaseConfig} from "../firebase_config"

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
export {db, auth, storage}
