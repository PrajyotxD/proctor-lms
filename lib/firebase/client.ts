"use client";

import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getClientEnv } from "@/lib/env";

let warned = false;

function getFirebaseOptions(): FirebaseOptions | null {
  const env = getClientEnv();
  if (!env) {
    if (!warned && typeof window !== "undefined") {
      warned = true;
      console.error("Firebase env is incomplete. Configure .env.local before using runtime features.");
    }

    return null;
  }

  return {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function getFirebaseApp() {
  const config = getFirebaseOptions();
  if (!config) {
    return null;
  }

  return getApps().length ? getApp() : initializeApp(config);
}

export function getFirebaseServices() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}

export async function getFirebaseAnalytics() {
  const app = getFirebaseApp();
  if (!app || typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getAnalytics(app);
}
