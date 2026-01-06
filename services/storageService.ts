import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { db, isCloudActive } from './firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";

const STORAGE_KEY = 'sln_products_db_v2';

// Helper to simulate delay in local mode for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loadProductsFromStorage = async (): Promise<Product[]> => {
  try {
    // 1. Intentar cargar desde la Nube (Google Firebase)
    if (isCloudActive && db) {
      const querySnapshot = await getDocs(collection(db, "products"));
      const cloudProducts: Product[] = [];
      querySnapshot.forEach((doc: any) => {
        cloudProducts.push(doc.data() as Product);
      });
      
      if (cloudProducts.length > 0) {
        return cloudProducts;
      } else {
        // Si la nube está vacía (primera vez), subimos los iniciales
        for (const p of INITIAL_PRODUCTS) {
          await setDoc(doc(db, "products", p.id), p);
        }
        return INITIAL_PRODUCTS;
      }
    }

    // 2. Fallback: Modo Local (LocalStorage)
    await delay(500); // UI feel
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);

  } catch (error) {
    console.error("Error loading database:", error);
    return INITIAL_PRODUCTS;
  }
};

export const saveProductToStorage = async (product: Product) => {
  try {
    // Guardar en Nube
    if (isCloudActive && db) {
      await setDoc(doc(db, "products", product.id), product);
    }

    // SIEMPRE Guardar en Local como respaldo/cache
    const currentLocal = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedLocal = currentLocal.filter((p: Product) => p.id !== product.id);
    updatedLocal.push(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));

  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

export const deleteProductFromStorage = async (id: string) => {
  try {
    // Borrar de Nube
    if (isCloudActive && db) {
      await deleteDoc(doc(db, "products", id));
    }

    // Borrar de Local
    const currentLocal = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedLocal = currentLocal.filter((p: Product) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
    
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const resetDatabase = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};