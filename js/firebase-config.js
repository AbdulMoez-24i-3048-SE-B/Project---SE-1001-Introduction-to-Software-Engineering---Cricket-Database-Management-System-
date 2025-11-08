// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDtEQEkRjymn2uTeozItt-jJW72EpgHHcM",
  authDomain: "cricket-db-840fd.firebaseapp.com",
  projectId: "cricket-db-840fd",
  storageBucket: "cricket-db-840fd.firebasestorage.app",
  messagingSenderId: "387166503690",
  appId: "1:387166503690:web:3669a995688c2d2c9b30f3"
};

// Initialize Firebase and Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
