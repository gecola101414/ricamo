
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// --- CONFIGURAZIONE DI SICUREZZA ---
// Configurazione corretta per il progetto GeCoLa
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCb_bbD8wlYPmuTZkmgBXbvzRq8NBbkNrg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gecola-bbf37.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://gecola-bbf37-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gecola-bbf37",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gecola-bbf37.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "49804026654",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:49804026654:web:5aa057abd84a0651b69f0f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RSSS8F5280"
};

// Initialize Firebase
let authExports;
let dbExports;

try {
    const app = initializeApp(firebaseConfig);
    authExports = getAuth(app);
    dbExports = getDatabase(app);
} catch (e) {
    console.warn("Firebase non configurato correttamente o errore di inizializzazione:", e);
    authExports = null; 
    dbExports = null;
}

export const auth = authExports;
export const db = dbExports;
