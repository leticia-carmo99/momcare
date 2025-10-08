import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXBzlNnqV_gOJpbSzc0IDAcK_OQjsYYac",
  authDomain: "momcare-496e5.firebaseapp.com",
  databaseURL: "https://momcare-496e5-default-rtdb.firebaseio.com",
  projectId: "momcare-496e5",
  storageBucket: "momcare-496e5.firebasestorage.app",
  messagingSenderId: "1066713023895",
  appId: "1:1066713023895:web:6681b0a41f773d6dec70d2",
  measurementId: "G-96PKJ2243X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);