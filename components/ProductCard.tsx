import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isAdmin, 
  onAddToCart, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-dark-800 rounded-xl overflow-hidden shadow-lg border border-dark-700 hover:border-neon-purple transition-all duration-300 flex flex-col h-full relative group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            ¡Pocas unidades!
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-red-500 font-bold text-xl uppercase border-2 border-red-500 px-4 py-2 rotate-12">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-neon-blue uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-lg font-bold text-white">
            ${product.price.toLocaleString('es-CL')}
          </span>
        </div>
        
        <h3 className="text-lg font-medium text-white mb-1 leading-tight">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-1">{product.description}</p>
        
        <div className="mt-auto space-y-2">
          {isAdmin ? (
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(product)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Edit size={16} /> Editar
              </button>
              <button 
                onClick={() => onDelete(product.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200
                ${product.stock > 0 
                  ? 'bg-neon-green/90 hover:bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              <ShoppingCart size={18} />
              {product.stock > 0 ? 'Agregar al Carro' : 'Sin Stock'}
            </button>
          )}
          
          {isAdmin && (
            <div className="text-xs text-center text-gray-500">
              Stock actual: {product.stock}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;