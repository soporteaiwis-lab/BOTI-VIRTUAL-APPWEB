import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { X, Upload, Save, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  editingProduct: Product | null;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onSave, editingProduct }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: Category.PROMOS,
    imageUrl: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
      setImagePreview(editingProduct.imageUrl);
    } else {
      resetForm();
    }
  }, [editingProduct, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: Category.PROMOS,
      imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop'
    });
    setImagePreview('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  // Convert image to Base64 to save in DB (works across devices)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // Limit 500kb to prevent DB crash
        setUploadError('Imagen muy pesada (max 500kb). Intenta una más liviana.');
        return;
      }
      setUploadError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    setIsSaving(true);

    try {
      const productToSave: Product = {
        id: editingProduct?.id || crypto.randomUUID(),
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        stock: formData.stock || 0,
        category: formData.category as Category || Category.PROMOS,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop'
      };

      await onSave(productToSave);
      onClose();
      if (!editingProduct) resetForm();
    } catch (error) {
      alert("Error guardando. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border border-white/10 w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(188,19,254,0.3)] flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-3xl">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            {editingProduct ? 'Editar Producto' : 'Crear Nuevo'}
            <span className="bg-neon-green text-black text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">Master DB</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors bg-black/50 p-2 rounded-full hover:bg-red-500/10">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Image Upload Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-full h-48 bg-black/50 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden hover:border-neon-purple transition-all group shadow-inner">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold flex items-center gap-2"><Upload size={20}/> Cambiar Foto</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-neon-purple group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} />
                  </div>
                  <span className="text-sm text-gray-300 font-bold block">Sube una foto del producto</span>
                  <span className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG (Max 500kb)</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
            </div>
            {uploadError && (
              <p className="text-red-400 text-xs flex items-center gap-1 font-bold"><AlertCircle size={12}/> {uploadError}</p>
            )}
            
            <div className="w-full text-center border-b border-white/10 pb-4 mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-widest">O pega una URL de internet</span>
                <input 
                    type="text" 
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => {
                        setFormData(prev => ({...prev, imageUrl: e.target.value}));
                        setImagePreview(e.target.value);
                    }}
                    className="w-full mt-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:border-neon-blue outline-none text-center"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neon-blue mb-2 uppercase tracking-wide">Nombre del Producto</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all"
                  placeholder="Ej: Pisco Mistral 35°"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Categoría</label>
                <div className="relative">
                    <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple outline-none appearance-none"
                    >
                    {Object.values(Category).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">▼</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neon-green mb-2 uppercase tracking-wide">Precio ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none font-mono text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Stock Inicial</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-neon-blue outline-none font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Descripción para el cliente</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple outline-none resize-none"
              placeholder="Detalles del producto (sabor, tamaño, si viene helado...)"
            />
          </div>

        </form>

        <div className="p-6 border-t border-white/5 bg-black/40 rounded-b-3xl flex justify-end gap-4 backdrop-blur-lg">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:shadow-[0_0_30px_rgba(188,19,254,0.6)] transition-all flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isSaving ? (
                <>Guardando...</>
            ) : (
                <><Save size={20} /> Guardar en Base de Datos</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;