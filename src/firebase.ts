import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache, setLogLevel } from "firebase/firestore";
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

export const db = firestoreDb;

