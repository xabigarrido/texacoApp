// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  writeBatch,
  setDoc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC9_9bQIyg9ztCTxscusKrBgg9GV5a9_4",
  authDomain: "appfinal-2806c.firebaseapp.com",
  projectId: "appfinal-2806c",
  storageBucket: "appfinal-2806c.firebasestorage.app",
  messagingSenderId: "977821881514",
  appId: "1:977821881514:web:15b7465e5c1e9b2b8facd3",
  measurementId: "G-MPFYFHX0N8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  writeBatch,
  setDoc,
};
