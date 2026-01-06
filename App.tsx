import React, { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, APP_NAME, WHATSAPP_NUMBER } from './constants';
import { Product, CartItem, Category } from './types';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import GeminiAssistant from './components/GeminiAssistant';
import { ShoppingCart, Moon, Search, Menu, X, Phone, LogOut, Beer, Plus, Minus, Trash2, Lock, User, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <img 
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          alt="Nightclub background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-purple-900/40"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="z-10 w-full max-w-md bg-dark-800/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl transform transition-all">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-black/40 border border-white/10 mb-4 shadow-[0_0_20px_rgba(188,19,254,0.3)]">
            <Moon className="w-12 h-12 text-neon-purple fill-current drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-black italic text-white mb-2 tracking-tighter drop-shadow-md">
            SALVANDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">LA NOCHE</span>
          </h1>
          <p className="text-gray-300 text-sm uppercase tracking-widest font-semibold">Fonocopete & Botillería 24/7</p>
        </div>

        {!showAdminInput ? (
          <form onSubmit={handleCustomerEnter} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Para atenderte mejor:</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-neon-purple transition-colors" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu Nombre o Teléfono"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all backdrop-blur-sm"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-neon-purple to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:shadow-[0_0_30px_rgba(188,19,254,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Entrar a la Botillería <ArrowRight size={20} />
            </button>
            
            <div className="pt-4 text-center">
              <button 
                type="button" 
                onClick={() => setShowAdminInput(true)}
                className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <Lock size={12} /> Acceso Master
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminEnter} className="space-y-6 animate-fade-in">
             <div className="space-y-2">
              <label className="text-sm font-medium text-neon-green ml-1 drop-shadow-md">Zona Master</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-neon-green" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Clave de Acceso"
                  className="w-full bg-black/40 border border-neon-green/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-xs text-center font-bold animate-pulse bg-red-500/10 py-1 rounded">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => { setShowAdminInput(false); setPassword(''); setError(''); }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors backdrop-blur-md"
              >
                Volver
              </button>
              <button 
                type="submit"
                className="flex-1 bg-neon-green hover:bg-green-500 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-colors"
              >
                Acceder
              </button>
            </div>
          </form>
        )}
      </div>
      <p className="absolute bottom-4 text-white/30 text-xs flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500"></span> Operativo 24/7
      </p>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string, isMaster: boolean } | null>(null);
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const message = `Hola *${APP_NAME}*, soy ${user?.name}. Quiero pedir:%0A` + 
      cart.map(item => `- ${item.quantity}x ${item.name} ($${item.price.toLocaleString('es-CL')})`).join('%0A') +
      `%0A%0A*Total: $${cartTotal.toLocaleString('es-CL')}*`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  // --- Admin Logic ---
  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, product];
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAdminPanel(true);
  };

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

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans pb-20 animate-fade-in relative">
      
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-neon-purple to-pink-600 p-2 rounded-lg text-white shadow-lg">
              <Moon size={24} className="fill-current" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-none">
                {APP_NAME}
              </h1>
              <span className="text-[10px] text-neon-green font-bold tracking-[0.2em] uppercase">Fonocopete 24/7</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Busca tu copete..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark-800/50 border border-dark-700 rounded-full py-2 pl-4 pr-10 text-sm focus:border-neon-purple outline-none w-64 transition-all focus:bg-dark-800"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500 group-focus-within:text-neon-purple transition-colors" size={16} />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 bg-dark-800/50 py-1.5 px-3 rounded-full border border-white/5">
              <User size={16} />
              <span><span className={user.isMaster ? "text-neon-purple font-bold" : "text-gray-200"}>{user.name}</span></span>
            </div>
            
            <button 
              onClick={() => setShowCart(true)}
              className="relative text-white hover:text-neon-blue transition-colors bg-dark-800/50 p-2.5 rounded-full hover:bg-dark-700 border border-white/5"
            >
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-green text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-green-500/50 animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setUser(null)}
              className="text-white/50 hover:text-red-400 transition-colors"
              title="Salir"
            >
              <LogOut size={20} />
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-800 border-b border-dark-700 p-4 space-y-4 animate-fade-in-down shadow-2xl">
             <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
               <span className="text-gray-400">Usuario: <b className="text-white">{user.name}</b></span>
             </div>
             <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white"
              />
            </div>
             <button 
              onClick={() => {
                setShowCart(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 text-white py-3 px-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} />
              Ver Carro ({cartItemCount})
            </button>
            <button 
              onClick={() => setUser(null)}
              className="w-full flex items-center gap-2 text-red-400 py-3 px-2 hover:bg-red-500/10 rounded-lg mt-2"
            >
              <LogOut size={20} /> Salir
            </button>
          </div>
        )}
      </nav>

      {/* Admin Quick Actions Bar */}
      {user.isMaster && (
        <div className="bg-dark-800/90 border-b border-neon-purple/30 py-3 px-4 sticky top-[73px] z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-neon-purple font-bold text-sm uppercase tracking-wider flex items-center gap-2 drop-shadow-sm">
              <Lock size={14} /> Modo Dios Activo
            </span>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setShowAdminPanel(true);
              }}
              className="bg-neon-green hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-all shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
            >
              <Plus size={16} /> Nuevo Producto / Promo
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-64 md:h-80 overflow-hidden mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1574096079513-d8259960295f?q=80&w=2574&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[20s]"
          alt="Nightlife"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] mb-2 tracking-tight">
            BIENVENIDO A <span className="text-neon-blue inline-block transform hover:scale-110 transition-transform cursor-default">LA PREVIA</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light bg-black/30 backdrop-blur-sm p-2 rounded-xl">
            {user.name}, tenemos el hielo listo y el copete helado.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-neon-green font-mono border border-neon-green/30 bg-black/50 px-4 py-1 rounded-full">
            <Phone size={14} /> WhatsApp: {WHATSAPP_NUMBER}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative z-10">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 gap-3 mb-8 no-scrollbar sticky top-[130px] md:top-[80px] z-10 bg-dark-900/95 backdrop-blur-md py-3 -mx-4 px-4 md:mx-0 md:px-0 border-b border-white/5 md:border-none md:bg-transparent">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${
                selectedCategory === cat 
                  ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(4,217,255,0.4)] transform scale-105' 
                  : 'bg-dark-800/80 border-dark-700 text-gray-400 hover:border-gray-500 hover:text-white hover:bg-dark-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-24 bg-dark-800/30 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="inline-block p-6 rounded-full bg-dark-800/50 mb-4">
              <Beer size={48} className="text-gray-600 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300">Se secó el pozo...</h3>
            <p className="text-gray-500 mt-2">No encontramos productos en esta categoría.</p>
            {user.isMaster && (
              <button 
                onClick={() => {
                   setEditingProduct(null);
                   setShowAdminPanel(true);
                }}
                className="mt-6 text-neon-green hover:text-white font-bold underline decoration-neon-green decoration-2 underline-offset-4"
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
          <div className="relative w-full max-w-md bg-dark-800 h-full shadow-2xl flex flex-col border-l border-dark-700 animate-slide-in-right">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/90 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="bg-neon-green/20 text-neon-green p-2 rounded-lg"><ShoppingCart size={20} /></span> 
                Pedido de {user.name}
              </h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="bg-dark-900 p-6 rounded-full mb-4 border border-dark-700">
                    <ShoppingCart size={40} className="opacity-30" />
                  </div>
                  <p className="text-lg font-medium">Tu carro está vacío</p>
                  <p className="text-sm opacity-60">(y tu vaso también)</p>
                  <button onClick={() => setShowCart(false)} className="mt-6 text-neon-blue text-sm hover:underline">
                    Ir a comprar algo
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-dark-900/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow-md" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug">{item.name}</h4>
                        <p className="text-neon-green font-bold text-sm mt-1">${item.price.toLocaleString('es-CL')}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 bg-dark-900/50 w-fit p-1 rounded-lg border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center hover:bg-dark-600 text-white transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center hover:bg-dark-600 text-white transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 p-2 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-dark-900 border-t border-dark-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-medium">Total a Pagar</span>
                <span className="text-white text-2xl font-black">${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                  ${cart.length > 0 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/50' 
                    : 'bg-dark-700 text-gray-500 cursor-not-allowed'}`}
              >
                <Phone size={22} />
                Pedir por WhatsApp
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-gray-500 mt-4">
                Pago y entrega coordinados directo con el staff
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