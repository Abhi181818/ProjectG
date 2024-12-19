// src/firebase.js
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyCKvpyW4lT_02RxXRPkc12eXBjhO_Nx6tA",
  authDomain: "projectg-f0a97.firebaseapp.com",
  projectId: "projectg-f0a97",
  storageBucket: "projectg-f0a97.appspot.com",
  messagingSenderId: "1035267907034",
  appId: "1:1035267907034:web:d6cf483554fe88906734e3",
  measurementId: "G-5D23PNZ9YL"
};
console.log("ENV:", {
  exists: !!import.meta.env.VITE_FIREBASE_API_KEY,
  keyLength: import.meta.env.VITE_FIREBASE_API_KEY?.length,
  // Don't log actual key in production
});
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage, googleProvider };
