import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "weare-ea975.firebaseapp.com",
  projectId: "weare-ea975",
  storageBucket: "weare-ea975.firebasestorage.app",
  messagingSenderId: "150252020728",
  appId: "1:150252020728:web:91ce33116eba74a75f2c0d",
  measurementId: "G-GGDHQZNQKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export 
export const auth = getAuth(app);
export const database = getFirestore(app);

export default app;

