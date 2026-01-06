import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

let db: Firestore | null = null;
let isCloudActive = false;

// Intentamos cargar la configuración guardada por el usuario en el navegador
const loadFirebaseConfig = () => {
  try {
    const savedConfig = localStorage.getItem('sln_firebase_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (!getApps().length) {
        const app = initializeApp(config);
        db = getFirestore(app);
      } else {
        const app = getApp();
        db = getFirestore(app);
      }
      isCloudActive = true;
      console.log("✅ Conectado a la Nube de Google (Firebase) dinámicamente");
    }
  } catch (error) {
    console.error("Error iniciando Firebase con config guardada:", error);
    isCloudActive = false;
  }
};

// Cargar al inicio
loadFirebaseConfig();

export const saveFirebaseConfig = (configStr: string) => {
  try {
    // Validar que sea JSON
    const config = JSON.parse(configStr);
    localStorage.setItem('sln_firebase_config', JSON.stringify(config));
    window.location.reload(); // Recargar para conectar
  } catch (error) {
    alert("El texto ingresado no es un JSON válido de Firebase.");
  }
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem('sln_firebase_config');
  window.location.reload();
};

export { db, isCloudActive };