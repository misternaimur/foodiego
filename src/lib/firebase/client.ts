import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

function getFirebaseConfig(): FirebaseOptions {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function getClientApp(): FirebaseApp {
  if (!app) {
    const config = getFirebaseConfig();
    if (!config.apiKey || !config.projectId) {
      throw new Error("Missing Firebase client configuration");
    }

    app = getApps()[0] ?? initializeApp(config);
  }

  return app;
}

export function getClientAuth(): Auth {
  if (!auth) {
    auth = getAuth(getClientApp());
  }

  return auth;
}

export function getClientStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getClientApp());
    storage.maxUploadRetryTime = 12_000;
  }

  return storage;
}