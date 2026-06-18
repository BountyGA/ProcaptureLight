/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, Eye, Tag, AlertTriangle, Layers3 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
  cartQuantity: number;
  theme?: 'dark' | 'light';
  key?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  cartQuantity,
  theme = 'dark'
}: ProductCardProps) {
  const { name, serialNumber, price, quantityInStock, imageUrl, category, description } = product;

  // Stock status styling helpers
  const getStockBadge = () => {
    if (quantityInStock === 0) {
      return theme === 'light' ? (
        <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">
          <AlertTriangle size={10} /> Out of Stock
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] bg-red-950/40 border border-red-500/30 text-rose-450 px-2.5 py-0.5 rounded-full font-semibold">
          <AlertTriangle size={10} /> Out of Stock
        </span>
      );
    }
    if (quantityInStock <= 5) {
      return theme === 'light' ? (
        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 border border-amber-250 text-amber-700 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
          <AlertTriangle size={10} /> Low Stock: {quantityInStock}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-950/40 border border-amber-500/30 text-amber-500 px-2.5 py-0.5 rounded-full font-semibold animate-pulse">
          <AlertTriangle size={10} /> Low Stock: {quantityInStock} left
        </span>
      );
    }
    return theme === 'light' ? (
      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 border border-emerald-250 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
        ● In Stock ({quantityInStock})
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/30 border border-emerald-500/20 text-emerald-450 px-2.5 py-0.5 rounded-full font-semibold">
        ● In Stock ({quantityInStock})
      </span>
    );
  };

  const formattedPrice = `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)}`;

  const isOutOfStock = quantityInStock === 0 || cartQuantity >= quantityInStock;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-xl flex flex-col ${
      theme === 'light'
        ? 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-yellow-500/60'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/40'
    }`}>
      
      {/* Category / Featured Badge overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded ${
          theme === 'light' 
            ? 'text-zinc-650 bg-zinc-100 border border-zinc-200' 
            : 'text-white/60 bg-black/85 border border-white/10'
        }`}>
          {category}
        </span>
        {product.isFeatured && (
          <span className="text-[9px] font-display font-bold text-black bg-yellow-500 px-2.5 py-0.5 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.25)]">
            ★ Featured
          </span>
        )}
      </div>

      {/* Product Image Holder */}
      <div className={`aspect-[4/3] w-full overflow-hidden bg-black relative border-b ${
        theme === 'light' ? 'border-zinc-200' : 'border-white/10'
      }`}>
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-700 opacity-80 group-hover:opacity-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pb-2 gap-1.5">
          <button
            onClick={() => onViewDetails(product)}
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-black/90 text-white hover:bg-yellow-500 hover:text-black border border-white/10 transition-all shadow-md flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
          >
            <Eye size={11} /> Options
          </button>
        </div>
      </div>

      {/* Card Details Block */}
      <div className="p-3 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Serial Number & Stock Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className={`font-mono text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
              theme === 'light'
                ? 'text-yellow-605 bg-yellow-500/10 border border-yellow-500/20 shadow-xs'
                : 'text-yellow-500/90 bg-black/40 border border-white/5'
            }`}>
              SN: {serialNumber}
            </span>
            {getStockBadge()}
          </div>

          {/* Product Name & Description Preview */}
          <h3 
            className={`text-xs sm:text-sm md:text-base font-semibold tracking-tight leading-snug group-hover:text-yellow-600 transition-colors line-clamp-1 cursor-pointer font-sans ${
              theme === 'light' ? 'text-zinc-900 group-hover:text-yellow-650' : 'text-white'
            }`}
            onClick={() => onViewDetails(product)}
          >
            {name}
          </h3>
          <p className={`text-[11px] sm:text-xs line-clamp-2 leading-relaxed ${
            theme === 'light' ? 'text-zinc-650' : 'text-white/40'
          }`}>
            {description}
          </p>
        </div>

        {/* Action and Pricing Row */}
        <div className={`pt-2.5 mt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
          theme === 'light' ? 'border-zinc-200' : 'border-white/5'
        }`}>
          <div className="shrink-0 min-w-[70px]">
            <div className={`text-[8px] font-mono uppercase tracking-widest ${
              theme === 'light' ? 'text-zinc-400' : 'text-white/30'
            }`}>Rate</div>
            <div className={`text-sm sm:text-base md:text-lg font-bold font-mono tracking-tight leading-none mt-0.5 ${
              theme === 'light' ? 'text-zinc-900' : 'text-yellow-500'
            }`}>{formattedPrice}</div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`py-1.5 px-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              isOutOfStock
                ? theme === 'light'
                  ? 'bg-zinc-100 text-zinc-405 border border-zinc-200 cursor-not-allowed'
                  : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                : cartQuantity > 0
                ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:bg-yellow-405 font-display'
                : theme === 'light'
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:border-zinc-350 border border-zinc-200'
                : 'bg-white/10 hover:bg-white/20 text-white hover:border-white/20 border border-white/10'
            }`}
          >
            <ShoppingCart size={10} />
            {cartQuantity > 0 ? (
              <span>({cartQuantity})</span>
            ) : isOutOfStock ? (
              <span>Out</span>
            ) : (
              <span className="hidden xs:inline">Add</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
