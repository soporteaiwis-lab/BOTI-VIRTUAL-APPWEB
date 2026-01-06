
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
    imageUrl: 'https://images.unsplash.com/photo-1629249767341-35b8665ae209?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Cerveza Corona Extra - Pack 6',
    description: 'Botella 355cc. La cerveza más fina, sírvela con limón.',
    price: 15000,
    stock: 100,
    category: Category.CERVEZAS,
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Cerveza Heineken - Pack 6 Latas',
    description: 'Lata 350cc. Premium Quality. Siempre fría.',
    price: 12000,
    stock: 80,
    category: Category.CERVEZAS,
    imageUrl: 'https://images.unsplash.com/photo-1618183204899-3665391d1469?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Ramazzotti Rosato',
    description: 'Aperitivo ideal para la previa. 700ml. Dulce y refrescante.',
    price: 12990,
    stock: 20,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Jack Daniels Old No. 7',
    description: 'Tennessee Whiskey. Botella 750cc. Un clásico mundial.',
    price: 24990,
    stock: 15,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1592317586882-7798361099f6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Hielo Bolsa 2kg Premium',
    description: 'Cubos grandes macizos, no se derriten rápido.',
    price: 1500,
    stock: 30,
    category: Category.BEBIDAS,
    imageUrl: 'https://images.unsplash.com/photo-1590196230626-4d03d157053e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Papas Fritas Lays Corte Americano',
    description: 'Formato grande para compartir. Sal de mar.',
    price: 2500,
    stock: 15,
    category: Category.SNACKS,
    imageUrl: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Jagermeister 700cc',
    description: 'Licor de hierbas alemán. Tómalo muy frío (shot).',
    price: 18990,
    stock: 10,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1605252062638-3b47fa436b76?q=80&w=800&auto=format&fit=crop'
  }
];
