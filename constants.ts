
import { Category, Product, StoreConfig } from './types';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: "SALVANDO LA NOCHE",
  whatsappNumber: "56928973426",
  bankName: "Cuenta RUT Banco Estado",
  bankAccount: "12345678",
  bankRut: "11.111.111-1",
  bankEmail: "pagos@salvandolanoche.cl",
  adminPassword: "1234"
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Promo Pisco Alto del Carmen 35° + Coca Cola',
    description: 'La promo sagrada. Incluye hielo de regalo. Ideal para comenzar la noche.',
    price: 9990,
    stock: 50,
    category: Category.PROMOS,
    imageUrl: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Cerveza Corona Extra - Pack 6',
    description: 'Botella 355cc. La cerveza más fina, sírvela con limón.',
    price: 15000,
    stock: 100,
    category: Category.CERVEZAS,
    imageUrl: 'https://images.unsplash.com/photo-1623352720888-75c404620f3a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Cerveza Heineken - Pack 6 Latas',
    description: 'Lata 350cc. Premium Quality. Siempre fría.',
    price: 12000,
    stock: 80,
    category: Category.CERVEZAS,
    imageUrl: 'https://images.unsplash.com/photo-1571506538622-d3861c15c89c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Ramazzotti Rosato',
    description: 'Aperitivo ideal para la previa. 700ml. Dulce y refrescante.',
    price: 12990,
    stock: 20,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1596711904470-36657c91e3e7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Jack Daniels Old No. 7',
    description: 'Tennessee Whiskey. Botella 750cc. Un clásico mundial.',
    price: 24990,
    stock: 15,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1527281400683-1a221290a501?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Hielo Bolsa 2kg Premium',
    description: 'Cubos grandes macizos, no se derriten rápido.',
    price: 1500,
    stock: 30,
    category: Category.BEBIDAS,
    imageUrl: 'https://images.unsplash.com/photo-1504548074900-53eb1c52109e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Papas Fritas Lays Corte Americano',
    description: 'Formato grande para compartir. Sal de mar.',
    price: 2500,
    stock: 15,
    category: Category.SNACKS,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Jagermeister 700cc',
    description: 'Licor de hierbas alemán. Tómalo muy frío (shot).',
    price: 18990,
    stock: 10,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1628104332997-8c3104e1c7f9?q=80&w=800&auto=format&fit=crop'
  }
];
