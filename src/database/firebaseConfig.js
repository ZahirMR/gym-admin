import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyByoJX89uCDG0S29MnH7QeIQPuFKBTZnG0",
  authDomain: "gym-admin-d7bad.firebaseapp.com",
  projectId: "gym-admin-d7bad",
  storageBucket: "gym-admin-d7bad.appspot.com",
  messagingSenderId: "54833682920",
  appId: "1:54833682920:web:e55cc1ea212e8ebaa6ec5d",
  measurementId: "G-LDXYB9KHYH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
