/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartProps {
  cartItems: CartItem[];
  onCartToggle: () => void;
}

export default function FloatingCart({ cartItems, onCartToggle }: FloatingCartProps) {
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalCount === 0) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formattedTotal = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(totalPrice);

  return (
    <div 
      onClick={onCartToggle}
      className="fixed bottom-14 left-4 right-4 md:left-auto md:right-8 md:w-[380px] z-40 bg-zinc-950/90 border border-yellow-500/30 backdrop-blur-md rounded-2xl p-3.5 pr-2.5 shadow-[0_4px_30px_rgba(234,179,8,0.15)] flex items-center justify-between cursor-pointer group hover:bg-black hover:border-yellow-505 transition-all animate-bounce"
      id="persistent-floating-cart-bar"
    >
      <div className="flex items-center gap-3">
        {/* Animated Cart circle */}
        <div className="relative w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          <ShoppingCart size={16} />
          {/* Pulsing indicator of total count */}
          <span className="absolute -top-1.5 -right-1.5 inline-flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-black text-black leading-none font-mono">
            {totalCount}
          </span>
        </div>

        {/* Price & Items briefing */}
        <div>
          <span className="block text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest leading-none">
            Selected Studio Gear
          </span>
          <span className="text-sm font-extrabold text-yellow-500 font-mono mt-0.5 block leading-none">
            {formattedTotal}
          </span>
          <span className="text-[10px] text-white/50 block font-light font-sans mt-0.5">
            {totalCount} {totalCount === 1 ? 'item' : 'items'} in order list
          </span>
        </div>
      </div>

      {/* Direct Call to Action button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent duplicate fire
          onCartToggle();
        }}
        className="py-2.5 px-4 rounded-xl text-xs font-bold text-black bg-yellow-500 group-hover:bg-yellow-400 font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
      >
        <span>View Order</span>
        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
