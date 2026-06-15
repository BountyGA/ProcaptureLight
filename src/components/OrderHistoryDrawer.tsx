/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Clock, HelpCircle, ArrowUpRight, CheckCircle2, Truck, AlertCircle, ShoppingBag, Send } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export default function OrderHistoryDrawer({
  isOpen,
  onClose,
  orders
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
    // Re-verify checkout inquiry over WhatsApp
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* History Drawer Slider */}
      <div className="relative w-full max-w-md bg-[#050505]/95 border-l border-white/10 h-full flex flex-col justify-between shadow-2xl overflow-hidden z-10 backdrop-blur-md">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 w-full flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
              <Clock size={14} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-display">My Past Orders</h2>
              <span className="block text-[10px] font-mono text-white/40 mt-0.5">
                Saved locally on your workspace console device
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

        {/* Scrollable list of archived orders */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider font-display">No orders dispatched</h3>
                <p className="text-[11px] text-white/40 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                  Your past checkout history is empty. Once you select gear and submit via WhatsApp, those records appear here.
                </p>
              </div>
            </div>
          ) : (
            orders.map((o) => {
              return (
                <div 
                  key={o.id} 
                  className="p-4 rounded-xl border border-white/10 bg-white/2 space-y-3 hover:border-white/15 transition-all"
                >
                  {/* ID + Status badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div className="font-mono">
                      <span className="block text-[8px] uppercase text-white/30 tracking-wider">Reference Code</span>
                      <span className="text-xs font-extrabold text-white">{o.id}</span>
                    </div>

                    {/* Status block with custom styles */}
                    <div>
                      {o.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-green-500/20 bg-green-500/5 text-green-400">
                          <CheckCircle2 size={10} className="text-green-500" /> Delivered
                        </span>
                      ) : o.status === 'Shipped' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/5 text-blue-400">
                          <Truck size={10} className="text-blue-500" /> Dispatched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-yellow-500/20 bg-yellow-500/5 text-yellow-500">
                          <AlertCircle size={10} className="text-yellow-500" /> Preparing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer details/date line */}
                  <div className="flex justify-between items-center text-[10px] text-white/50 font-sans">
                    <span>{o.customerName || 'Anonymous Customer'}</span>
                    <span className="text-white/30 font-mono">{o.date}</span>
                  </div>

                  {/* Items Ordered List display */}
                  <div className="space-y-1.5 bg-black/60 p-2.5 rounded-lg border border-white/5">
                    {o.items.map((it, index) => (
                      <div key={index} className="flex justify-between items-start gap-3 text-[11px] font-sans">
                        <div className="min-w-0 flex-1">
                          <span className="text-white/80 font-medium font-sans block truncate">
                            {it.name}
                          </span>
                          <span className="text-[9px] text-white/30 font-mono block">
                            SN: {it.serialNumber} • {formatNaira(it.price)} unit
                          </span>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-yellow-500 font-mono font-medium block">
                            {it.quantity} units
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Overall Cost summary and WhatsApp re-send action */}
                  <div className="pt-1.5 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[8px] uppercase text-white/30 font-mono">Consolidated Cost</span>
                      <span className="text-sm font-bold text-yellow-500 font-mono">{formatNaira(o.totalCost)}</span>
                    </div>

                    <button
                      onClick={() => handleReInquire(o)}
                      className="px-3.5 py-2 rounded-lg text-[9px] font-bold text-white bg-green-600 hover:bg-green-500 transition-all font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
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
        <div className="p-6 border-t border-white/10 bg-black/50 text-center">
          <p className="text-[9px] text-white/30 font-semibold font-mono tracking-wider">
            LOCAL ENCRYPTED STORE DATABASE HISTORY SYSTEM
          </p>
        </div>

      </div>
    </div>
  );
}
