import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Promo Pisco Alto del Carmen 35° + Coca Cola 1.5L',
    description: 'El clásico chileno. Incluye hielo de regalo.',
    price: 9990,
    stock: 50,
    category: Category.PROMOS,
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: '2',
    name: 'Pack 6 Cervezas Royal Guard',
    description: 'Lata 473cc. Bien heladas.',
    price: 6500,
    stock: 100,
    category: Category.CERVEZAS,
    imageUrl: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: '3',
    name: 'Ramazzotti Rosato',
    description: 'Aperitivo ideal para la previa. 700ml.',
    price: 12990,
    stock: 20,
    category: Category.LICORES,
    imageUrl: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: '4',
    name: 'Cigarros Lucky Strike Mora 20',
    description: 'Cajetilla dura. Click mentolado.',
    price: 4800,
    stock: 200,
    category: Category.CIGARROS,
    imageUrl: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: '5',
    name: 'Hielo Bolsa 2kg',
    description: 'Cubos grandes, no se derriten rápido.',
    price: 1500,
    stock: 30,
    category: Category.BEBIDAS,
    imageUrl: 'https://picsum.photos/400/400?random=5'
  },
  {
    id: '6',
    name: 'Papas Fritas Lays Corte Americano',
    description: 'Formato grande para compartir.',
    price: 2500,
    stock: 15,
    category: Category.SNACKS,
    imageUrl: 'https://picsum.photos/400/400?random=6'
  },
    {
    id: '7',
    name: 'Whisky Johnnie Walker Red Label',
    description: 'Botella 750cc.',
    price: 14990,
    stock: 10,
    category: Category.LICORES,
    imageUrl: 'https://picsum.photos/400/400?random=7'
  }
];

export const APP_NAME = "SALVANDO LA NOCHE";
export const WHATSAPP_NUMBER = "56912345678"; // Example number