import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem, Category, StoreConfig } from './types';
import { DEFAULT_STORE_CONFIG } from './constants';
import { loadProductsFromStorage, saveProductToStorage, deleteProductFromStorage, resetDatabase, loadSettingsFromStorage, saveSettingsToStorage } from './services/storageService';
import { isCloudActive, clearFirebaseConfig } from './services/firebase';
import { analyzeVoucherImage } from './services/geminiService';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import GeminiAssistant from './components/GeminiAssistant';
import { ShoppingCart, Moon, Search, Menu, X, Phone, LogOut, Beer, Plus, Minus, Trash2, Lock, User, ArrowRight, Upload, Image as ImageIcon, CreditCard, RefreshCw, Cloud, CloudOff, Database, Settings as SettingsIcon, Save, DollarSign, Wallet, ScanLine, Loader2, CheckCircle, Bike, MapPin, Building2, ExternalLink } from 'lucide-react';

// --- Login/Welcome Screen Component ---
const WelcomeScreen = ({ onLogin, onAdminLogin, storeName }: { onLogin: (name: string, phone: string) => void, onAdminLogin: (pass: string) => boolean, storeName: string }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCustomerEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim().length >= 8) {
      onLogin(name, phone);
    } else {
      setError("Ingresa nombre y teléfono válido (8 dígitos)");
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAdminEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAdminLogin(password)) {
      // Success is handled by callback return
    } else {
      setError('Clave incorrecta');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
         <img 
          src="https://images.unsplash.com/photo-1570572127365-3bd739433e36?q=80&w=2666&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-50"
          alt="Neon Vibes"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-purple-900/30"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(188,19,254,0.2)] transform transition-all hover:border-white/20">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-black/50 border border-white/10 mb-6 shadow-[0_0_25px_rgba(188,19,254,0.4)] relative">
            <Moon className="w-12 h-12 text-neon-purple fill-current drop-shadow-lg" />
            <div className="absolute inset-0 rounded-full border border-neon-purple/50 animate-ping opacity-20"></div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic text-white mb-2 tracking-tighter drop-shadow-2xl uppercase">
            {storeName}
          </h1>
          <p className="text-gray-300 text-xs uppercase tracking-[0.3em] font-bold mt-2">
            Botillería Virtual 24/7
          </p>
        </div>

        {!showAdminInput ? (
          <form onSubmit={handleCustomerEnter} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neon-blue ml-2 uppercase tracking-wide">Nombre</label>
              <div className="relative group">
                <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-neon-purple transition-colors" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu Nombre"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all backdrop-blur-sm text-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neon-blue ml-2 uppercase tracking-wide">Teléfono (WhatsApp)</label>
              <div className="relative group flex items-center bg-black/40 border border-white/10 rounded-2xl focus-within:border-neon-purple focus-within:ring-1 focus-within:ring-neon-purple transition-all backdrop-blur-sm">
                <div className="pl-4 pr-2 border-r border-white/10 text-gray-400 font-mono text-lg flex items-center gap-1">
                  <span>+56 9</span>
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 8) setPhone(val);
                  }}
                  placeholder="12345678"
                  className="w-full bg-transparent border-none py-4 px-4 text-white placeholder-gray-500 outline-none text-lg font-mono"
                  required
                />
              </div>
            </div>
            
            {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-neon-purple to-fuchsia-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(188,19,254,0.4)] hover:shadow-[0_0_50px_rgba(188,19,254,0.6)] transition-all transform hover:-translate-y-1 hover:scale-[1.02] flex items-center justify-center gap-2 group mt-4"
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

// --- Settings Modal ---
const SettingsModal = ({ config, onClose, onSave }: { config: StoreConfig, onClose: () => void, onSave: (newConfig: StoreConfig) => void }) => {
  const [formData, setFormData] = useState<StoreConfig>(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <SettingsIcon size={24} className="text-neon-blue" /> Configuración de Tienda
          </h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-white" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neon-green uppercase">Nombre del Negocio</label>
            <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-neon-green uppercase">WhatsApp de Pedidos (569...)</label>
            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mt-1" />
          </div>
          
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
             <h4 className="text-sm font-bold text-neon-purple uppercase mb-2 flex items-center gap-2"><CreditCard size={14}/> Datos Bancarios</h4>
             <div>
                <label className="text-xs text-gray-400">Nombre Banco</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm" />
             </div>
             <div>
                <label className="text-xs text-gray-400">Número de Cuenta</label>
                <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm" />
             </div>
             <div>
                <label className="text-xs text-gray-400">RUT</label>
                <input type="text" name="bankRut" value={formData.bankRut} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm" />
             </div>
             <div>
                <label className="text-xs text-gray-400">Email Transferencias</label>
                <input type="text" name="bankEmail" value={formData.bankEmail} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm" />
             </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-red-400 uppercase">Clave de Acceso (Master)</label>
            <input type="text" name="adminPassword" value={formData.adminPassword} onChange={handleChange} className="w-full bg-black/40 border border-red-900/30 rounded-xl p-3 text-white mt-1 focus:border-red-500" />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-neon-blue text-black font-bold rounded-xl hover:bg-cyan-400 flex items-center gap-2">
            <Save size={18} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Checkout Modal ---
const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  total, 
  config, 
  user
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[], 
  total: number, 
  config: StoreConfig, 
  user: { name: string, phone: string } 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | null>(null);
  const [cashAmount, setCashAmount] = useState<string>('');
  const [voucher, setVoucher] = useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voucherAnalysis, setVoucherAnalysis] = useState<string | null>(null);
  
  // Delivery State
  const [isDelivery, setIsDelivery] = useState(false);
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [canDeliver, setCanDeliver] = useState(false);

  const DELIVERY_FEE = 10000;
  const MAX_DISTANCE_KM = 5;
  
  // Coordenadas La Legua, San Joaquín, Santiago
  const STORE_LAT = -33.472695;
  const STORE_LNG = -70.627329;

  if (!isOpen) return null;

  const finalTotal = total + (isDelivery && canDeliver ? DELIVERY_FEE : 0);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleCheckLocation = () => {
    if (!address.trim()) {
        alert("Por favor escribe tu dirección primero.");
        return;
    }

    if (!navigator.geolocation) {
      alert("La geolocalización no es soportada por tu navegador.");
      return;
    }
    setCheckingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const dist = calculateDistance(STORE_LAT, STORE_LNG, userLat, userLng);
        setDistance(dist);
        setCheckingLocation(false);
        if (dist <= MAX_DISTANCE_KM) {
          setCanDeliver(true);
        } else {
          setCanDeliver(false);
          alert(`Estás a ${dist.toFixed(1)}km de La Legua. El delivery solo cubre ${MAX_DISTANCE_KM}km.`);
        }
      },
      (error) => {
        setCheckingLocation(false);
        alert("Error obteniendo ubicación GPS. Asegúrate de dar permisos.");
        console.error(error);
      }
    );
  };

  const handleVoucherUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVoucher(file);
      const url = URL.createObjectURL(file);
      setVoucherPreview(url);
      setVoucherAnalysis(null);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setIsAnalyzing(true);
        try {
          const analysis = await analyzeVoucherImage(base64String);
          setVoucherAnalysis(analysis);
        } catch (err) {
          console.error(err);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOrder = () => {
    // Construcción del mensaje con formato seguro
    let lines = [];
    lines.push(`Hola *${config.storeName}*, soy ${user.name} (+56 9 ${user.phone}).`);
    lines.push("");
    lines.push("*MI PEDIDO:*");
    cart.forEach(item => {
        lines.push(`- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-CL')})`);
    });
    
    lines.push("");
    lines.push(`*SUBTOTAL: $${total.toLocaleString('es-CL')}*`);

    if (isDelivery) {
        lines.push("");
        lines.push(`🛵 *DELIVERY INCLUIDO* (+ $${DELIVERY_FEE.toLocaleString('es-CL')})`);
        lines.push(`Dirección: ${address}`);
        lines.push(`Distancia val. (La Legua): ${distance?.toFixed(1)} km`);
    } else {
        lines.push("");
        lines.push(`🏃‍♂️ *RETIRO EN LOCAL*`);
    }

    lines.push(`*TOTAL FINAL: $${finalTotal.toLocaleString('es-CL')}*`);

    if (paymentMethod === 'cash') {
      lines.push("");
      lines.push(`💵 *PAGO EN EFECTIVO*`);
      if (cashAmount) {
        lines.push(`Pago con: $${parseInt(cashAmount).toLocaleString('es-CL')}`);
        const change = parseInt(cashAmount) - finalTotal;
        if (change > 0) lines.push(`(Vuelto: $${change.toLocaleString('es-CL')})`);
      } else {
        lines.push(`Pago justo.`);
      }
    } else if (paymentMethod === 'transfer') {
      lines.push("");
      lines.push(`📲 *TRANSFERENCIA*`);
      if (voucherAnalysis) {
        // Limpiamos el análisis de saltos de línea extraños para la URL
        lines.push("--- Datos Voucher ---");
        lines.push(voucherAnalysis);
      } else {
        lines.push(`(Adjuntaré comprobante en el chat)`);
      }
    }

    // Unir todo y codificar
    const messageBody = lines.join("\n");
    const encodedMessage = encodeURIComponent(messageBody);
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-900 border-t md:border border-white/10 w-full max-w-xl md:rounded-3xl rounded-t-3xl shadow-[0_-10px_40px_rgba(188,19,254,0.3)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-black via-purple-900/20 to-black rounded-t-3xl">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            CONFIRMAR PEDIDO
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* User Info */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <User size={20} className="text-neon-blue" />
                  <div>
                      <p className="text-white font-bold text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">+56 9 {user.phone}</p>
                  </div>
              </div>
          </div>

          {/* Delivery Toggle */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold text-white uppercase tracking-wide">Tipo de Entrega</h3>
             <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => setIsDelivery(false)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${!isDelivery ? 'border-neon-purple bg-neon-purple/10 text-white' : 'border-white/10 bg-black/40 text-gray-400'}`}
                 >
                     <Building2 size={24} />
                     <span className="font-bold text-sm">Retiro</span>
                 </button>
                 <button 
                    onClick={() => setIsDelivery(true)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${isDelivery ? 'border-neon-purple bg-neon-purple/10 text-white shadow-[0_0_15px_rgba(188,19,254,0.3)]' : 'border-white/10 bg-black/40 text-gray-400'}`}
                 >
                     <Bike size={24} />
                     <span className="font-bold text-sm">Delivery (+$10k)</span>
                 </button>
             </div>

             {isDelivery && (
                 <div className="bg-black/40 p-4 rounded-xl border border-neon-purple/30 space-y-3 animate-fade-in">
                     <div>
                         <label className="text-xs font-bold text-white uppercase mb-1 block">Dirección Exacta</label>
                         <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Calle, Número, Depto, Comuna..."
                            className="w-full bg-dark-900 border border-white/20 rounded-lg p-3 text-white outline-none focus:border-neon-purple transition-colors"
                         />
                     </div>
                     
                     <p className="text-xs text-gray-400">Verificando cobertura en La Legua (Radio 5km)</p>
                     
                     {!canDeliver ? (
                         <button 
                            onClick={handleCheckLocation}
                            disabled={checkingLocation}
                            className="w-full py-3 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-neon-purple/30 transition-all"
                         >
                            {checkingLocation ? <Loader2 className="animate-spin" size={16}/> : <MapPin size={16} />}
                            {checkingLocation ? "Calculando distancia..." : "Validar Cobertura (GPS)"}
                         </button>
                     ) : (
                         <div className="flex items-center gap-2 text-neon-green font-bold text-sm bg-neon-green/10 p-2 rounded-lg border border-neon-green/30">
                             <CheckCircle size={16} /> ¡Llegamos! ({distance?.toFixed(1)} km)
                         </div>
                     )}
                 </div>
             )}
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
               <ShoppingCart size={14}/> Resumen
            </h3>
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.quantity}x {item.name}</span>
                  <span className="text-white font-mono">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                </div>
              ))}
              {isDelivery && canDeliver && (
                  <div className="flex justify-between text-sm pt-2 border-t border-white/5 text-neon-purple">
                    <span className="font-bold">Delivery Express</span>
                    <span className="font-mono">+${DELIVERY_FEE.toLocaleString('es-CL')}</span>
                  </div>
              )}
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-white font-bold">Total a Pagar</span>
              <span className="text-2xl font-black text-neon-green text-shadow-glow">${finalTotal.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">¿Cómo vas a pagar?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-neon-green bg-neon-green/10 text-white shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/30'}`}
              >
                <DollarSign size={28} className={paymentMethod === 'cash' ? "text-neon-green" : ""} />
                <span className="font-bold">Efectivo</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('transfer')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'transfer' ? 'border-neon-blue bg-neon-blue/10 text-white shadow-[0_0_15px_rgba(4,217,255,0.3)]' : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/30'}`}
              >
                <Wallet size={28} className={paymentMethod === 'transfer' ? "text-neon-blue" : ""} />
                <span className="font-bold">Transferencia</span>
              </button>
            </div>
          </div>

          {/* Cash Logic */}
          {paymentMethod === 'cash' && (
             <div className="bg-black/40 p-4 rounded-xl border border-neon-green/30 animate-fade-in">
                <label className="text-xs text-neon-green font-bold uppercase mb-2 block">¿Con cuánto pagas? (Para el vuelto)</label>
                <input 
                  type="number" 
                  placeholder="Ej: 20000" 
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full bg-dark-900 border border-white/20 rounded-lg p-3 text-white focus:border-neon-green outline-none font-mono text-lg"
                />
                {cashAmount && parseInt(cashAmount) < finalTotal && (
                  <p className="text-red-400 text-xs mt-2 font-bold">⚠️ Falta plata compadre</p>
                )}
                {cashAmount && parseInt(cashAmount) >= finalTotal && (
                  <p className="text-gray-300 text-xs mt-2">
                    Vuelto estimado: <span className="font-bold text-white">${(parseInt(cashAmount) - finalTotal).toLocaleString('es-CL')}</span>
                  </p>
                )}
             </div>
          )}

          {/* Transfer Logic */}
          {paymentMethod === 'transfer' && (
            <div className="animate-fade-in space-y-4">
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-300 space-y-2 font-mono relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><CreditCard size={48}/></div>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span>Banco:</span> <span className="text-white font-bold">{config.bankName}</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span>Cuenta:</span> <span className="text-white font-bold">{config.bankAccount}</span></p>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span>RUT:</span> <span className="text-white font-bold">{config.bankRut}</span></p>
                  <p className="flex justify-between"><span>Email:</span> <span className="text-white font-bold">{config.bankEmail}</span></p>
               </div>

               <div className="space-y-2">
                 <h4 className="text-xs font-bold text-neon-blue uppercase">Comprobante (Voucher)</h4>
                 {!voucherPreview ? (
                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 hover:border-neon-blue transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-neon-blue" />
                          <p className="text-xs text-gray-400"><span className="font-semibold text-white">Click para subir foto</span></p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleVoucherUpload} />
                   </label>
                 ) : (
                    <div className="relative rounded-xl overflow-hidden border border-neon-blue/50 bg-black">
                      <img src={voucherPreview} alt="Voucher" className="w-full h-40 object-contain opacity-80" />
                      
                      {isAnalyzing ? (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-neon-blue z-20 backdrop-blur-sm">
                          <Loader2 size={32} className="animate-spin mb-2" />
                          <span className="text-xs font-bold animate-pulse">IA Analizando y validando RUT...</span>
                        </div>
                      ) : voucherAnalysis ? (
                        <div className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center animate-fade-in overflow-y-auto">
                           <div className="flex items-center gap-2 text-neon-green mb-2 sticky top-0 bg-black/90 pb-2">
                              <CheckCircle size={16} /> <span className="text-xs font-bold uppercase">Análisis Completo</span>
                           </div>
                           <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-line">
                              {voucherAnalysis}
                           </p>
                           <button onClick={() => setVoucherPreview(null)} className="absolute top-2 right-2 text-gray-500 hover:text-white"><X size={16}/></button>
                        </div>
                      ) : null}
                    </div>
                 )}
               </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-black/40 rounded-b-3xl">
          <button 
            onClick={handleSendOrder}
            disabled={
                !paymentMethod || 
                (paymentMethod === 'cash' && (!cashAmount || parseInt(cashAmount) < finalTotal)) ||
                (isDelivery && !canDeliver) ||
                (isDelivery && canDeliver && !address.trim())
            }
            className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(188,19,254,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Phone size={20} className={paymentMethod ? "animate-pulse" : ""} />
            ENVIAR PEDIDO AHORA
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string, phone: string, isMaster: boolean } | null>(null);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false); // NEW MODAL STATE
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Persistence Logic ---
  const initApp = async () => {
    setIsLoading(true);
    const [loadedProducts, loadedConfig] = await Promise.all([
      loadProductsFromStorage(),
      loadSettingsFromStorage()
    ]);
    setProducts(loadedProducts);
    setStoreConfig(loadedConfig);
    setIsLoading(false);
  };

  useEffect(() => {
    initApp();
  }, []);

  const handleUpdateConfig = async (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    await saveSettingsToStorage(newConfig);
  };

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

  // --- Admin Logic ---
  const handleSaveProduct = async (product: Product) => {
    await saveProductToStorage(product);
    const updated = await loadProductsFromStorage();
    setProducts(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de la base de datos?')) {
      await deleteProductFromStorage(id);
      const updated = await loadProductsFromStorage();
      setProducts(updated);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAdminPanel(true);
  };
  
  const handleResetDb = () => {
    if(window.confirm("ADVERTENCIA: Esto borrará todos los cambios. ¿Continuar?")) {
      resetDatabase();
    }
  };

  const handleLogout = () => {
      if(isCloudActive && window.confirm("¿Quieres desconectarte también de la base de datos (Nube)?")) {
          clearFirebaseConfig();
      }
      setUser(null);
  }

  const handleAdminLoginAttempt = (pass: string) => {
    const correctPass = storeConfig.adminPassword || "1234";
    if (pass === correctPass) {
      setUser({ name: 'Master', phone: '00000000', isMaster: true });
      return true;
    }
    return false;
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
        onLogin={(name, phone) => setUser({ name, phone, isMaster: false })}
        onAdminLogin={handleAdminLoginAttempt}
        storeName={storeConfig.storeName}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-neon-green gap-4">
        <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest animate-pulse">CARGANDO FIESTA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 font-sans pb-20 animate-fade-in relative selection:bg-neon-purple selection:text-white">
      
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
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
              <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-none tracking-tight uppercase">
                {storeConfig.storeName}
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
              onClick={handleLogout}
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
              onClick={handleLogout}
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
              <button 
                onClick={() => {}} 
                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors cursor-default ${isCloudActive ? 'text-neon-green bg-green-900/30 border-green-500/30' : 'text-orange-400 bg-orange-900/30 border-orange-500/30'}`}
              >
                {isCloudActive ? <Cloud size={10} /> : <CloudOff size={10} />}
                {isCloudActive ? 'Nube Activada' : 'Modo Local'}
              </button>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar items-center">
              {/* BANCO ESTADO BUTTON */}
              <a 
                href="https://www.bancoestado.cl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-600/30 font-bold py-2 px-3 rounded-lg flex items-center gap-2 text-xs transition-all whitespace-nowrap"
              >
                <ExternalLink size={14} /> BancoEstado
              </a>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2 px-3 rounded-lg flex items-center gap-2 text-xs transition-all whitespace-nowrap"
              >
                <SettingsIcon size={14} /> Config Tienda
              </button>
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
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop" 
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
            <Phone size={16} /> WhatsApp: {storeConfig.whatsappNumber}
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
            
            <div className="p-6 bg-black/60 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-20 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-medium">Total a Pagar</span>
                <span className="text-white text-3xl font-black tracking-tight">${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <button 
                onClick={() => { setShowCart(false); setShowCheckoutModal(true); }}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                  ${cart.length > 0 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-[0_0_20px_rgba(0,255,0,0.3)]' 
                    : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'}`}
              >
                <DollarSign size={22} className={cart.length > 0 ? "animate-pulse" : ""} />
                IR A PAGAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          config={storeConfig} 
          onClose={() => setShowSettingsModal(false)} 
          onSave={handleUpdateConfig} 
        />
      )}

      {/* Checkout Modal (New Responsive Modal) */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cart={cart}
        total={cartTotal}
        config={storeConfig}
        user={user}
      />

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