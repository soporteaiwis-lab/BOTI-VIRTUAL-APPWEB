
import { Product, StoreConfig } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_CONFIG } from '../constants';
import { db, isCloudActive } from './firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";

const STORAGE_KEY = 'sln_products_db_v3';
const SETTINGS_KEY = 'sln_settings_v1';

// Helper to simulate delay in local mode for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- PRODUCTS ---

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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProducts));
        return cloudProducts;
      } else {
        try {
          for (const p of INITIAL_PRODUCTS) {
            await setDoc(doc(db, "products", p.id), p);
          }
          return INITIAL_PRODUCTS;
        } catch (seedError) {
          console.warn("No se pudo sembrar la base de datos (Error Permisos):", seedError);
        }
      }
    } catch (error: any) {
      console.error("⚠️ Error conectando a la Nube (Products):", error.message);
    }
  }

  // 2. Fallback: Modo Local
  try {
    await delay(500); 
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
  if (isCloudActive && db) {
    try {
      await setDoc(doc(db, "products", product.id), product);
    } catch (error) {
      console.error("❌ Error guardando en Nube:", error);
    }
  }

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
  if (isCloudActive && db) {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
       console.error("❌ Error borrando en Nube:", error);
    }
  }

  try {
    const currentLocal = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedLocal = currentLocal.filter((p: Product) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
  } catch (error) {
    console.error("Error borrando en local:", error);
    throw error;
  }
};

// --- SETTINGS ---

export const loadSettingsFromStorage = async (): Promise<StoreConfig> => {
  if (isCloudActive && db) {
    try {
      const docRef = doc(db, "config", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as StoreConfig;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
        return data;
      } else {
        // Init settings if not exist
        await setDoc(doc(db, "config", "main"), DEFAULT_STORE_CONFIG);
        return DEFAULT_STORE_CONFIG;
      }
    } catch (e) {
      console.warn("Error loading settings from cloud, falling back to local");
    }
  }

  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_STORE_CONFIG;
};

export const saveSettingsToStorage = async (config: StoreConfig) => {
  if (isCloudActive && db) {
    try {
      await setDoc(doc(db, "config", "main"), config);
    } catch (e) {
      console.error("Error saving settings to cloud", e);
    }
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
};

export const resetDatabase = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  window.location.reload();
};
