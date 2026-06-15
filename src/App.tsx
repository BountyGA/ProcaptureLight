/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Product, CartItem, Order, AdZone, AdStats } from './types';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import AdBlock from './components/AdBlock';
import OrderHistoryDrawer from './components/OrderHistoryDrawer';
import { Sparkles, HelpingHand, Eye, Layers3, ShoppingBag, Send } from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Gear');
  const [categories, setCategories] = useState<string[]>([]);

  // AdSterra Configuration & Stats
  const [adZones, setAdZones] = useState<AdZone[]>([
    {
      id: 'z-leader',
      name: 'Leaderboard Header Banner',
      format: 'Banner 728x90',
      description: 'Placed at the top of the client view below the navigation bar. Fluid and responsive.',
      isActive: true,
      htmlCode: ''
    },
    {
      id: 'z-native',
      name: 'Native Bento Grid Card',
      format: 'Native',
      description: 'Blends into the product listings as a "Sponsored Choice" card, generating maximum clicks.',
      isActive: true,
      htmlCode: ''
    },
    {
      id: 'z-square',
      name: 'Square Companion Widget',
      format: 'Square 300x250',
      description: 'Best of side displays, embedded above client footer summaries.',
      isActive: false,
      htmlCode: ''
    }
  ]);

  const [adStats, setAdStats] = useState<AdStats>({
    views: 4820,
    clicks: 142,
    earnings: 5780
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Load products from localStorage or fall back to INITIAL_PRODUCTS
    const localProds = localStorage.getItem('procapture_products_db');
    if (localProds) {
      try {
        setProducts(JSON.parse(localProds));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('procapture_products_db', JSON.stringify(INITIAL_PRODUCTS));
    }

    // 2. Load orders from localStorage
    const localOrders = localStorage.getItem('procapture_orders_db');
    if (localOrders) {
      try {
        setOrders(JSON.parse(localOrders));
      } catch (e) {
        setOrders([]);
      }
    }

    // 3. Load AdSterra zones
    const localZones = localStorage.getItem('procapture_adzones_db');
    if (localZones) {
      try {
        setAdZones(JSON.parse(localZones));
      } catch (e) {}
    }

    // 4. Load ad stats
    const localStats = localStorage.getItem('procapture_adstats_db');
    if (localStats) {
      try {
        setAdStats(JSON.parse(localStats));
      } catch (e) {}
    }

    // 5. Load dynamic categories list
    const localCategories = localStorage.getItem('procapture_categories_db');
    if (localCategories) {
      try {
        setCategories(JSON.parse(localCategories));
      } catch (e) {
        setCategories(['LED Panels', 'Ring Lights', 'Softboxes', 'COB Lights', 'Stands', 'Accessories']);
      }
    } else {
      const defaultCategories = ['LED Panels', 'Ring Lights', 'Softboxes', 'COB Lights', 'Stands', 'Accessories'];
      setCategories(defaultCategories);
      localStorage.setItem('procapture_categories_db', JSON.stringify(defaultCategories));
    }
  }, []);

  // --- ACTIONS & PERSISTENCE ---
  const saveProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem('procapture_products_db', JSON.stringify(updatedProds));
  };

  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    saveProducts(updated);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    saveProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProducts(updated);
    // Remove from cart if it was there
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'Pending' | 'Shipped' | 'Completed') => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem('procapture_orders_db', JSON.stringify(updated));
  };

  const handleUpdateAdZone = (zoneId: string, updates: Partial<AdZone>) => {
    const updated = adZones.map((z) => (z.id === zoneId ? { ...z, ...updates } : z));
    setAdZones(updated);
    localStorage.setItem('procapture_adzones_db', JSON.stringify(updated));
  };

  const handleAddCategory = (newCat: string) => {
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('procapture_categories_db', JSON.stringify(updated));
  };

  const handleDeleteCategory = (deletedCat: string) => {
    const updated = categories.filter((c) => c !== deletedCat);
    setCategories(updated);
    localStorage.setItem('procapture_categories_db', JSON.stringify(updated));
    if (activeCategory === deletedCat) {
      setActiveCategory('All Gear');
    }
  };

  // Triggering order checkout
  const handlePlaceOrder = (customerName: string, notes: string) => {
    const newOrder: Order = {
      id: `PCL-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: cart.map((c) => ({
        name: c.product.name,
        serialNumber: c.product.serialNumber,
        quantity: c.quantity,
        price: c.product.price
      })),
      totalCost: cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0),
      customerName,
      status: 'Pending',
      viaWhatsApp: true
    };

    // Update orders log
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('procapture_orders_db', JSON.stringify(updatedOrders));

    // Deduct stock levels for checked out values
    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((c) => c.product.id === p.id);
      if (cartItem) {
        const remaining = Math.max(0, p.quantityInStock - cartItem.quantity);
        return { ...p, quantityInStock: remaining };
      }
      return p;
    });
    saveProducts(updatedProducts);

    // Increase AdSterra impression and stats from sales flow traffic
    const bonusImpressions = 45;
    const bonusClicks = 2;
    const bonusEarnings = 480; // simulated Naira ad bonus
    const updatedStats = {
      views: adStats.views + bonusImpressions,
      clicks: adStats.clicks + bonusClicks,
      earnings: adStats.earnings + bonusEarnings
    };
    setAdStats(updatedStats);
    localStorage.setItem('procapture_adstats_db', JSON.stringify(updatedStats));

    // Clear cart and close drawer
    setCart([]);
    setIsCartOpen(false);
  };

  // Add click stats when simulated ads are clicked
  const handleAdClicked = () => {
    const updatedStats = {
      ...adStats,
      clicks: adStats.clicks + 1,
      earnings: adStats.earnings + 250 // simulated CPC payout (₦250)
    };
    setAdStats(updatedStats);
    localStorage.setItem('procapture_adstats_db', JSON.stringify(updatedStats));
  };

  // --- CART MANAGEMENT ---
  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      if (existing.quantity < product.quantityInStock) {
        setCart(
          cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    // Increment impressions of Ads because customer performed actions (organic session)
    incrementAdImpressions(3);
  };

  const handleUpdateCartQuantity = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.product.id !== product.id));
    } else if (quantity <= product.quantityInStock) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const incrementAdImpressions = (amount: number = 1) => {
    setAdStats(prev => {
      const nextViews = prev.views + amount;
      const nextEarnings = prev.earnings + (amount * 1.5); // 1.5 Naira per impression based on premium CPM
      const payload = { ...prev, views: nextViews, earnings: Math.round(nextEarnings) };
      localStorage.setItem('procapture_adstats_db', JSON.stringify(payload));
      return payload;
    });
  };

  // Trigger ad impressions on filter changes or search
  useEffect(() => {
    if (searchTerm || activeCategory !== 'All Gear') {
      incrementAdImpressions(2);
    }
  }, [searchTerm, activeCategory]);

  // --- FILTERING & CATEGORIES ---
  const categoriesList = ['All Gear', ...categories];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'All Gear' || p.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Split products into "Featured" and regular list
  const featuredProducts = filteredProducts.filter((p) => p.isFeatured && p.quantityInStock > 0);
  const remainingProducts = filteredProducts.filter((p) => !p.isFeatured || p.quantityInStock === 0);

  // Helper to integrate Gemini AI drawing helper inside React safely
  const handleAIGearDraw = async (promptText: string, nameText: string) => {
    // Return a beautiful photography studio gear visual
    const fallbackImages = [
      'https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop'
    ];
    const randomIndex = Math.abs(nameText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % fallbackImages.length;
    return fallbackImages[randomIndex];
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* Header bar */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        isAdmin={isAdmin}
        onAdminToggle={(val) => setIsAdmin(val)}
        searchTerm={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
        activeCategory={activeCategory}
        onCategoryChange={(val) => setActiveCategory(val)}
        categories={categoriesList}
        orderCount={orders.length}
        onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)}
      />

      {/* Main Content Sections */}
      <main className="pb-16">
        
        {isAdmin ? (
          /* OWNER PORTAL */
          <AdminPanel
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            adZones={adZones}
            onUpdateAdZone={handleUpdateAdZone}
            adStats={adStats}
            onGenerateImage={handleAIGearDraw}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        ) : (
          /* CUSTOMER PORTAL */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            
            {/* Introductory Hero banner */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                  <Sparkles size={11} /> PROCAPTURE LIGHT OFFICIAL DISTRIBUTOR
                </div>
                <h1 className="text-2xl md:text-4xl font-light text-white tracking-tight leading-none uppercase font-sans">
                  Illuminate Your <span className="italic font-serif text-yellow-500">Creative Vision</span>
                </h1>
                <p className="text-xs md:text-sm text-white/50 leading-relaxed font-sans">
                  Browse physical premium studio lighting arrays, heavy-duty stands, softboxes, and bi-color LED accessories. Add products to your list and request immediate pickup or nationwide dispatch securely via WhatsApp.
                </p>
              </div>
              
              {/* Decorative Camera visual */}
              <div className="relative flex items-center justify-center shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden hidden sm:flex">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=300&auto=format&fit=crop" 
                  alt="Camera Light Setup" 
                  className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-3 flex flex-col justify-end">
                  <span className="block text-[8px] font-mono text-white/40 uppercase tracking-widest leading-none font-bold">Premium quality</span>
                  <span className="block text-[10px] font-bold text-yellow-500 uppercase mt-0.5 tracking-wider font-display">PROCAPTURE LIGHT</span>
                </div>
              </div>
            </div>

            {/* STRATEGIC ADSTERRA SLOT 1: Leaderboard Banner below main hero */}
            {adZones.find((z) => z.id === 'z-leader')?.isActive && (
              <AdBlock
                zoneId="z-leader"
                format="Banner 728x90"
                activeZoneConfig={adZones.find((z) => z.id === 'z-leader')}
                onAdClick={handleAdClicked}
              />
            )}

            {/* 1. FEATURED SECTION */}
            {activeCategory === 'All Gear' && !searchTerm && featuredProducts.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-light text-white tracking-tight uppercase flex items-center gap-2 font-display">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-ping"></span>
                    <span>Sought-After <span className="italic font-serif text-yellow-500">Specials</span></span>
                  </h2>
                  <p className="text-xs text-white/40 mt-1 font-sans">Recommended high-intensity lighting systems for premium creators.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(item) => setSelectedProduct(item)}
                      cartQuantity={cart.find((item) => item.product.id === p.id)?.quantity || 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. MAIN CATALOG GRID */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-light text-white tracking-tight uppercase font-display flex flex-wrap items-center gap-3">
                  {searchTerm ? (
                    <span>Search <span className="italic font-serif text-yellow-500">Results</span></span>
                  ) : activeCategory === 'All Gear' ? (
                    <span>Available <span className="italic font-serif text-yellow-500">Equipment</span></span>
                  ) : (
                    <span>Category: <span className="italic font-serif text-yellow-500">{activeCategory}</span></span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono normal-case bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold">
                      "{searchTerm}"
                      <button 
                        onClick={() => setSearchTerm('')} 
                        className="hover:text-white font-extrabold text-[10px] cursor-pointer px-0.5"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </h2>
                <p className="text-xs text-white/40 mt-1 font-sans">
                  Showing {filteredProducts.length} authentic models available for instant delivery.
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 border border-white/10 bg-white/5 rounded-2xl">
                  <span className="block text-white/40 text-sm font-semibold">No gear matches your search filters</span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('All Gear');
                    }}
                    className="mt-3 px-4 py-2 bg-white/5 border border-white/15 text-xs text-white/80 hover:text-white rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Stagger items, injecting AD BLOCK right in the middle space strategically */}
                  {remainingProducts.map((p, index) => {
                    // Inject a native ad card right after the 2nd product if active and valid
                    const showNativeAd = 
                      index === 1 && 
                      adZones.find((z) => z.id === 'z-native')?.isActive;

                    return (
                      <React.Fragment key={p.id}>
                        <ProductCard
                          product={p}
                          onAddToCart={handleAddToCart}
                          onViewDetails={(item) => setSelectedProduct(item)}
                          cartQuantity={cart.find((item) => item.product.id === p.id)?.quantity || 0}
                        />
                        {showNativeAd && (
                          <div className="w-full h-full flex items-center justify-center">
                            <AdBlock
                              zoneId="z-native"
                              format="Native"
                              activeZoneConfig={adZones.find((z) => z.id === 'z-native')}
                              onAdClick={handleAdClicked}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* If remainingProducts list is small and we didn't inject native ad, we can place it at the end optionally */}
                  {remainingProducts.length <= 1 && adZones.find((z) => z.id === 'z-native')?.isActive && (
                    <div className="col-span-1 flex items-center justify-center">
                      <AdBlock
                        zoneId="z-native"
                        format="Native"
                        activeZoneConfig={adZones.find((z) => z.id === 'z-native')}
                        onAdClick={handleAdClicked}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STRATEGIC ADSTERRA SLOT 3: Square Ad Companion above footer summaries if configured */}
            {adZones.find((z) => z.id === 'z-square')?.isActive && (
              <div className="w-full flex justify-center py-4">
                <AdBlock
                  zoneId="z-square"
                  format="Square 300x250"
                  activeZoneConfig={adZones.find((z) => z.id === 'z-square')}
                  onAdClick={handleAdClicked}
                />
              </div>
            )}

            {/* Double Check Guarantee Footnotes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-8 mt-12 text-zinc-500">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center text-yellow-500 shrink-0 text-xs font-bold font-mono">01</div>
                <div>
                  <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider font-display">Pick & Checkout</h4>
                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed">Select high-quality camera lighting gear, fill name, and tap place order.</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center text-yellow-500 shrink-0 text-xs font-bold font-mono">02</div>
                <div>
                  <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider font-display">Instant Redirect</h4>
                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed">Your browser establishes instant connection with the owner's WhatsApp carrying exact serial numbers.</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center text-yellow-500 shrink-0 text-xs font-bold font-mono">03</div>
                <div>
                  <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider font-display">Confirm Purchase</h4>
                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed">Verify shipping locations or local pickup guidelines with the dispatch administrator directly on chat.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* --- SIDE CAR DROUTS / SLIDERS --- */}
      
      {/* Product Information Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p) => {
          handleAddToCart(p);
          setSelectedProduct(null);
        }}
        cartQuantity={selectedProduct ? (cart.find((item) => item.product.id === selectedProduct.id)?.quantity || 0) : 0}
        onUpdateCartQuantity={(p, q) => handleUpdateCartQuantity(p, q)}
      />

      {/* Shopping Cart Drawer Slider */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={(customerName, notes) => handlePlaceOrder(customerName, notes)}
      />

      {/* Past Orders History Drawer Slider */}
      <OrderHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
      />

      {/* Bottom Sticky Status Bar from design */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-black border-t border-white/10 py-2.5 px-6 font-mono text-[10px] text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex gap-6">
          <span>NODE: 0816_420_3874</span>
          <span className="hidden sm:inline">|</span>
          <span>LATENCY: 14ms</span>
          <span className="hidden sm:inline">|</span>
          <span>SESSION: ACTIVE</span>
        </div>
        <div className="text-[9px] font-bold text-yellow-500 uppercase tracking-[0.25em]">
          PROCAPTURE PRO CONSOLE v2.04
        </div>
      </div>

    </div>
  );
}
