// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZdDb9J3LM3LWyREVcK-XuPJs5eL6zYW4",
  authDomain: "trackfiaccio.firebaseapp.com",
  projectId: "trackfiaccio",
  storageBucket: "trackfiaccio.firebasestorage.app",
  messagingSenderId: "734047955442",
  appId: "1:734047955442:web:77d4fdcd442b46c5bee36b",
  measurementId: "G-DBTN4N1QMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };