import { connectAuthEmulator, createUserWithEmailAndPassword, signInAnonymously, signInWithRedirect, updateProfile, UserCredential, User as FirebaseUser } from "firebase/auth";
import { getAdditionalUserInfo, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import User from "../types/User";
import { v4 as uuidv4 } from "uuid";
import { auth } from "./init_firebase"
import { addUser } from "./firestore";

const GoogleProvider = new GoogleAuthProvider();


function firebaseToUser(firebaseUser: FirebaseUser): User {
    return {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName ?? "",
        profileImage: firebaseUser.photoURL,
        friends: []
    }
}

function signInWithGoogle() {
    signInWithPopup(auth, GoogleProvider).then((result) => {
        addUser(firebaseToUser(result.user))
    }, () => { });
}
function signOut(): void {
    auth.signOut();
}

const useCurrentUser = () => {
    ///just to trigger re-render
    function convert(firebaseUser: FirebaseUser | null): User | null {
        if (firebaseUser === null) return null;
        return firebaseToUser(firebaseUser);
    }
    const [user, setUser] = useState(convert(auth.currentUser));
    useEffect(() => {

        const unsubscribe = auth.onIdTokenChanged(() => {
            setUser(convert(auth.currentUser));
        });

        return () => {
            unsubscribe();
        }
    }, []);
    return user;
};

const signInAsGuest = (displayName: string) => {
    signInAnonymously(auth).then((userCredential) => {
        updateProfile(userCredential.user, { displayName: displayName }).then(() => {
            addUser(firebaseToUser(userCredential.user))
            return userCredential.user.getIdTokenResult(true);
        }).then(() => {
        });
    });
}

export {
    signInAnonymously,
    signInWithGoogle,
    signInAsGuest,
    useCurrentUser,
    signOut,
};