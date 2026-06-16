/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Clock, ArrowUpRight, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  theme?: 'dark' | 'light';
}

export default function OrderHistoryDrawer({
  isOpen,
  onClose,
  orders,
  theme = 'dark'
}: OrderHistoryDrawerProps) {
  if (!isOpen) return null;

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleReInquire = (order: Order) => {
    const dateStr = order.date;
    const orderRef = order.id;
    let message = `⚡ *PROCAPTURE LIGHT RE-INQUIRY* ⚡\n\n`;
    message += `*Checking up on Order:* ${orderRef}\n`;
    message += `*Date of Placement:* ${dateStr}\n`;
    if (order.customerName) {
      message += `*Customer:* ${order.customerName}\n`;
    }
    message += `*Current Status:* ${order.status}\n`;
    message += `\n------------------------------------------\n`;

    order.items.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      message += `${index + 1}. *${item.name}*\n`;
      message += `   • *Serial No:* ${item.serialNumber}\n`;
      message += `   • *Quantity:* ${item.quantity} units\n`;
      message += `   • *Subtotal:* ${formatNaira(subtotal)}\n`;
      message += `------------------------------------------\n`;
    });

    message += `\n💵 *TOTAL VALUE: ${formatNaira(order.totalCost)}*\n\n`;
    message += `Hello! I am following up on my previous purchase order request. Let me know the dispatch status. Thanks!`;

    const whatsappNumber = '2348164203874';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 sm:bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 select-none overflow-hidden">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* History Drawer Slider - Layered Aesthetic Panel Layout */}
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
                ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-605'
                : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500'
            }`}>
              <Clock size={14} />
            </div>
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-wider font-display ${
                theme === 'light' ? 'text-zinc-900' : 'text-white'
              }`}>My Past Orders</h2>
              <span className={`block text-[10px] font-mono mt-0.5 ${
                theme === 'light' ? 'text-zinc-500' : 'text-white/40'
              }`}>
                Saved locally on your console device workspace
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

        {/* Scrollable list of archived orders */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 ${
          theme === 'light' ? 'bg-zinc-50' : 'bg-transparent'
        }`}>
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className={`w-14 h-14 rounded-full border flex items-center justify-center ${
                theme === 'light' ? 'bg-white border-zinc-200 text-zinc-300' : 'bg-white/5 border border-white/10 text-white/20'
              }`}>
                <Clock size={22} />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider font-display ${
                  theme === 'light' ? 'text-zinc-800' : 'text-white/80'
                }`}>No orders found</h3>
                <p className={`text-[11px] mt-1.5 max-w-[260px] mx-auto leading-relaxed ${
                  theme === 'light' ? 'text-zinc-500' : 'text-white/40'
                }`}>
                  Your past dispatch logs are currently empty. Once you compile items and send details via WhatsApp, those records appear here.
                </p>
              </div>
            </div>
          ) : (
            orders.map((o) => {
              return (
                <div 
                  key={o.id} 
                  className={`p-4 rounded-xl border space-y-3.5 transition-all duration-200 ${
                    theme === 'light'
                      ? 'border-zinc-200 bg-white shadow-xs'
                      : 'border-white/10 bg-[#101010]/50 hover:bg-[#121212] hover:border-white/15'
                  }`}
                >
                  {/* ID + Status badge */}
                  <div className={`flex items-center justify-between gap-2 border-b pb-2.5 ${
                    theme === 'light' ? 'border-zinc-100' : 'border-white/5'
                  }`}>
                    <div className="font-mono">
                      <span className={`block text-[8px] uppercase tracking-wider ${
                        theme === 'light' ? 'text-zinc-400' : 'text-white/30'
                      }`}>Reference Code</span>
                      <span className={`text-xs font-extrabold ${
                        theme === 'light' ? 'text-zinc-900' : 'text-white'
                      }`}>{o.id}</span>
                    </div>

                    {/* Status block with custom styles */}
                    <div>
                      {o.status === 'Completed' ? (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          theme === 'light'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-green-500/20 bg-green-500/5 text-green-400'
                        }`}>
                          <CheckCircle2 size={10} /> Delivered
                        </span>
                      ) : o.status === 'Shipped' ? (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          theme === 'light'
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-blue-500/20 bg-blue-500/5 text-blue-400'
                        }`}>
                          <Truck size={10} /> Dispatched
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          theme === 'light'
                            ? 'border-yellow-250 bg-yellow-500/10 text-yellow-750'
                            : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500'
                        }`}>
                          <AlertCircle size={10} /> Preparing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer details/date line */}
                  <div className={`flex justify-between items-center text-[10px] font-semibold font-sans ${
                    theme === 'light' ? 'text-zinc-650' : 'text-white/50'
                  }`}>
                    <span>{o.customerName || 'Anonymous Customer'}</span>
                    <span className={theme === 'light' ? 'text-zinc-400 font-mono' : 'text-white/30 font-mono'}>{o.date}</span>
                  </div>

                  {/* Items Ordered List display */}
                  <div className={`space-y-2 p-3 rounded-lg border ${
                    theme === 'light'
                      ? 'bg-zinc-50 border-zinc-200'
                      : 'bg-black/60 border-white/5'
                  }`}>
                    {o.items.map((it, index) => (
                      <div key={index} className="flex justify-between items-start gap-3 text-[11px] font-sans">
                        <div className="min-w-0 flex-1 whitespace-nowrap overflow-hidden">
                          <span className={`font-semibold block truncate ${
                            theme === 'light' ? 'text-zinc-800' : 'text-white/80'
                          }`}>
                            {it.name}
                          </span>
                          <span className={`text-[9.5px] font-mono block ${
                            theme === 'light' ? 'text-zinc-500' : 'text-white/30'
                          }`}>
                            SN: {it.serialNumber} • {formatNaira(it.price)} unit
                          </span>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className={`font-mono font-bold block ${
                            theme === 'light' ? 'text-zinc-900' : 'text-yellow-500'
                          }`}>
                            {it.quantity} unit{it.quantity > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Overall Cost summary and WhatsApp re-send action */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <div>
                      <span className={`block text-[8px] uppercase font-mono ${
                        theme === 'light' ? 'text-zinc-405' : 'text-white/30'
                      }`}>Consolidated cost</span>
                      <span className={`text-sm font-bold font-mono ${
                        theme === 'light' ? 'text-zinc-950 font-black' : 'text-yellow-500'
                      }`}>{formatNaira(o.totalCost)}</span>
                    </div>

                    <button
                      onClick={() => handleReInquire(o)}
                      className={`px-3 py-2 rounded-lg text-[9px] font-bold text-white bg-green-600 hover:bg-green-500 hover:scale-[0.99] active:scale-[0.98] transition-all font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer`}
                    >
                      <span>Inquire Chat</span>
                      <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info box */}
        <div className={`p-4 sm:p-5 border-t text-center ${
          theme === 'light' ? 'border-zinc-200 bg-white' : 'border-white/10 bg-black/40'
        }`}>
          <p className={`text-[9px] font-bold font-mono tracking-wider uppercase ${
            theme === 'light' ? 'text-zinc-400' : 'text-white/30'
          }`}>
            LOCAL DEVICE CONSOLE STORE HISTORY SYSTEM
          </p>
        </div>

      </div>
    </div>
  );
}
