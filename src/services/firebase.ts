/**
 * Inicializa Firebase (Auth + Firestore + Storage).
 * Práctica: Consumo de servicios/APIs. Variables en `.env.local` (prefijo VITE_).
 */
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgp2wmUxDTKIBL25MiCz1XF0ML7e-KHsQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "proyecto-41da5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "proyecto-41da5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "proyecto-41da5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "556231222578",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:556231222578:web:17dfef491945147ba9232b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LLZJJJXSY5"
};
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Configurar Google Provider con opciones recomendadas
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account', // Siempre muestra el selector de cuenta
})

export { app, auth, db, storage, googleProvider }
