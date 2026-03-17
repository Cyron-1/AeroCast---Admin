// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC6Y0n0NObTyHQx04yd1IAY0uiu0ttQYGs",
  authDomain: "aerocast-86f56.firebaseapp.com",
  projectId: "aerocast-86f56",
  storageBucket: "aerocast-86f56.firebasestorage.app",
  messagingSenderId: "803959629255",
  appId: "1:803959629255:web:585681fadfe5c279b4e5e2",
  measurementId: "G-MY5WVT9N9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Firestore database instance

export { app, analytics, db };