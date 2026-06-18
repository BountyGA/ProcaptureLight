/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const meta = import.meta as any;

const firebaseConfig = {
  apiKey: meta.env.VITE_FIREBASE_API_KEY,
  authDomain: meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: meta.env.VITE_FIREBASE_APP_ID,
  measurementId: meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
