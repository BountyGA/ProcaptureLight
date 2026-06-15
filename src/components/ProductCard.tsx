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
  key?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  cartQuantity
}: ProductCardProps) {
  const { name, serialNumber, price, quantityInStock, imageUrl, category, description } = product;

  // Stock status styling helpers
  const getStockBadge = () => {
    if (quantityInStock === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-red-950/40 border border-red-500/30 text-rose-450 px-2.5 py-0.5 rounded-full font-semibold">
          <AlertTriangle size={10} /> Out of Stock
        </span>
      );
    }
    if (quantityInStock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-950/40 border border-amber-500/30 text-amber-500 px-2.5 py-0.5 rounded-full font-semibold animate-pulse">
          <AlertTriangle size={10} /> Low Stock: {quantityInStock} left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/30 border border-emerald-500/20 text-emerald-450 px-2.5 py-0.5 rounded-full font-semibold">
        ● In Stock ({quantityInStock})
      </span>
    );
  };

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(price);

  const isOutOfStock = quantityInStock === 0 || cartQuantity >= quantityInStock;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 w-full flex flex-col hover:border-yellow-500/40 transition-all duration-300 shadow-xl">
      
      {/* Category / Featured Badge overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/60 bg-black/85 border border-white/10 px-2.5 py-0.5 rounded">
          {category}
        </span>
        {product.isFeatured && (
          <span className="text-[9px] font-display font-bold text-black bg-yellow-500 px-2.5 py-0.5 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.25)]">
            ★ Featured
          </span>
        )}
      </div>

      {/* Product Image Holder */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-black relative border-b border-white/10">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-700 opacity-80 group-hover:opacity-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pb-2 gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="px-3.5 py-2 rounded-lg bg-black/90 text-white hover:bg-yellow-500 hover:text-black border border-white/10 transition-all shadow-md flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
          >
            <Eye size={12} /> Quick Options
          </button>
        </div>
      </div>

      {/* Card Details Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Serial Number & Stock Status Row */}
          <div className="flex items-center justify-between gap-1.5">
            <span className="font-mono text-[9px] text-yellow-500/90 bg-black/40 border border-white/5 px-2 py-0.5 rounded text-white/50 font-semibold uppercase tracking-wider">
              SN: {serialNumber}
            </span>
            {getStockBadge()}
          </div>

          {/* Product Name & Description Preview */}
          <h3 
            className="text-base font-semibold text-white tracking-tight leading-snug group-hover:text-yellow-500 transition-colors line-clamp-1 cursor-pointer font-sans"
            onClick={() => onViewDetails(product)}
          >
            {name}
          </h3>
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action and Pricing Row */}
        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2.5">
          <div>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Rate</div>
            <div className="text-lg font-bold text-yellow-500 font-mono tracking-tight">{formattedPrice}</div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`py-2 px-3.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              isOutOfStock
                ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                : cartQuantity > 0
                ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:bg-yellow-405 font-display'
                : 'bg-white/10 hover:bg-white/20 text-white hover:border-white/20 border border-white/10'
            }`}
          >
            <ShoppingCart size={11} />
            {cartQuantity > 0 ? (
              <span>Added ({cartQuantity})</span>
            ) : isOutOfStock ? (
              <span>Fully Checked Out</span>
            ) : (
              <span>Add to List</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
