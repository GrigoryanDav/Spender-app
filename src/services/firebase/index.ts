import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "spender-app-1d257.firebaseapp.com",
  projectId: "spender-app-1d257",
  storageBucket: "spender-app-1d257.firebasestorage.app",
  messagingSenderId: "879540832980",
  appId: "1:879540832980:web:d698f2fe12aaa0cfccc941"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export {
    auth,
    db,
}