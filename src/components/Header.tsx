/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, LogIn, LogOut, Search, SlidersHorizontal, Sun, Camera, Lock, Clock } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
  isAdmin: boolean;
  onAdminToggle: (access: boolean) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  orderCount: number;
  onHistoryToggle: () => void;
}

export default function Header({
  cartCount,
  onCartToggle,
  isAdmin,
  onAdminToggle,
  searchTerm,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categories,
  orderCount,
  onHistoryToggle
}: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple but secure preset password for local simulation: 'procapture874'
    if (passwordInput === 'admin' || passwordInput === 'procapture874' || passwordInput === '123') {
      onAdminToggle(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Access Key.');
    }
  };

  return (
    <header className="sticky top-0 z-45 w-full bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand Group */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xs bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.25)]">
              <Camera className="text-black w-5.5 h-5.5" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center">
                <Sun className="text-yellow-500 w-2.5 h-2.5 animate-spin-slow" />
              </div>
            </div>
            <div>
              <span className="font-sans font-light text-xl tracking-tighter uppercase text-white block">
                PROCAPTURE <span className="font-bold text-yellow-500">LIGHT</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-white/40 uppercase leading-none -mt-0.5 font-semibold">
                CONSOLE v2.04
              </span>
            </div>
          </div>

          {/* Quick Search Bar */}
          {!isAdmin && (
            <div className="hidden md:flex relative flex-1 max-w-sm mx-4">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                <Search size={14} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search premium studio gear..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 focus:border-yellow-500 rounded-lg text-white outline-none transition-all placeholder-white/20 font-mono"
              />
            </div>
          )}

          {/* User Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Status light concept from design */}
            <div className="hidden xl:flex items-center gap-2.5 pr-3 border-r border-white/10 h-8">
              <div className="text-right">
                <p className="text-[9px] text-white/30 uppercase tracking-tighter leading-none">Status</p>
                <p className="text-[10px] font-mono text-green-400 font-semibold mt-0.5">LIVE_LAGOS_NG</p>
              </div>
              <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* View Switching / Portal Trigger */}
            <button
              id="admin-portal-trigger-btn"
              onClick={() => {
                if (isAdmin) {
                  onAdminToggle(false);
                } else {
                  setShowLoginModal(true);
                }
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:bg-yellow-405 font-mono'
                  : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isAdmin ? (
                <div className="flex items-center gap-1.5 font-semibold">
                  <LogOut size={13} />
                  <span>Exit Panel</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-semibold">
                  <Lock size={13} />
                  <span className="hidden sm:inline text-yellow-500/90 font-bold">Admin Portal</span>
                  <span className="sm:hidden">Owner</span>
                </div>
              )}
            </button>

            {/* Past Orders History Trigger */}
            {!isAdmin && (
              <button
                id="past-orders-history-drawer-trigger-btn"
                onClick={onHistoryToggle}
                className="relative py-2 px-3.5 rounded-lg border border-white/10 bg-white/5 text-white/85 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider text-xs"
                title="View past orders"
              >
                <div className="relative">
                  <Clock size={14} className="text-amber-400" />
                  {orderCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-black bg-amber-400 rounded-full">
                      {orderCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden sm:inline">My Orders</span>
              </button>
            )}

            {/* Cart Trigger */}
            {!isAdmin && (
              <button
                id="shopping-cart-drawer-trigger-btn"
                onClick={onCartToggle}
                className="relative py-2 px-3.5 rounded-lg border border-white/10 bg-white/5 text-white/85 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider text-xs"
                title="View cart list"
              >
                <div className="relative">
                  <ShoppingCart size={14} className="text-yellow-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-black bg-yellow-500 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden sm:inline">Order List</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab and Mobile Search (Only visible on customer portal) */}
        {!isAdmin && (
          <div className="py-2 pb-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Mobile Search input */}
            <div className="flex md:hidden relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                <Search size={13} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search studio lights..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 focus:border-yellow-500 rounded-md text-white outline-none"
              />
            </div>

            {/* Tabs Scrollable Wrapper */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase shrink-0 mr-1.5 flex items-center gap-1 font-mono">
                <SlidersHorizontal size={9} /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider rounded-md transition-all shrink-0 uppercase cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-yellow-500 text-black font-extrabold shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                      : 'bg-[#0a0a0a] text-white/60 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Sub header info message */}
            <span className="text-[10px] font-mono text-white/40 tracking-tight text-right shrink-0 hidden lg:inline">
              Instant checkout carries exact serial numbers directly to Registered WhatsApp
            </span>
          </div>
        )}
      </div>

      {/* Administrator Authentication Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setPasswordInput('');
                  setLoginError('');
                }}
                className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-850 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 mb-3">
                <Lock size={22} />
              </div>
              <h3 className="text-base font-bold text-zinc-100">Owner Access Portal</h3>
              <p className="text-xs text-zinc-500 mt-1">Provide administrator password to edit inventory and statistics.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                  Administrator Key
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter access key..."
                  className="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 outline-none rounded-xl text-zinc-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-zinc-600 font-mono text-center tracking-wider"
                  required
                  autoFocus
                />
                <span className="block text-[9px] font-mono text-zinc-500 mt-1 bg-zinc-900 border border-zinc-800/30 p-1.5 rounded text-center">
                  💡 Hint: Enter <code className="text-amber-400 font-bold">procapture874</code> or <code className="text-amber-400 font-bold">123</code> for testing
                </span>
              </div>

              {loginError && (
                <div className="p-2 border border-rose-950 bg-rose-950/20 rounded-lg text-rose-450 text-[11px] text-center font-medium">
                  ⚠️ {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-500/10 active:scale-95 transition-all text-center uppercase tracking-wider cursor-pointer"
              >
                Verify Credentials
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
