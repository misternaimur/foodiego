import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

// Fail an unreachable upload fast (~12s) instead of the SDK's default 2-minute
// exponential-backoff retry, which otherwise leaves registration forms stuck on
// "Submitting...". A browser upload can still fail entirely if the Storage
// bucket has no CORS policy for web origins — configure that with:
//   gsutil cors set cors.json gs://team-ultron-3251e.firebasestorage.app
storage.maxUploadRetryTime = 12_000;

export default firebaseApp;
