import React, { useState, useEffect } from 'react';
import { APP_NAME, WHATSAPP_NUMBER } from './constants';
import { Product, CartItem, Category } from './types';
import { loadProductsFromStorage, saveProductToStorage, deleteProductFromStorage, resetDatabase } from './services/storageService';
import { isCloudActive } from './services/firebase';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import GeminiAssistant from './components/GeminiAssistant';
import { ShoppingCart, Moon, Search, Menu, X, Phone, LogOut, Beer, Plus, Minus, Trash2, Lock, User, ArrowRight, Upload, Image as ImageIcon, CreditCard, RefreshCw, Cloud, CloudOff } from 'lucide-react';

// --- Login/Welcome Screen Component ---
const WelcomeScreen = ({ onLogin, onAdminLogin }: { onLogin: (name: string) => void, onAdminLogin: () => void }) => {
  const [name, setName] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCustomerEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onLogin(name);
  };

  const handleAdminEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      onAdminLogin();
    } else {
      setError('Clave incorrecta');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
         <img 
          src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40"
          alt="Nightclub background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-purple-900/30"></div>
        {/* Animated Orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(188,19,254,0.2)] transform transition-all hover:border-white/20">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-black/50 border border-white/10 mb-6 shadow-[0_0_25px_rgba(188,19,254,0.4)] relative">
            <Moon className="w-12 h-12 text-neon-purple fill-current drop-shadow-lg" />
            <div className="absolute inset-0 rounded-full border border-neon-purple/50 animate-ping opacity-20"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic text-white mb-2 tracking-tighter drop-shadow-2xl">
            SALVANDO <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-emerald-400 to-cyan-400">LA NOCHE</span>
          </h1>
          <p className="text-gray-300 text-xs uppercase tracking-[0.3em] font-bold mt-2">
            Botillería Virtual 24/7
          </p>
        </div>

        {!showAdminInput ? (
          <form onSubmit={handleCustomerEnter} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neon-blue ml-2 uppercase tracking-wide">Identificación</label>
              <div className="relative group">
                <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-neon-purple transition-colors" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu Nombre o Teléfono"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all backdrop-blur-sm text-lg"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-neon-purple to-fuchsia-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(188,19,254,0.4)] hover:shadow-[0_0_50px_rgba(188,19,254,0.6)] transition-all transform hover:-translate-y-1 hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              Entrar a la Fiesta <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="pt-4 text-center">
              <button 
                type="button" 
                onClick={() => setShowAdminInput(true)}
                className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto hover:underline decoration-neon-green decoration-2 underline-offset-4"
              >
                <Lock size={12} /> Acceso Master / Staff
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminEnter} className="space-y-6 animate-fade-in">
             <div className="space-y-2">
              <label className="text-xs font-bold text-neon-green ml-2 uppercase tracking-wide drop-shadow-md">Panel de Control</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-neon-green" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Clave Maestra"
                  className="w-full bg-black/40 border border-neon-green/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-neon-green focus:ring-1 focus:ring-neon-green focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] outline-none transition-all text-lg"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-xs text-center font-bold animate-pulse bg-red-900/20 py-2 rounded-lg border border-red-500/20">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => { setShowAdminInput(false); setPassword(''); setError(''); }}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 text-white font-medium py-3 rounded-2xl transition-colors backdrop-blur-md"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 bg-neon-green hover:bg-green-400 text-black font-bold py-3 rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all hover:scale-105"
              >
                Acceder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string, isMaster: boolean } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Voucher State
  const [voucher, setVoucher] = useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);

  // --- Persistence Logic ---
  const fetchProducts = async () => {
    setIsLoading(true);
    const loaded = await loadProductsFromStorage();
    setProducts(loaded);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Cart Logic ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  // Voucher Logic
  const handleVoucherUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVoucher(file);
      setVoucherPreview(URL.createObjectURL(file));
    }
  };

  const removeVoucher = () => {
    setVoucher(null);
    setVoucherPreview(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    let message = `Hola *${APP_NAME}*, soy ${user?.name}. Quiero pedir:%0A` + 
      cart.map(item => `- ${item.quantity}x ${item.name} ($${item.price.toLocaleString('es-CL')})`).join('%0A') +
      `%0A%0A*Total: $${cartTotal.toLocaleString('es-CL')}*`;
    
    if (voucher) {
      message += `%0A%0A📎 *Comprobante de Transferencia:*%0AAdjunto imagen a continuación.`;
    }
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  // --- Admin Logic ---
  const handleSaveProduct = async (product: Product) => {
    await saveProductToStorage(product);
    await fetchProducts(); // Refresh list
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de la base de datos?')) {
      await deleteProductFromStorage(id);
      await fetchProducts(); // Refresh list
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAdminPanel(true);
  };
  
  const handleResetDb = () => {
    if(window.confirm("ADVERTENCIA: Esto borrará todos los cambios y restaurará los productos originales. ¿Continuar?")) {
      resetDatabase();
    }
  }

  // --- Filtering ---
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['Todos', ...Object.values(Category)];

  // --- Render Condition ---
  if (!user) {
    return (
      <WelcomeScreen 
        onLogin={(name) => setUser({ name, isMaster: false })}
        onAdminLogin={() => setUser({ name: 'Master', isMaster: true })}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-neon-green gap-4">
        <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest animate-pulse">CARGANDO BASE DE DATOS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans pb-20 animate-fade-in relative selection:bg-neon-purple selection:text-white">
      
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Dynamic Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-900/30 rounded-full blur-[120px] animate-pulse" style={{animationDelay:'2s'}}></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-neon-purple to-pink-600 p-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(188,19,254,0.5)]">
              <Moon size={24} className="fill-current" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-none tracking-tight">
                {APP_NAME}
              </h1>
              <span className="text-[10px] text-neon-green font-bold tracking-[0.3em] uppercase block mt-0.5 text-shadow-glow">Fonocopete 24/7</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Busca tu trago..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-5 pr-12 text-sm focus:border-neon-purple outline-none w-72 transition-all focus:bg-black/80 focus:shadow-[0_0_15px_rgba(188,19,254,0.2)]"
              />
              <Search className="absolute right-4 top-2.5 text-gray-500 group-focus-within:text-neon-purple transition-colors" size={18} />
            </div>

            <div className="flex items-center gap-3 text-sm bg-white/5 py-1.5 px-4 rounded-full border border-white/5 backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${user.isMaster ? 'bg-neon-green animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium text-gray-300">Hola, <span className={user.isMaster ? "text-neon-purple font-bold" : "text-white"}>{user.name}</span></span>
            </div>
            
            <button 
              onClick={() => setShowCart(true)}
              className="relative group text-white hover:text-neon-blue transition-colors bg-white/5 p-3 rounded-xl hover:bg-white/10 border border-white/5 hover:border-neon-blue/30"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-neon-green text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(57,255,20,0.6)] animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setUser(null)}
              className="text-white/40 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-900 border-b border-white/10 p-4 space-y-4 animate-fade-in-down shadow-2xl backdrop-blur-xl bg-opacity-95">
             <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
               <span className="text-gray-400 flex items-center gap-2"><User size={16}/> {user.name}</span>
             </div>
             <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-neon-blue outline-none"
              />
            </div>
             <button 
              onClick={() => {
                setShowCart(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 text-white bg-white/5 py-3 px-2 rounded-xl active:bg-white/10"
            >
              <ShoppingCart size={20} className="text-neon-green" />
              Ver Carro ({cartItemCount})
            </button>
            <button 
              onClick={() => setUser(null)}
              className="w-full flex items-center justify-center gap-2 text-red-400 py-3 px-2 border border-red-900/30 rounded-xl mt-2"
            >
              <LogOut size={20} /> Salir
            </button>
          </div>
        )}
      </nav>

      {/* Admin Quick Actions Bar */}
      {user.isMaster && (
        <div className={`py-3 px-4 sticky top-[80px] z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors ${isCloudActive ? 'bg-black/60 border-b border-neon-purple/30' : 'bg-orange-900/20 border-b border-orange-500/30'}`}>
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-neon-purple font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 drop-shadow-sm">
                <Lock size={14} /> Modo Master
              </span>
              {isCloudActive ? (
                <span className="flex items-center gap-1 text-[10px] text-neon-green bg-green-900/30 px-2 py-1 rounded border border-green-500/30">
                  <Cloud size={10} /> Conectado a Google Cloud
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-900/30 px-2 py-1 rounded border border-orange-500/30">
                  <CloudOff size={10} /> Modo Local (Configura Firebase)
                </span>
              )}
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleResetDb}
                className="bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-500/30 font-bold py-2 px-3 rounded-lg flex items-center gap-2 text-xs transition-all whitespace-nowrap"
                title="Restaurar productos originales"
              >
                <RefreshCw size={14} /> Reset
              </button>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setShowAdminPanel(true);
                }}
                className="flex-1 md:flex-none bg-neon-green hover:bg-green-400 text-black font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs md:text-sm transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] hover:scale-105"
              >
                <Plus size={16} /> Agregar Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-64 md:h-96 overflow-hidden mb-10 group">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1574096079513-d8259960295f?q=80&w=2574&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[20s]"
          alt="Nightlife"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] mb-2 tracking-tight">
              BIENVENIDO A <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-400 inline-block">LA PREVIA</span>
            </h2>
            <p className="text-lg md:text-2xl text-gray-200 max-w-2xl font-light bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 mx-auto">
              {user.name}, tenemos el hielo listo y el copete helado.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-neon-green font-mono border border-neon-green/30 bg-black/60 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-shadow cursor-pointer">
            <Phone size={16} /> WhatsApp: {WHATSAPP_NUMBER}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative z-10">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 gap-3 mb-10 no-scrollbar sticky top-[135px] md:top-[90px] z-10 bg-dark-900/90 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b border-white/5 md:border-none md:bg-transparent md:backdrop-blur-none transition-all">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all border shadow-lg ${
                selectedCategory === cat 
                  ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_20px_rgba(4,217,255,0.4)] transform scale-105' 
                  : 'bg-dark-800/80 border-dark-700 text-gray-400 hover:border-white/30 hover:text-white hover:bg-dark-700 backdrop-blur-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              isAdmin={user.isMaster}
              onAddToCart={addToCart}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm flex flex-col items-center">
            <div className="inline-block p-8 rounded-full bg-black/40 mb-6 border border-white/10">
              <Beer size={64} className="text-gray-600 opacity-50" />
            </div>
            <h3 className="text-3xl font-bold text-gray-300">Se secó el pozo...</h3>
            <p className="text-gray-500 mt-2 text-lg">No encontramos productos en esta categoría.</p>
            {user.isMaster && (
              <button 
                onClick={() => {
                   setEditingProduct(null);
                   setShowAdminPanel(true);
                }}
                className="mt-8 px-6 py-3 bg-neon-green/10 text-neon-green hover:bg-neon-green hover:text-black font-bold rounded-xl transition-all border border-neon-green/30"
              >
                Agrega el primero aquí
              </button>
            )}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setShowCart(false)}></div>
          <div className="relative w-full max-w-md bg-dark-900 h-full shadow-2xl flex flex-col border-l border-white/10 animate-slide-in-right">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-neon-green text-black p-2 rounded-lg shadow-[0_0_15px_rgba(57,255,20,0.4)]"><ShoppingCart size={20} /></span> 
                Tu Carrete
              </h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="bg-white/5 p-8 rounded-full mb-6 border border-white/5">
                    <ShoppingCart size={48} className="opacity-30" />
                  </div>
                  <p className="text-xl font-bold text-gray-300">Tu carro está vacío</p>
                  <p className="text-sm opacity-60 mt-1">(y tu vaso también)</p>
                  <button onClick={() => setShowCart(false)} className="mt-8 px-6 py-2 border border-neon-blue text-neon-blue rounded-full hover:bg-neon-blue hover:text-black transition-all">
                    Volver al catálogo
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-lg" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-neon-blue transition-colors">{item.name}</h4>
                        <p className="text-neon-green font-bold text-sm mt-1">${item.price.toLocaleString('es-CL')}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3 bg-black/40 w-fit p-1 rounded-lg border border-white/10">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-600 hover:text-red-500 p-2 transition-colors bg-transparent hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Voucher and Bank Section */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-neon-blue mb-4 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={14} /> Datos Transferencia
                </h3>
                
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4 text-xs text-gray-300 space-y-2 font-mono">
                    <p className="flex justify-between border-b border-white/5 pb-1"><span>Banco:</span> <span className="text-white font-bold">Estado</span></p>
                    <p className="flex justify-between border-b border-white/5 pb-1"><span>Cuenta RUT:</span> <span className="text-white font-bold">12.345.678-9</span></p>
                    <p className="flex justify-between border-b border-white/5 pb-1"><span>Nombre:</span> <span className="text-white font-bold">Salvando La Noche SpA</span></p>
                    <p className="flex justify-between"><span>Email:</span> <span className="text-white font-bold">pagos@salvando.cl</span></p>
                </div>

                {!voucherPreview ? (
                    <div className="relative group">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleVoucherUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-neon-purple group-hover:bg-neon-purple/5 transition-all">
                            <div className="bg-white/10 p-3 rounded-full group-hover:scale-110 transition-transform group-hover:bg-neon-purple/20">
                                <Upload size={24} className="text-gray-400 group-hover:text-neon-purple" />
                            </div>
                            <span className="text-sm text-gray-300 font-medium group-hover:text-white">Adjuntar Comprobante</span>
                            <span className="text-[10px] text-gray-500">Click o arrastra tu foto aquí</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden border border-neon-green/50 group shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                        <img src={voucherPreview} alt="Comprobante" className="w-full h-32 object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button 
                                onClick={removeVoucher}
                                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/80 px-3 py-1.5 rounded-lg text-[10px] text-neon-green flex items-center gap-1.5 backdrop-blur-sm border border-neon-green/20 z-10 font-bold uppercase tracking-wide">
                            <ImageIcon size={12} /> Voucher listo
                        </div>
                    </div>
                )}
            </div>
            )}

            <div className="p-6 bg-black/60 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-20 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-medium">Total a Pagar</span>
                <span className="text-white text-3xl font-black tracking-tight">${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                  ${cart.length > 0 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-[0_0_20px_rgba(0,255,0,0.3)]' 
                    : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'}`}
              >
                <Phone size={22} className={cart.length > 0 ? "animate-pulse" : ""} />
                {voucher ? 'ENVIAR PEDIDO' : 'PEDIR POR WHATSAPP'}
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-gray-500 mt-4">
                 {voucher ? 'Se abrirá WhatsApp con los detalles.' : 'Coordinaremos el pago en el chat.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* AI Assistant */}
      <GeminiAssistant />

    </div>
  );
};

export default App;