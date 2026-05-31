import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache, setLogLevel } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import firebaseConfigJson from "../firebase-applet-config.json";

// Support both AI Studio JSON config and Netlify/Vercel Environment Variables
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || (firebaseConfigJson as any).apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (firebaseConfigJson as any).authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || (firebaseConfigJson as any).projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (firebaseConfigJson as any).storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (firebaseConfigJson as any).messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || (firebaseConfigJson as any).appId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || (firebaseConfigJson as any).measurementId
};

const app = initializeApp(firebaseConfig);
setLogLevel('error');
const config = firebaseConfig as any;
console.log("SanadSouq: Firebase Initialized with Project ID:", config.projectId);

let firestoreDb;
try {
  // Use a safer initialization that falls back gracefully without double-calling initializeFirestore
  firestoreDb = initializeFirestore(app, {
    localCache: typeof window !== 'undefined' ? persistentLocalCache({ tabManager: persistentMultipleTabManager() }) : memoryLocalCache()
  }, config.firestoreDatabaseId || undefined);
} catch (e) {
  console.warn("Firestore initialization with persistence failed/blocked. Using default memory cache.", e);
  try {
    firestoreDb = getFirestore(app, config.firestoreDatabaseId || undefined);
  } catch (err) {
    console.error("Critical Firestore failure:", err);
  }
}

let messagingInstance: any = null;
try {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    messagingInstance = getMessaging(app);
  }
} catch (e) {
  console.warn("Firebase Messaging is not supported or blocked in this environment.", e);
}

export const db = firestoreDb;
export const messaging = messagingInstance;
export { app };

