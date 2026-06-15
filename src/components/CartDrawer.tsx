/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Tag, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (customerName: string, notes: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = React.useState('');
  const [deliveryNotes, setDeliveryNotes] = React.useState('');

  const totalCost = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

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
    // Nigeria WhatsApp format using: 2348164203874
    const whatsappNumber = '2348164203874';
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

    // 3. Trigger Local Order Logger (for simulated Admin Panel history)
    onPlaceOrder(customerName || 'Anonymous Customer', deliveryNotes);

    // 4. Open in new window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Clear fields
    setCustomerName('');
    setDeliveryNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Cart Slider */}
      <div className="relative w-full max-w-sm bg-[#050505]/95 border-l border-white/10 h-full flex flex-col justify-between shadow-2xl overflow-hidden z-10 backdrop-blur-md">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 w-full flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
              <ShoppingBag size={14} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-display">Your Order Lines</h2>
              <span className="block text-[10px] font-mono text-white/40 mt-0.5">
                {cartItems.length} {cartItems.length === 1 ? 'model' : 'models'} selected
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-all cursor-pointer font-sans"
          >
            <X size={13} />
          </button>
        </div>

        {/* Scrollable list of items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider font-display">Your basket is empty</h3>
                <p className="text-[11px] text-white/40 mt-1.5 max-w-[220px] mx-auto leading-relaxed">
                  Browse authentic PROCAPTURE lights inventory and add equipment of choice.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-white/10 text-[10px] font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all uppercase tracking-wider cursor-pointer"
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
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all group"
                >
                  {/* Item Image */}
                  <div className="w-12 h-12 rounded bg-black border border-white/10 overflow-hidden shrink-0">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details Block */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-1.5 font-sans">
                      <h4 className="text-xs font-semibold text-white/90 leading-snug truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-white/30 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[9px] text-yellow-500/90 bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/20 flex items-center gap-0.5 font-semibold">
                        <Tag size={8} /> SN: {product.serialNumber}
                      </span>
                    </div>

                    {/* Pricing, Quantity Counter row */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-yellow-500 font-mono">
                        {formatNaira(product.price * quantity)}
                      </span>

                      {/* Quantity counter */}
                      <div className="flex items-center bg-[#050505] border border-white/15 rounded-md overflow-hidden shrink-0 scale-90">
                        <button
                          onClick={() => onUpdateQuantity(product, quantity - 1)}
                          className="px-2 py-1 hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus size={9} />
                        </button>
                        <span className="px-1.5 text-xs font-mono font-bold text-white min-w-[14px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product, quantity + 1)}
                          disabled={isMaxStock}
                          className="px-2 py-1 hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        >
                          <Plus size={9} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer and WhatsApp Checkout Form */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/60 space-y-4">
            
            {/* Summary Details */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-white/40 font-mono uppercase tracking-wider">
                <span>Selected Equipment</span>
                <span>{cartItems.length} Types</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-white/40 font-mono uppercase tracking-wider">
                <span>Shipping Fee</span>
                <span className="text-yellow-500 font-semibold">Verify on Chat</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 font-mono">Total Cost</span>
                <span className="text-xl font-bold text-yellow-500 font-mono">{formatNaira(totalCost)}</span>
              </div>
            </div>

            {/* Quick Customer Checkout Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-mono tracking-wider text-white/30 uppercase">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kolawole Davies"
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 outline-none rounded-lg text-white focus:border-yellow-500 placeholder-white/20 font-semibold font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-mono tracking-wider text-white/30 uppercase">
                  Delivery Point / Directions
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Dispatch to Gbagada Phase 2, Lagos."
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 outline-none rounded-lg text-white focus:border-yellow-500 placeholder-white/20 font-semibold resize-none h-12 font-sans"
                />
              </div>

              {/* Order Submission via WhatsApp */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-950/20 uppercase tracking-widest cursor-pointer group mt-3"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.193 1.389 4.896 1.39h.005c5.428 0 9.845-4.415 9.848-9.845.002-2.631-1.023-5.105-2.887-6.971-1.864-1.864-4.339-2.89-6.97-2.891-5.429 0-9.847 4.417-9.85 9.846-.001 1.745.459 3.447 1.332 4.931l-.995 3.637 3.721-.976zm10.155-7.013c-.279-.139-1.651-.814-1.907-.907-.256-.093-.442-.139-.628.139-.186.279-.721.907-.883 1.093-.163.186-.326.209-.605.07-1.12-.56-2.072-1.222-2.883-1.916-.811-.694-1.441-1.464-1.824-2.12-.163-.279-.017-.43.122-.569.125-.125.279-.326.419-.488.14-.163.186-.279.279-.465.093-.186.047-.349-.023-.488-.07-.139-.628-1.511-.861-2.07-.226-.546-.458-.472-.628-.48-.163-.008-.349-.01-.535-.01s-.488.07-.744.349c-.256.279-.977.954-.977 2.325s1.001 2.697 1.14 2.883c.14.186 1.97 3.007 4.773 4.215.667.287 1.188.459 1.595.587.671.213 1.281.183 1.763.111.538-.08 1.651-.674 1.884-1.326.233-.651.233-1.209.163-1.326-.07-.116-.256-.186-.535-.325z" />
                </svg>
                <span>Checkout via WhatsApp</span>
              </button>
            </form>

            <p className="text-[9px] text-center text-white/30 font-semibold font-mono tracking-wider italic">
              SECURE DIRECT BUSINESS ROUTING VIA PCL NETWORK
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
