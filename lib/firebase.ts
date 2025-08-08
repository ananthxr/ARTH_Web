// Firebase configuration and initialization
// This file sets up the connection to Firebase services

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration object
// These values come from your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyBzmrWMFPewbekaxThp_I1UZ1Up3s8XbXA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: "https://arth2-169a4-default-rtdb.firebaseio.com/"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Realtime Database
// This is what we'll use to store and retrieve team data
export const db = getDatabase(app);

// Auto sign-in anonymously when Firebase initializes
// This ensures Firestore has proper authentication context
if (typeof window !== 'undefined') {
  // Only run on client-side
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // If no user is signed in, sign in anonymously
      signInAnonymously(auth).catch((error) => {
        console.error('Anonymous auth failed:', error);
      });
    }
  });
}

// Export the app for use in other parts of the application
export default app;