import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache, setLogLevel } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
setLogLevel('error');
const config = firebaseConfig as any;

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

