// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);