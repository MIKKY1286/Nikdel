import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env } from "./env";

const googleProvider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

let app;
let auth;
let db;
let isMockMode = true;

// Check if config has been modified from standard placeholders
if (
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.apiKey.trim() !== ""
) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isMockMode = false;
    console.log("Firebase initialized successfully in production mode.");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to mock mode:", error);
    isMockMode = true;
  }
} else {
  console.log("Using mock mode: Firebase credentials not set.");
}

export { auth, db, isMockMode, googleProvider };
export const PAYSTACK_PUBLIC_KEY = env.PAYSTACK_PUBLIC_KEY;
