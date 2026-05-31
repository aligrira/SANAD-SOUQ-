import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache, setLogLevel } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
setLogLevel('error');
const config = firebaseConfig as any;

let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  }, config.firestoreDatabaseId || undefined);
} catch (e) {
  console.warn("Firestore persistent offline cache is not supported or was blocked. Falling back to default in-memory behavior.", e);
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    localCache: memoryLocalCache()
  }, config.firestoreDatabaseId || undefined);
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

