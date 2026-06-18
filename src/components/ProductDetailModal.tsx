/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShoppingCart, ShieldCheck, Truck, Tag, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  cartQuantity: number;
  onUpdateCartQuantity?: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  cartQuantity,
  onUpdateCartQuantity
}: ProductDetailModalProps) {
  if (!product) return null;

  const { name, serialNumber, price, quantityInStock, imageUrl, category, description, features } = product;

  const formattedPrice = `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)}`;

  const isOutOfStock = quantityInStock === 0;

  const handleQtyAdjust = (delta: number) => {
    if (!onUpdateCartQuantity) return;
    const targetQ = cartQuantity + delta;
    if (targetQ >= 0 && targetQ <= quantityInStock) {
      onUpdateCartQuantity(product, targetQ);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-black/95 p-0 shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none backdrop-blur-md">
        
        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white bg-black/80 border border-white/10 rounded-lg z-20 transition-all cursor-pointer"
        >
          <X size={15} />
        </button>

        {/* Product Visual Side */}
        <div className="w-full md:w-1/2 bg-black min-h-[250px] relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover aspect-[4/3] md:aspect-auto opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-yellow-500 bg-black/80 border border-white/10 px-3 py-1 rounded">
              {category}
            </span>
          </div>
        </div>

        {/* Product Specs Side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
          <div className="space-y-4">
            {/* Tag / SN */}
            <div>
              <span className="inline-flex items-center gap-1 font-mono text-[9px] text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                <Tag size={9} /> Authenticity SN: {serialNumber}
              </span>
            </div>

            {/* Title / Price */}
            <div className="space-y-1.5">
              <h2 className="text-xl md:text-2xl font-light text-white tracking-tight leading-tight uppercase font-display">{name}</h2>
              <div className="text-2xl font-bold text-yellow-500 tracking-tight font-mono">{formattedPrice}</div>
            </div>

            {/* General Specs Block */}
            <div className="space-y-2 pt-3.5 border-t border-white/10">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-bold">Product Summary</span>
              <p className="text-xs text-white/60 leading-relaxed font-sans">{description}</p>
            </div>

            {/* Key Features Bullet points */}
            {features && features.length > 0 && (
              <div className="space-y-2 pt-3.5 border-t border-white/10">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-bold">Technical Specs</span>
                <ul className="space-y-1.5">
                  {features.map((feature, i) => (
                    <li key={i} className="text-xs text-white/80 flex items-start gap-2 font-sans">
                      <span className="text-yellow-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-2.5 rounded-xl bg-white/2 border border-white/10 flex items-center gap-2">
                <ShieldCheck className="text-green-500 shrink-0" size={15} />
                <div>
                  <span className="block text-[10px] font-semibold text-white/80 uppercase tracking-wider font-display">12 Mo. Warranty</span>
                  <span className="block text-[8px] text-white/30 font-mono">100% Guaranteed</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/2 border border-white/10 flex items-center gap-2">
                <Truck className="text-yellow-500 shrink-0" size={15} />
                <div>
                  <span className="block text-[10px] font-semibold text-white/80 uppercase tracking-wider font-display">Express Delivery</span>
                  <span className="block text-[8px] text-white/30 font-mono">Nationwide Courier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Quantity Adjuster & Add actions */}
          <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-4">
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-black border border-white/10 rounded-xl overflow-hidden scale-95">
                  <button
                    onClick={() => handleQtyAdjust(-1)}
                    className="p-2.5 hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="px-4 text-xs font-bold text-center text-white min-w-[24px] font-mono">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => handleQtyAdjust(1)}
                    disabled={cartQuantity >= quantityInStock}
                    className="p-2.5 hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <div className="text-[10px] font-mono text-yellow-500 font-bold uppercase tracking-wider">In Cart</div>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isOutOfStock
                    ? 'bg-neutral-900 text-white/30 border border-white/5 cursor-not-allowed'
                    : 'bg-yellow-500 text-black hover:bg-yellow-400 font-bold shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                }`}
              >
                <ShoppingCart size={13} />
                {isOutOfStock ? 'Sold Out' : 'Add to Order List'}
              </button>
            )}
            
            {/* Quick stock feedback */}
            <div className="text-right shrink-0">
              <span className="block text-[8px] font-mono uppercase text-white/40 tracking-wider">Inventory</span>
              <span className={`block text-xs font-bold font-mono ${isOutOfStock ? 'text-red-500' : 'text-yellow-500'}`}>
                {isOutOfStock ? 'Unavailable' : `${quantityInStock} Units`}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
