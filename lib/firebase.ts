// lib/firebase.ts
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDOYvzaE1EpVKzOOzDu6NMcXlKqrV4vpuw",
  authDomain: "product-dashboard-test.firebaseapp.com",
  projectId: "product-dashboard-test",
  storageBucket: "product-dashboard-test.firebasestorage.app",
  messagingSenderId: "952952720087",
  appId: "1:952952720087:web:20e59c878efa5c41803e92"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;