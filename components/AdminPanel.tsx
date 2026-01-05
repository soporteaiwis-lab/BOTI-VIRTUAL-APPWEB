import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { X, Upload, Save } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
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
      imageUrl: 'https://picsum.photos/400/400'
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake local URL for the session
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setFormData(prev => ({ ...prev, imageUrl: objectUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const productToSave: Product = {
      id: editingProduct?.id || crypto.randomUUID(),
      name: formData.name || '',
      description: formData.description || '',
      price: formData.price || 0,
      stock: formData.stock || 0,
      category: formData.category as Category || Category.PROMOS,
      imageUrl: formData.imageUrl || 'https://picsum.photos/400/400'
    };

    onSave(productToSave);
    if (!editingProduct) resetForm(); // Keep open if creating, but clear form? Or close. Let's just clear for continuous adding.
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            <span className="text-neon-purple text-sm font-normal px-2 py-0.5 border border-neon-purple rounded-full">Admin</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Image Upload Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 bg-dark-900 rounded-xl border-2 border-dashed border-dark-700 flex items-center justify-center overflow-hidden hover:border-neon-blue transition-colors group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-neon-blue" size={24} />
                  <span className="text-xs text-gray-500">Subir foto</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Click para subir imagen del producto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none"
                  placeholder="Ej: Pisco Mistral 35°"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-neon-purple outline-none"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Precio ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-neon-green outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Stock Inicial</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-neon-blue outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-neon-purple outline-none resize-none"
              placeholder="Detalles del producto..."
            />
          </div>

        </form>

        <div className="p-6 border-t border-dark-700 bg-dark-900/50 rounded-b-2xl flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-lg shadow-lg hover:shadow-neon-purple/50 transition-all flex items-center gap-2"
          >
            <Save size={18} />
            {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;