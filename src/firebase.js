// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

  
const firebaseConfig = {
  apiKey: "AIzaSyAxT7VSj98yjCPB7f6BiR2kiIzaAH3bZtA",
  authDomain: "frontend-quiz-app-47df7.firebaseapp.com",
  databaseURL: "https://frontend-quiz-app-47df7-default-rtdb.firebaseio.com",
  projectId: "frontend-quiz-app-47df7",
  storageBucket: "frontend-quiz-app-47df7.firebasestorage.app",
  messagingSenderId: "35750238770",
  appId: "1:35750238770:web:2188fb70eb505f36b67a2b",
  measurementId: "G-YBHCFB89T5"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };