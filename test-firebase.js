const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCFeVNP6lniD1V7oFOAK3WHtMVsV-Qf9rY",
  authDomain: "arth-33ed6.firebaseapp.com",
  projectId: "arth-33ed6",
  storageBucket: "arth-33ed6.firebasestorage.app",
  messagingSenderId: "87341937407",
  appId: "1:87341937407:web:fbb2d506f64466fba512ca"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
  console.log('Auth:', !!auth);
  console.log('Firestore:', !!db);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
}