
export enum Category {
  LICORES = 'Licores',
  CERVEZAS = 'Cervezas',
  BEBIDAS = 'Bebidas',
  CIGARROS = 'Cigarros',
  SNACKS = 'Snacks',
  PROMOS = 'Promos'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface StoreConfig {
  storeName: string;
  whatsappNumber: string;
  bankName: string;
  bankAccount: string;
  bankRut: string;
  bankEmail: string;
  adminPassword?: string;
}
