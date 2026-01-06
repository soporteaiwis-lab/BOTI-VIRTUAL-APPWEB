import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { db, isCloudActive } from './firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";

const STORAGE_KEY = 'sln_products_db_v2';

// Helper to simulate delay in local mode for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loadProductsFromStorage = async (): Promise<Product[]> => {
  // 1. Intentar cargar desde la Nube (Google Firebase)
  if (isCloudActive && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const cloudProducts: Product[] = [];
      querySnapshot.forEach((doc: any) => {
        cloudProducts.push(doc.data() as Product);
      });
      
      if (cloudProducts.length > 0) {
        // Actualizamos caché local para tener respaldo
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProducts));
        return cloudProducts;
      } else {
        // Si la nube está vacía (primera vez), intentamos subir los iniciales
        try {
          for (const p of INITIAL_PRODUCTS) {
            await setDoc(doc(db, "products", p.id), p);
          }
          return INITIAL_PRODUCTS;
        } catch (seedError) {
          console.warn("No se pudo sembrar la base de datos (Error Permisos):", seedError);
          // Si falla el sembrado, seguimos al flujo local
        }
      }
    } catch (error: any) {
      console.error("⚠️ Error conectando a la Nube (Firebase) - Probablemente faltan permisos en la consola:", error.message);
      console.warn("🛟 Activando modo de respaldo: Usando almacenamiento Local.");
      // No retornamos aquí, dejamos que continúe hacia el código de LocalStorage abajo
    }
  }

  // 2. Fallback: Modo Local (LocalStorage)
  try {
    await delay(500); // UI feel
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  } catch (localError) {
    console.error("Error crítico en almacenamiento local:", localError);
    return INITIAL_PRODUCTS;
  }
};

export const saveProductToStorage = async (product: Product) => {
  // Guardar en Nube (intento optimista)
  if (isCloudActive && db) {
    try {
      await setDoc(doc(db, "products", product.id), product);
    } catch (error) {
      console.error("❌ Error guardando en Nube (Permisos):", error);
      // No lanzamos el error para permitir que se guarde localmente y el usuario no pierda trabajo
    }
  }

  // SIEMPRE Guardar en Local como respaldo/cache
  try {
    const currentLocal = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedLocal = currentLocal.filter((p: Product) => p.id !== product.id);
    updatedLocal.push(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
  } catch (error) {
    console.error("Error guardando en local:", error);
    throw error;
  }
};

export const deleteProductFromStorage = async (id: string) => {
  // Borrar de Nube (intento optimista)
  if (isCloudActive && db) {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
       console.error("❌ Error borrando en Nube (Permisos):", error);
    }
  }

  // Borrar de Local
  try {
    const currentLocal = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedLocal = currentLocal.filter((p: Product) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
  } catch (error) {
    console.error("Error borrando en local:", error);
    throw error;
  }
};

export const resetDatabase = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};