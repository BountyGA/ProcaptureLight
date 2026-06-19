/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Tag, Plus, Minus, ShoppingBag, CheckCircle, AlertTriangle } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (customerName: string, notes: string) => void;
  theme?: 'dark' | 'light';
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  theme = 'dark'
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = React.useState('');
  const [deliveryNotes, setDeliveryNotes] = React.useState('');

  // Toast Notification State
  const [toast, setToast] = React.useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'info' | 'error' | 'warning';
  }>({
    visible: false,
    message: '',
    type: 'info'
  });

  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ visible: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const totalCost = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatNaira = (amount: number) => {
    return `\u20A6${new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)}`;
  };

  // Local wrapper actions with feedback toasts
  const handleRemove = (product: Product) => {
    onRemoveItem(product.id);
    showToast(`Removed "${product.name}" from basket`, 'warning');
  };

  const handleQtyChange = (product: Product, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(product);
      return;
    }
    if (newQty > product.quantityInStock) {
      showToast(`Cannot exceed stock limit of ${product.quantityInStock} units`, 'error');
      return;
    }
    onUpdateQuantity(product, newQty);
    const direction = newQty > (cartItems.find(i => i.product.id === product.id)?.quantity || 0) ? 'Increased' : 'Decreased';
    showToast(`${direction} "${product.name}" to ${newQty} unit${newQty > 1 ? 's' : ''}`, 'success');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!customerName.trim()) {
      showToast('Please type your full name first', 'error');
      return;
    }

    showToast('Launching secure WhatsApp checkout routing...', 'success');

    // 1. Build beautiful WhatsApp Text
    const dateStr = new Date().toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const orderRef = `PCL-${Math.floor(100000 + Math.random() * 900000)}`;

    let message = `⚡ *PROCAPTURE LIGHTS ORDER REQUEST* ⚡\n\n`;
    message += `*Date:* ${dateStr}\n`;
    message += `*Reference:* ${orderRef}\n`;
    if (customerName) {
      message += `*Customer:* ${customerName}\n`;
    }
    if (deliveryNotes) {
      message += `*Notes:* ${deliveryNotes}\n`;
    }
    message += `\n------------------------------------------\n`;

    cartItems.forEach((item, index) => {
      const subtotal = item.product.price * item.quantity;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • *Serial No:* ${item.product.serialNumber}\n`;
      message += `   • *Quantity:* ${item.quantity} units\n`;
      message += `   • *Unit Price:* ${formatNaira(item.product.price)}\n`;
      message += `   • *Subtotal:* ${formatNaira(subtotal)}\n`;
      message += `------------------------------------------\n`;
    });

    message += `\n💵 *TOTAL COMPILING COST: ${formatNaira(totalCost)}*\n\n`;
    message += `Please verify item inventory availability and send payment / bank transfer credentials. Thank you!`;

    // 2. Encode and open WhatsApp
    const whatsappNumber = '2348164203874';
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

    // 3. Trigger Local Order Logger (for simulated Admin Panel history)
    onPlaceOrder(customerName || 'Anonymous Customer', deliveryNotes);

    // 4. Open in new window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Clear fields after 1 second delay
    setTimeout(() => {
      setCustomerName('');
      setDeliveryNotes('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 sm:bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 select-none overflow-hidden">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Cart Slider Styled with Layered Outer Margin Layout */}
      <div className={`relative w-full max-w-md sm:max-w-lg h-full flex flex-col justify-between rounded-xl sm:rounded-2xl border shadow-3xl overflow-hidden z-10 backdrop-blur-md transition-all duration-300 ${
        theme === 'light'
          ? 'bg-zinc-50 border-zinc-200/85 text-zinc-900 shadow-zinc-400/20'
          : 'bg-[#080808]/95 border-white/10 text-white shadow-black/80'
      }`}>
        
        {/* Drawer Header (Layer 1) */}
        <div className={`p-4 sm:p-5 border-b w-full flex items-center justify-between ${
          theme === 'light' ? 'border-zinc-200/80 bg-white/60' : 'border-white/10 bg-black/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${
              theme === 'light'
                ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-600'
                : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500'
            }`}>
              <ShoppingBag size={14} />
            </div>
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider font-display ${
                theme === 'light' ? 'text-zinc-900' : 'text-white'
              }`}>Your Order Lines</h2>
              <span className={`block text-[10px] font-mono mt-0.5 ${
                theme === 'light' ? 'text-zinc-500' : 'text-white/40'
              }`}>
                {cartItems.length} {cartItems.length === 1 ? 'model' : 'models'} selected
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              theme === 'light'
                ? 'text-zinc-500 hover:text-black hover:bg-zinc-100 border-zinc-250 bg-white shadow-xs'
                : 'text-white/60 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <X size={13} />
          </button>
        </div>

        {/* Popunder Toast Toast Alert Overlay (Positioned elegantly floating right under the header) */}
        {toast.visible && (
          <div className="absolute top-[80px] left-4 right-4 z-50 animate-bounce-subtle pointer-events-auto">
            <div className={`p-3 rounded-xl border flex items-center gap-2.5 shadow-xl transition-all duration-200 ${
              toast.type === 'success'
                ? theme === 'light'
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                  : 'bg-emerald-950/90 border-emerald-500/20 text-emerald-400'
                : toast.type === 'warning'
                ? theme === 'light'
                  ? 'bg-rose-50 border-rose-220 text-rose-700'
                  : 'bg-rose-950/95 border-rose-500/20 text-rose-350'
                : toast.type === 'error'
                ? theme === 'light'
                  ? 'bg-red-50 border-red-220 text-red-705'
                  : 'bg-red-950/95 border-red-500/20 text-rose-350'
                : theme === 'light'
                ? 'bg-white border-zinc-250 text-zinc-900 shadow-sm'
                : 'bg-[#121212] border-white/10 text-white shadow-md'
            }`}>
              <div className="shrink-0 flex items-center justify-center">
                {toast.type === 'success' && <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />}
                {toast.type === 'warning' && <Trash2 className="w-4 h-4 text-rose-500" />}
                {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {toast.type === 'info' && <ShoppingBag className="w-4 h-4 text-yellow-500" />}
              </div>
              <p className="text-[10px] sm:text-xs font-bold leading-normal flex-1">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                className={`text-[9px] font-mono hover:underline uppercase tracking-wider shrink-0 font-bold ml-1 ${
                  theme === 'light' ? 'text-zinc-500 hover:text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Scrollable List of Basket Items (Presents nested card layouts for maximum aesthetic layer feel) */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 ${
          theme === 'light' ? 'bg-zinc-50' : 'bg-transparent'
        }`}>
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className={`w-14 h-14 rounded-full border flex items-center justify-center ${
                theme === 'light' ? 'bg-white border-zinc-200 text-zinc-300' : 'bg-white/5 border-white/10 text-white/20'
              }`}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider font-display ${
                  theme === 'light' ? 'text-zinc-800' : 'text-white/80'
                }`}>Your list is empty</h3>
                <p className={`text-[11px] mt-1.5 max-w-[220px] mx-auto leading-relaxed ${
                  theme === 'light' ? 'text-zinc-500' : 'text-white/40'
                }`}>
                  Browse authentic PROCAPTURE lights catalog and tap Add directly on the grids.
                </p>
              </div>
              <button
                onClick={onClose}
                className={`px-4 py-2 border text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-zinc-700 hover:text-black border-zinc-250 hover:bg-zinc-100'
                    : 'bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Return to Shop
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const { product, quantity } = item;
              const isMaxStock = quantity >= product.quantityInStock;
              return (
                <div 
                  key={product.id} 
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 group ${
                    theme === 'light'
                      ? 'border-zinc-200 bg-white shadow-xs hover:border-zinc-300'
                      : 'border-white/5 bg-[#101010]/50 hover:bg-[#121212] hover:border-white/10'
                  }`}
                >
                  {/* Item Image */}
                  <div className={`w-12 h-12 rounded border overflow-hidden shrink-0 ${
                    theme === 'light' ? 'border-zinc-200 bg-zinc-105' : 'border-white/10 bg-black'
                  }`}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-305"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details Block */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1.5 font-sans">
                      <h4 className={`text-xs font-semibold leading-normal truncate ${
                        theme === 'light' ? 'text-zinc-900 font-bold' : 'text-white/90'
                      }`}>
                        {product.name}
                      </h4>
                      <button
                        onClick={() => handleRemove(product)}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          theme === 'light'
                            ? 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50'
                            : 'text-white/30 hover:text-red-400 hover:bg-white/5'
                        }`}
                        title="Delete item"
                      >
                        <Trash2 size={11.5} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 font-semibold ${
                        theme === 'light'
                          ? 'text-yellow-700 bg-yellow-500/10 border-yellow-500/20'
                          : 'text-yellow-500/90 bg-yellow-500/5 border-yellow-500/20'
                      }`}>
                        <Tag size={8} /> SN: {product.serialNumber}
                      </span>
                    </div>

                    {/* Pricing, Quantity Counter row */}
                    <div className="pt-1.5 flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold font-mono ${
                        theme === 'light' ? 'text-zinc-900 font-extrabold' : 'text-yellow-500 font-bold'
                      }`}>
                        {formatNaira(product.price * quantity)}
                      </span>

                      {/* Quantity counter */}
                      <div className={`flex items-center border rounded-md overflow-hidden shrink-0 scale-90 ${
                        theme === 'light' ? 'bg-zinc-50 border-zinc-250' : 'bg-[#050505] border-white/15'
                      }`}>
                        <button
                          onClick={() => handleQtyChange(product, quantity - 1)}
                          className={`px-2 py-1 transition-colors cursor-pointer ${
                            theme === 'light' 
                              ? 'hover:bg-zinc-150 text-zinc-500 hover:text-zinc-900' 
                              : 'hover:bg-white/5 text-white/50 hover:text-white'
                          }`}
                        >
                          <Minus size={9.5} />
                        </button>
                        <span className={`px-1.5 text-xs font-mono font-bold min-w-[14px] text-center ${
                          theme === 'light' ? 'text-zinc-900 font-extrabold' : 'text-white'
                        }`}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product, quantity + 1)}
                          disabled={isMaxStock}
                          className={`px-2 py-1 transition-colors cursor-pointer disabled:opacity-20 disabled:hover:bg-transparent ${
                            theme === 'light' 
                              ? 'hover:bg-zinc-150 text-zinc-500 hover:text-zinc-900' 
                              : 'hover:bg-white/5 text-white/50 hover:text-white'
                          }`}
                        >
                          <Plus size={9.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer and WhatsApp Checkout (Layer 2 - structured float cards layout) */}
        {cartItems.length > 0 && (
          <div className={`p-4 sm:p-5 border-t space-y-4 shadow-2xl ${
            theme === 'light'
              ? 'border-zinc-200 bg-white shadow-zinc-300/10'
              : 'border-white/10 bg-black/80'
          }`}>
            
            {/* Summary Details */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              theme === 'light' ? 'bg-zinc-50/50 border-zinc-200' : 'bg-white/2 border-white/5'
            }`}>
              <div className="flex justify-between items-center text-[9.5px] font-mono uppercase tracking-wider text-zinc-400">
                <span>Selected Equipment</span>
                <span className={theme === 'light' ? 'text-zinc-900 font-bold' : 'text-white'}>{cartItems.length} Types</span>
              </div>
              <div className="flex justify-between items-center text-[9.5px] font-mono uppercase tracking-wider text-zinc-400">
                <span>Dispatch Cost</span>
                <span className="text-yellow-600 font-bold">Verify on Chat</span>
              </div>
              <div className={`flex justify-between items-center pt-2.5 border-t ${
                theme === 'light' ? 'border-zinc-200' : 'border-white/5'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">Consolidated Total</span>
                <span className={`text-lg sm:text-xl font-bold font-mono ${
                  theme === 'light' ? 'text-zinc-950 font-black' : 'text-yellow-500'
                }`}>{formatNaira(totalCost)}</span>
              </div>
            </div>

            {/* Quick Customer Checkout Form (Layered Card styling) */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className={`block text-[9px] font-mono tracking-wider uppercase font-semibold ${
                  theme === 'light' ? 'text-zinc-500' : 'text-white/30'
                }`}>
                  Your Name / Representative
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kolawole Davies"
                  className={`w-full px-3 py-2 text-xs outline-none rounded-lg font-semibold font-sans transition-all ${
                    theme === 'light'
                      ? 'bg-zinc-50 border border-zinc-250 text-zinc-900 focus:border-yellow-550 focus:bg-white placeholder-zinc-400'
                      : 'bg-white/5 border border-white/10 text-white focus:border-yellow-500 placeholder-white/20'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block text-[9px] font-mono tracking-wider uppercase font-semibold ${
                  theme === 'light' ? 'text-zinc-500' : 'text-white/30'
                }`}>
                  Pickup / Delivery Info
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Dispatch to Gbagada Phase 2, Lagos."
                  className={`w-full px-3 py-2 text-xs outline-none rounded-lg font-semibold resize-none h-12 font-sans transition-all ${
                    theme === 'light'
                      ? 'bg-zinc-50 border border-zinc-250 text-zinc-900 focus:border-yellow-550 focus:bg-white placeholder-zinc-400'
                      : 'bg-white/5 border border-white/10 text-white focus:border-yellow-500 placeholder-white/20'
                  }`}
                />
              </div>

              {/* Order Submission via WhatsApp */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-green-600 hover:bg-green-500 hover:scale-[0.99] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-950/20 uppercase tracking-widest cursor-pointer group mt-4 h-11"
              >
                <svg className="w-4.5 h-4.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.193 1.389 4.896 1.39h.005c5.428 0 9.845-4.415 9.848-9.845.002-2.631-1.023-5.105-2.887-6.971-1.864-1.864-4.339-2.89-6.97-2.891-5.429 0-9.847 4.417-9.85 9.846-.001 1.745.459 3.447 1.332 4.931l-.995 3.637 3.721-.976zm10.155-7.013c-.279-.139-1.651-.814-1.907-.907-.256-.093-.442-.139-.628.139-.186.279-.721.907-.883 1.093-.163.186-.326.209-.605.07-1.12-.56-2.072-1.222-2.883-1.916-.811-.694-1.441-1.464-1.824-2.12-.163-.279-.017-.43.122-.569.125-.125.279-.326.419-.488.14-.163.186-.279.279-.465.093-.186.047-.349-.023-.488-.07-.139-.628-1.511-.861-2.07-.226-.546-.458-.472-.628-.48-.163-.008-.349-.01-.535-.01s-.488.07-.744.349c-.256.279-.977.954-.977 2.325s1.001 2.697 1.14 2.883c.14.186 1.97 3.007 4.773 4.215.667.287 1.188.459 1.595.587.671.213 1.281.183 1.763.111.538-.08 1.651-.674 1.884-1.326.233-.651.233-1.209.163-1.326-.07-.116-.256-.186-.535-.325z" />
                </svg>
                <span>Checkout via WhatsApp</span>
              </button>
            </form>

            <p className={`text-[9px] text-center font-bold font-mono tracking-wider italic ${
              theme === 'light' ? 'text-zinc-400' : 'text-white/30'
            }`}>
              SECURE DIRECT BUSINESS ROUTING VIA PCL NETWORK
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
