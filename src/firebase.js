import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3wkVslnu2aaZ5DX04aKpPO_xDkZHSBQI",
  authDomain: "lifetrack-5f56f.firebaseapp.com",
  projectId: "lifetrack-5f56f",
  storageBucket: "lifetrack-5f56f.firebasestorage.app",
  messagingSenderId: "112334926773",
  appId: "1:112334926773:web:b3e888cc1bc5945c9e1ffc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);