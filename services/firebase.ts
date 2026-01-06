import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";

// --- CONFIGURACIÓN DE BASE DE DATOS GOOGLE (FIREBASE) ---
// PARA ACTIVAR LA BASE DE DATOS MUNDIAL:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto nuevo (ej: "SalvandoLaNoche")
// 3. Entra a "Configuración del proyecto" (engranaje) -> General -> "Tus apps" -> Icono Web (</>)
// 4. Copia las credenciales que te da Google y pégalas abajo en `firebaseConfig`.
// 5. Ve a "Compilación" -> "Firestore Database" -> "Crear base de datos" -> Modo Prueba.

const firebaseConfig = {
  // REEMPLAZA ESTO CON TUS CLAVES REALES DE FIREBASE
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let db: any = null;
let isCloudActive = false;

try {
  // Solo inicializamos si el usuario ha puesto una API Key real (no el placeholder)
  if (firebaseConfig.apiKey !== "TU_API_KEY_AQUI") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isCloudActive = true;
    console.log("✅ Conectado a la Nube de Google (Firebase)");
  } else {
    console.warn("⚠️ Modo Local: Configura firebase.ts para sincronización mundial.");
  }
} catch (error) {
  console.error("Error conectando a Firebase:", error);
}

export { db, isCloudActive };