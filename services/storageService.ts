import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const STORAGE_KEY = 'sln_products_db_v1';

export const loadProductsFromStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // First run: save initial products to storage
      saveProductsToStorage(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading database:", error);
    return INITIAL_PRODUCTS;
  }
};

export const saveProductsToStorage = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving to database:", error);
  }
};

// Reset database to factory settings (useful for debugging or master reset)
export const resetDatabase = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};