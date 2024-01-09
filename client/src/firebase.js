// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mernestate-6b179.firebaseapp.com",
    projectId: "mernestate-6b179",
    storageBucket: "mernestate-6b179.appspot.com",
    messagingSenderId: "656993151196",
    appId: "1:656993151196:web:b09c716e9dd70594e06c19",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
