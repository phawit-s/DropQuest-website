// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADzqwoY_EnWBpUfIINev5N5UcAffRO6iQ",
  authDomain: "dropquest-website.firebaseapp.com",
  databaseURL:"https://dropquest-website-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dropquest-website",
  storageBucket: "dropquest-website.appspot.com",
  messagingSenderId: "963248115381",
  appId: "1:963248115381:web:fbc14f91f8b83b783238fc",
  measurementId: "G-0J66P9KM3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app)
export const storage  = getStorage(app)