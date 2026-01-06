import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ShoppingCart, Edit, Trash2, Zap, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop";

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isAdmin, 
  onAddToCart, 
  onEdit, 
  onDelete 
}) => {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(product.imageUrl);
    setHasError(false);
  }, [product.imageUrl]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/5 hover:border-neon-purple/50 transition-all duration-300 flex flex-col h-full relative group hover:shadow-[0_0_30px_rgba(188,19,254,0.15)] hover:-translate-y-2">
      <div className="relative h-56 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent z-10 opacity-60"></div>
        <img 
          src={imgSrc} 
          alt={product.name}
          onError={handleError} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-black/60 backdrop-blur-md text-neon-blue text-[10px] font-bold px-3 py-1 rounded-full border border-neon-blue/30 uppercase tracking-wider shadow-lg">
            {product.category}
          </span>
        </div>

        {/* Stock Status Badges */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 z-20 bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse border border-orange-400 shadow-lg">
            ¡POCAS UNIDADES!
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-20 flex items-center justify-center border-4 border-red-500/50 m-1 rounded-[1.3rem]">
            <span className="text-red-500 font-black text-2xl uppercase border-4 border-red-500 px-6 py-2 -rotate-12 shadow-[0_0_30px_rgba(255,0,0,0.6)] tracking-widest bg-black">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col relative z-20 -mt-10">
        <div className="flex justify-between items-end mb-3">
           <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg ring-1 ring-white/5">
             <span className="text-xl font-black text-white block text-shadow">
               ${product.price.toLocaleString('es-CL')}
             </span>
           </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-neon-purple transition-colors drop-shadow-sm">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="mt-auto space-y-3">
          {isAdmin ? (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onEdit(product)}
                className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-blue-600/30"
              >
                <Edit size={16} /> Editar
              </button>
              <button 
                onClick={() => onDelete(product.id)}
                className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white py-2.5 px-3 rounded-xl flex items-center justify-center transition-all border border-red-600/30"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 relative overflow-hidden group/btn
                ${product.stock > 0 
                  ? 'bg-white text-black hover:bg-neon-green hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]' 
                  : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'}`}
            >
              {product.stock > 0 && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>}
              <ShoppingCart size={18} />
              {product.stock > 0 ? 'LO QUIERO' : 'AGOTADO'}
            </button>
          )}
          
          {isAdmin && (
            <div className="flex justify-center">
              <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/5">
                Stock disponible: <span className="text-white font-bold">{product.stock}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;