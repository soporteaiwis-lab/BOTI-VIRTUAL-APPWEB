import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Credenciales proporcionadas por el usuario
const firebaseConfig = {
  apiKey: "AIzaSyCXCP7OevTv8pqRB7oq-cUfpg0rQA3uLKE",
  authDomain: "salvandolanoche-38489.firebaseapp.com",
  projectId: "salvandolanoche-38489",
  storageBucket: "salvandolanoche-38489.firebasestorage.app",
  messagingSenderId: "359054137058",
  appId: "1:359054137058:web:88f2ad95c012ff5a7af0bb"
};

let db: Firestore | null = null;
let isCloudActive = false;

const initFirebase = () => {
  try {
    // Si ya hay apps inicializadas, usar la existente, si no, inicializar
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isCloudActive = true;
    console.log("✅ Conectado a la Nube de Google (Firebase) Automáticamente");
  } catch (error) {
    console.error("Error iniciando Firebase:", error);
    isCloudActive = false;
  }
};

// Iniciar inmediatamente
initFirebase();

// Mantenemos estas funciones por compatibilidad con la UI, aunque ya no sean estrictamente necesarias
export const saveFirebaseConfig = (configStr: string) => {
  console.log("Configuración guardada (aunque ya estamos usando las credenciales fijas).");
  window.location.reload();
};

export const clearFirebaseConfig = () => {
  console.log("Limpiando configuración...");
  window.location.reload();
};

export { db, isCloudActive };