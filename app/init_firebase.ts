import { initializeApp } from "firebase/app";
import { collection, connectFirestoreEmulator, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
}
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
export {db, auth, storage}
