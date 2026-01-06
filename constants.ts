import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Promo Pisco Alto del Carmen 35° + Coca Cola 1.5L',
    description: 'El clásico chileno. Incluye hielo de regalo. Ideal para comenzar la noche.',
    price: 9990,
    stock: 50,
    category: Category.PROMOS,
    imageUrl: 'https://images.unsplash.com/photo-1626202378873-199f743c3d54?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Cerveza Corona Extra - Pack 6',
    description: 'Botella 355cc. La cerveza más fina, sírvela con limón.',
    price: 15000,
    stock: 100,
    category: Category.CERVEZAS,
    imageUrl: 'https://images.unsplash.com/photo-1605218427306-635ba2496ed9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Cerveza Cristal - Pack 6 Latas',
    description: 'Lata 350cc. Única, grande y nuestra. Bien helada.',
    price: 12000,
    stock: 80,
    category: Category.CERVEZAS,
    imageUrl: 'https://images.unsplash.com/photo-1623677353995-2d4e6628929e?q=80&w=800&auto=format&fit=crop' // Generic beer can image as specific Cristal hard to find on unsplash, usually users upload their own.
  },
  {
    id: '4',
    name: 'Ramazzotti Rosato',
    description: 'Aperitivo ideal para la previa. 700ml. Dulce y refrescante.',
    price: 12990,
    stock: 20,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1563222370-13f9c6d17277?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Cigarros Lucky Strike Mora 20',
    description: 'Cajetilla dura. Click mentolado sabor mora.',
    price: 4800,
    stock: 200,
    category: Category.CIGARROS,
    imageUrl: 'https://images.unsplash.com/photo-1527788349257-2c1cb73f2780?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Hielo Bolsa 2kg',
    description: 'Cubos grandes macizos, no se derriten rápido.',
    price: 1500,
    stock: 30,
    category: Category.BEBIDAS,
    imageUrl: 'https://images.unsplash.com/photo-1551759714-3663b9f47285?q=80&w=800&auto=format&fit=crop'
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
    name: 'Whisky Johnnie Walker Red Label',
    description: 'Botella 750cc. El whisky escocés más vendido del mundo.',
    price: 14990,
    stock: 10,
    category: Category.LICORES,
    imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aadd7709254?q=80&w=800&auto=format&fit=crop'
  }
];

export const APP_NAME = "SALVANDO LA NOCHE";
export const WHATSAPP_NUMBER = "56928973426";