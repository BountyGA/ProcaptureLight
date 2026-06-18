/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Package, DollarSign, PlusCircle, Trash2, Edit2, ShoppingBag, 
  Settings, CheckCircle, TrendingUp, HelpCircle, Save, Sliders, Play, Code, Layers 
} from 'lucide-react';
import { Product, Order, AdZone, AdStats } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'Pending' | 'Shipped' | 'Completed') => void;
  adZones: AdZone[];
  onUpdateAdZone: (zoneId: string, updates: Partial<AdZone>) => void;
  adStats: AdStats;
  onGenerateImage?: (prompt: string, productName: string) => Promise<string>;
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

export default function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  adZones,
  onUpdateAdZone,
  adStats,
  onGenerateImage,
  categories,
  onAddCategory,
  onDeleteCategory
}: AdminPanelProps) {
  // Tabs management
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'monetization'>('inventory');

  // Product Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState('');
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(categories[0] || 'LED Panels');
  const [description, setDescription] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Category Manager Form State
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  // Deletion inline security gates (prevent blocked popups inside web preview iFrames)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);

  // Sync category state when categories load or select empty
  React.useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  // AI Generation helpers
  const [imageGeneratingState, setImageGeneratingState] = useState(false);

  // Form utilities
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeaturesList([...featuresList, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const startEditProduct = (prod: Product) => {
    setIsEditing(true);
    setCurrentProductId(prod.id);
    setName(prod.name);
    setSerialNumber(prod.serialNumber);
    setPrice(prod.price);
    setQuantity(prod.quantityInStock);
    setImageUrl(prod.imageUrl);
    setCategory(prod.category);
    setDescription(prod.description);
    setFeaturesList(prod.features || []);
    setIsFeatured(!!prod.isFeatured);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProductForm = () => {
    setIsEditing(false);
    setCurrentProductId('');
    setName('');
    setSerialNumber('');
    setPrice(0);
    setQuantity(0);
    setImageUrl('');
    setCategory(categories[0] || 'LED Panels');
    setDescription('');
    setFeatureInput('');
    setFeaturesList([]);
    setIsFeatured(false);
    setFormError('');
    setFormSuccess('');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !serialNumber.trim() || price <= 0 || quantity < 0) {
      setFormError('Please enter authentic details (Price must be > 0, quantity >= 0).');
      return;
    }

    const payload: Product = {
      id: isEditing ? currentProductId : `pc-prod-${Date.now()}`,
      name: name.trim(),
      serialNumber: serialNumber.trim(),
      price: Number(price),
      quantityInStock: Number(quantity),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop',
      category,
      description: description.trim(),
      features: featuresList,
      isFeatured
    };

    if (isEditing) {
      onUpdateProduct(payload);
      setFormSuccess('Product successfully cataloged & updated.');
    } else {
      onAddProduct(payload);
      setFormSuccess('New gear successfully launched in store.');
    }

    setTimeout(() => {
      resetProductForm();
    }, 1200);
  };

  // Generate a mock product image if they use AI
  const handleAIImageGen = async () => {
    if (!name) {
      setFormError('Please input product name first to generate a stunning matching gear image.');
      return;
    }
    setImageGeneratingState(true);
    setFormError('');
    try {
      const prompt = `Hyper-professional studio photography product shot of high-quality camera video gear ${name}. Matte black housing, advanced lighting dials, metallic components, glowing status LCD, cinematic backlighting, dark background.`;
      
      // Since generating images in a react client is supported via helper callback on App.tsx which maps to generate_image tool, we call this nicely
      if (onGenerateImage) {
        const url = await onGenerateImage(prompt, name);
        setImageUrl(url);
        setFormSuccess('Stunning high-res gear visual populated successfully via AI Studio.');
      } else {
        // Fallback Unsplash search
        setImageUrl('https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=600&auto=format&fit=crop');
      }
    } catch (err) {
      setFormError('AI Visual generation offline. Preset image loaded instead.');
      setImageUrl('https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=600&auto=format&fit=crop');
    } finally {
      setImageGeneratingState(false);
    }
  };

  const formatCurrency = (amt: number) => {
    return `₦${new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amt)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin header cards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="text-amber-400" /> PROCAPTURE Light — Storeowner Portal
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Realtime database sync, CRM WhatsApp logs and AdSterra strategic ad monetization control.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'inventory' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Package size={13} /> Inventory Manager
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag size={13} /> CRM Orders log ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'monetization' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp size={13} /> AdSterra Monetization
          </button>
        </div>
      </div>

      {/* -------------------- INVENTORY MANAGER TAB -------------------- */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Register / Update Product Form & Category Editor */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Cataloger Card */}
            <div className="border border-zinc-900 bg-zinc-950/60 p-6 rounded-2xl space-y-6 shadow-xl relative">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Cataloguer</span>
                <h2 className="text-lg font-black text-white mt-1">
                  {isEditing ? '⚒️ Edit Gear Specification' : '📤 Catalog New Gear'}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Keep details authentic. These compile directly to WhatsApp templates.</p>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1.5">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ProCapture SlimLight 48 RGB"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-zinc-850 rounded-xl text-zinc-200 outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1.5">Serial Number</label>
                    <input
                      type="text"
                      required
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="PC-XX99-XXXX"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-zinc-850 rounded-xl text-zinc-200 uppercase font-mono outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-zinc-850 rounded-xl text-zinc-200 outline-none focus:border-amber-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1.5">Price (NGN ₦)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="Naira value"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-zinc-850 rounded-xl text-zinc-200 outline-none focus:border-amber-400 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1.5">Units in Stock</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={quantity === 0 ? '0' : quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      placeholder="Available count"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-zinc-850 rounded-xl text-zinc-200 outline-none focus:border-amber-400 font-semibold"
                    />
                  </div>
                </div>

                {/* Image URL with an explicit option to execute image_generation prompt */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1 flex justify-between items-center bg-zinc-950 p-1.5 rounded border border-zinc-900 mb-1.5">
                    <span>Product Visual URL</span>
                    <button
                      type="button"
                      onClick={handleAIImageGen}
                      disabled={imageGeneratingState}
                      className="text-[9px] font-sans font-bold text-black bg-amber-400 px-1.5 py-0.5 rounded flex items-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {imageGeneratingState ? 'Generating...' : '💡 AI Studio Draw'}
                    </button>
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/your-gear-photo..."
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-zinc-850 rounded-xl text-zinc-200 outline-none focus:border-amber-405 text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-1.5">Product Description (Brief Summary)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specifications, features, ideal setup etc..."
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-zinc-850 rounded-xl text-zinc-200 outline-none focus:border-amber-404 h-20 resize-none leading-relaxed"
                  />
                </div>

                {/* Bullet Features Manager */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Bullet Technical Specifications</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="e.g. Max Output Power: 65W, CRI: 97+"
                      className="flex-1 px-3 py-1.5 text-xs bg-neutral-900 border border-zinc-850 rounded-lg text-zinc-200 outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg active:scale-95 transition-transform cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  {featuresList.length > 0 && (
                    <div className="p-2 border border-zinc-900 rounded-xl bg-zinc-950 max-h-32 overflow-y-auto space-y-1.5">
                      {featuresList.map((feat, index) => (
                        <div key={index} className="flex justify-between items-center text-[11px] text-zinc-300 bg-zinc-900/50 p-1.5 rounded font-sans pr-1">
                          <span className="truncate flex-1">• {feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-rose-500 hover:text-rose-400 px-1 font-mono text-[10px] font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Show item in homepage feature grid */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.checked || e.target.checked)}
                    className="rounded bg-neutral-900 border-zinc-800 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-zinc-400 select-none">
                    Promote on Storefront Featured Section
                  </label>
                </div>

                {/* Alert Status Banners */}
                {formError && (
                  <div className="p-2.5 border border-rose-950 bg-rose-950/20 rounded-xl text-rose-450 text-[11px] font-medium text-center">
                    ⚠️ {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="p-2.5 border border-emerald-950 bg-emerald-950/20 rounded-xl text-emerald-450 text-[11px] font-medium text-center">
                    ✨ {formSuccess}
                  </div>
                )}

                {/* Form Action buttons */}
                <div className="flex gap-2.5 pt-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="flex-1 py-2.5 px-4 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl active:scale-95 transition-all text-center cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl active:scale-95 transition-all text-center uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save size={13} />
                    <span>{isEditing ? 'Save Changes' : 'Catalog Gear'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Category Manager Card */}
            <div className="border border-zinc-900 bg-zinc-950/60 p-6 rounded-2xl space-y-4 shadow-xl relative">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1">
                  <Layers size={11} className="text-amber-500" /> System Manager
                </span>
                <h3 className="text-sm font-bold text-white mt-1">Edit Product Categories</h3>
                <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                  Expand or trim categories available across client and storefront dashboards.
                </p>
              </div>

              {/* List of current dynamic Categories */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const assignedCount = products.filter((p) => p.category === cat).length;
                  return (
                    <div 
                      key={cat} 
                      className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-850 text-xs font-sans group hover:border-zinc-800 transition-all"
                    >
                      <div className="min-w-0">
                        <span className="font-medium text-zinc-200 block truncate">{cat}</span>
                        <span className="text-[9px] text-zinc-500 font-mono block">
                          {assignedCount} {assignedCount === 1 ? 'item' : 'items'} registered
                        </span>
                      </div>
                      
                      {/* Delete option */}
                      {categoryToDelete === cat ? (
                        <div className="flex items-center gap-1.5 shrink-0 bg-zinc-950 p-1 border border-zinc-900 rounded-lg">
                          <span className="text-[9px] text-rose-450 font-mono select-none font-bold px-1">Sure?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteCategory(cat);
                              setCategoryToDelete(null);
                              setCategorySuccess(`Category "${cat}" successfully retired.`);
                              setTimeout(() => setCategorySuccess(''), 2500);
                            }}
                            className="text-[9px] font-extrabold bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            Retire
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(null)}
                            className="text-[9px] font-bold bg-zinc-850 hover:bg-zinc-700 text-zinc-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1 px-1.5 text-zinc-500 hover:text-rose-455 hover:bg-rose-950/15 border border-transparent hover:border-zinc-850 rounded transition-all cursor-pointer"
                          title={`Delete ${cat}`}
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add category text input line */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setCategoryError('');
                  setCategorySuccess('');
                  const formatted = newCategoryInput.trim();
                  if (!formatted) return;

                  if (formatted.toLowerCase() === 'all gear') {
                    setCategoryError('"All Gear" is a system-reserved label.');
                    return;
                  }

                  if (categories.some((c) => c.toLowerCase() === formatted.toLowerCase())) {
                    setCategoryError('This category already exists.');
                    return;
                  }

                  onAddCategory(formatted);
                  setNewCategoryInput('');
                  setCategorySuccess(`"${formatted}" successfully deployed to core.`);
                  setTimeout(() => setCategorySuccess(''), 2500);
                }}
                className="space-y-2 pt-2 border-t border-zinc-900"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="New category label..."
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-950 border border-zinc-850 rounded-xl text-zinc-350 outline-none focus:border-amber-400 font-sans"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black rounded-lg active:scale-95 transition-transform cursor-pointer font-mono uppercase shrink-0"
                  >
                    + Add
                  </button>
                </div>
                {categoryError && (
                  <div className="text-[10px] text-rose-500 font-mono mt-1">
                    ⚠️ {categoryError}
                  </div>
                )}
                {categorySuccess && (
                  <div className="text-[10px] text-emerald-450 font-semibold mt-1 font-sans">
                    ✨ {categorySuccess}
                  </div>
                )}
              </form>
            </div>

          </div>

          {/* Right Column: Inventory List Table */}
          <div className="lg:col-span-2 border border-zinc-900 bg-zinc-950/30 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white">Active Product Inventory</h3>
                <p className="text-xs text-zinc-500 mt-1">Adjust, edit or delete currently published lighting items.</p>
              </div>
              <div className="px-3.5 py-1.5 bg-zinc-900 rounded-xl border border-zinc-800/80 shrink-0 text-center">
                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Registered Items</span>
                <span className="text-sm font-extrabold text-white">{products.length} Units</span>
              </div>
            </div>

            {/* Core Inventory items table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-900">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-600 font-mono uppercase tracking-wider border-b border-zinc-900">
                    <th className="p-3.5 pl-4">Gear Details</th>
                    <th className="p-3.5">Serial No</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 bg-zinc-950/20">
                  {products.map((p) => {
                    const isLow = p.quantityInStock <= 5 && p.quantityInStock > 0;
                    const isOutStr = p.quantityInStock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/30 transition-all group">
                        
                        {/* Name + thumbnail */}
                        <td className="p-3.5 pl-4 flex items-center gap-3">
                          <img 
                            src={p.imageUrl} 
                            alt={p.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-black border border-zinc-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-zinc-200 block truncate max-w-[170px]">{p.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono block">ID: {p.id}</span>
                          </div>
                        </td>

                        {/* Serial */}
                        <td className="p-3.5 font-mono text-amber-500/90 font-semibold">{p.serialNumber}</td>

                        {/* Cat */}
                        <td className="p-3.5 text-zinc-400 font-medium">{p.category}</td>

                        {/* Price */}
                        <td className="p-3.5 font-bold text-zinc-100">{formatCurrency(p.price)}</td>

                        {/* Stock */}
                        <td className="p-3.5">
                          <span className={`font-mono font-bold ${
                            isOutStr ? 'text-rose-500' : isLow ? 'text-amber-500' : 'text-zinc-300'
                          }`}>
                            {p.quantityInStock} units
                          </span>
                          {isOutStr && <span className="block text-[8px] text-rose-550 font-sans mt-0.5">RESTOCK REQD</span>}
                          {isLow && <span className="block text-[8px] text-amber-550 font-sans mt-0.5">LIMITED</span>}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right pr-4 shrink-0 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {productToDeleteId === p.id ? (
                              <div className="flex items-center gap-1.5 bg-zinc-900 border border-rose-900/40 p-1.5 rounded-lg">
                                <span className="text-[10px] text-rose-400 font-bold px-1 select-none">Confirm Delete?</span>
                                <button
                                  onClick={() => {
                                    onDeleteProduct(p.id);
                                    setProductToDeleteId(null);
                                  }}
                                  className="px-2 py-1 text-[10px] font-black bg-rose-600 hover:bg-rose-500 rounded text-white cursor-pointer transition-colors"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setProductToDeleteId(null)}
                                  className="px-2 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700/80 rounded text-zinc-350 cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditProduct(p)}
                                  className="p-1 px-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-350 hover:bg-amber-400 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer text-[10px] font-bold"
                                  title="Edit item attributes"
                                >
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => setProductToDeleteId(p.id)}
                                  className="p-1.5 rounded-lg bg-zinc-900/60 hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 border border-zinc-800 hover:border-rose-900/40 transition-all cursor-pointer"
                                  title="Delete permanently"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="p-8 text-center text-zinc-650">
                  <Package className="mx-auto mb-2 opacity-30" size={32} />
                  <span>No products cataloged in database yet. Catalog some gear on the left!</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* -------------------- CRM ORDERS LOG TAB -------------------- */}
      {activeTab === 'orders' && (
        <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white">Simulated CRM Orders History</h3>
              <p className="text-xs text-zinc-500 mt-1">
                A localized track of user checkout requests. These logs match the messages dispatched to your WhatsApp account.
              </p>
            </div>
            <div className="p-3 px-4 bg-zinc-900 border border-zinc-850 rounded-xl flex items-center gap-3">
              <div>
                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Gross Simulated Pipeline</span>
                <span className="text-sm font-extrabold text-amber-400">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.totalCost, 0))}
                </span>
              </div>
              <div className="border-l border-zinc-800 pl-3">
                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Transactions log</span>
                <span className="text-sm font-extrabold text-white">{orders.length} orders</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-900 text-zinc-650 font-mono uppercase tracking-wider">
                  <th className="p-3.5 pl-4">Order ID & Date</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Ordered Items (Qty X Model)</th>
                  <th className="p-3.5">Consolidated Cost</th>
                  <th className="p-3.5">Route</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 bg-zinc-950/20">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-900/30 transition-all">
                    
                    {/* ID & Date */}
                    <td className="p-3.5 pl-4">
                      <span className="font-mono text-zinc-200 block font-bold">{o.id}</span>
                      <span className="text-[10px] text-zinc-500 block">{o.date}</span>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5 font-bold text-zinc-300">{o.customerName || 'Anonymous User'}</td>

                    {/* Serial Numbers & Subtotals */}
                    <td className="p-3.5 space-y-1">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-[11px] text-zinc-400 leading-normal">
                          <span className="font-bold text-zinc-300 shrink-0">[{it.quantity}X]</span>
                          <span className="truncate max-w-[150px]">{it.name}</span>
                          <span className="text-[10px] font-mono text-amber-500 flex items-center gap-0.5">
                            ({it.serialNumber})
                          </span>
                        </div>
                      ))}
                    </td>

                    {/* Total Cost */}
                    <td className="p-3.5 font-black text-white">{formatCurrency(o.totalCost)}</td>

                    {/* Route */}
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-950/30 border border-emerald-500/20 text-emerald-450 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                        WhatsApp Link
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        o.status === 'Completed'
                          ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-500/10'
                          : o.status === 'Shipped'
                          ? 'bg-blue-950/40 text-blue-450 border border-blue-500/10'
                          : 'bg-zinc-900 text-zinc-450 border border-zinc-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>

                    {/* Actions dropdown */}
                    <td className="p-3.5 text-right pr-4">
                      <select
                        value={o.status}
                        onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300 rounded px-2 py-1 outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Dispatched</option>
                        <option value="Completed">Delivered</option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="p-8 text-center text-zinc-650">
                <ShoppingBag className="mx-auto mb-2 opacity-30" size={32} />
                <span>Simulated Order list is clean. Perform checkouts in customer mode to spawn logs.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- ADSTERRA MONETIZATION CONTROL PANEL -------------------- */}
      {activeTab === 'monetization' && (
        <div className="space-y-8">
          
          {/* Section 1: Monetization Stats Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden border border-zinc-900 bg-zinc-950/60 p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">Estimated AdSterra Impressions</span>
                <div className="text-3xl font-black text-white tracking-tight">
                  {adStats.views.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
                  🚀 +14.2% Growth This Month
                </span>
              </div>
              <div className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-850 text-zinc-400 shrink-0">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="relative overflow-hidden border border-zinc-900 bg-zinc-950/60 p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">Strategic Ad Clickthroughs</span>
                <div className="text-3xl font-black text-white tracking-tight">
                  {adStats.clicks.toLocaleString()}
                </div>
                <span className="text-[10px] text-amber-400 font-mono">
                  CTR Value: {( (adStats.clicks / (adStats.views || 1)) * 100).toFixed(2)}% Avg
                </span>
              </div>
              <div className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-850 text-amber-400 shrink-0">
                <PlusCircle size={20} />
              </div>
            </div>

            <div className="relative overflow-hidden border border-zinc-900 bg-zinc-950 shadow-2xl p-6 rounded-2xl flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono uppercase tracking-wider text-amber-500 block font-bold">Simulated AdSterra Earnings</span>
                <div className="text-3xl font-black text-amber-400 tracking-tight">
                  {formatCurrency(adStats.earnings)}
                </div>
                <span className="text-[10px] text-zinc-500 font-sans">
                  Calculated based on ₦1,200 ($1.50) CPM
                </span>
              </div>
              <div className="h-10 w-10 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign size={20} />
              </div>
            </div>
          </div>

          {/* Section 2: Instructions and Layout Management split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left box: Layout config */}
            <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl space-y-6 shadow-xl relative">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Implementation Settings</span>
                <h3 className="text-lg font-black text-white mt-1">Configuring Ad Slots</h3>
                <p className="text-xs text-zinc-500 mt-1">Activate, disable, or paste direct script and iframe tags provided by your AdSterra account.</p>
              </div>

              <div className="space-y-5">
                {adZones.map((zone) => (
                  <div key={zone.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-zinc-200">{zone.name}</h4>
                          <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                            {zone.format}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{zone.description}</p>
                      </div>

                      {/* Active Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={zone.isActive}
                          onChange={(e) => onUpdateAdZone(zone.id, { isActive: e.checked || e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-300 after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-400 peer-checked:after:bg-black"></div>
                      </label>
                    </div>

                    {/* Code injector text input */}
                    {zone.isActive && (
                      <div className="space-y-1.5 pt-2 border-t border-zinc-900/40">
                        <label className="block text-[9px] font-mono uppercase text-zinc-500 text-zinc-400 flex items-center gap-1">
                          <Code size={11} className="text-amber-400" /> HTML Script / Iframe Code Block
                        </label>
                        <textarea
                          value={zone.htmlCode || ''}
                          onChange={(e) => onUpdateAdZone(zone.id, { htmlCode: e.target.value })}
                          placeholder='e.g. <script type="text/javascript">atOptions = { "key" : "your_adsterra_key" };</script>'
                          className="w-full px-3 py-2 text-[10px] font-mono bg-neutral-900 border border-zinc-850 rounded-lg text-zinc-400 outline-none focus:border-amber-400 h-16 leading-relaxed"
                        />
                        <span className="text-[9px] font-sans text-zinc-650 block">
                          💡 Leave empty to display the beautiful default camera accessory sponsor placeholder.
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right box: Instructions & Guidelines on AdSterra partnership */}
            <div className="border border-zinc-900 bg-zinc-950/20 p-6 rounded-2xl shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Guidelines</span>
                <h3 className="text-lg font-black text-white mt-1">Monetizing with AdSterra Ads</h3>
                <p className="text-xs text-zinc-500 mt-1">Follow these simple instructions to connect your actual AdSterra dashboard and earn real cash.</p>
              </div>

              <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white shrink-0 text-[11px]">1</div>
                  <div>
                    <h5 className="font-bold text-zinc-200">Register as a Publisher</h5>
                    <p className="text-zinc-500 mt-0.5">
                      Go to <a href="https://adsterra.com/" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">adsterra.com</a> and sign up for a Publisher account. Adding a password and payment method is simple.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white shrink-0 text-[11px]">2</div>
                  <div>
                    <h5 className="font-bold text-zinc-200">Register your App URL</h5>
                    <p className="text-zinc-500 mt-0.5">
                      Submit your AI Studio hosted App URL (look at your development or shared URL in the preview margins) under "Add Website". Set website category to "Books" or "E-commerce/Utilities".
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white shrink-0 text-[11px]">3</div>
                  <div>
                    <h5 className="font-bold text-zinc-200">Create Ad Codes</h5>
                    <p className="text-zinc-500 mt-0.5">
                      Generate Banner codes of the desired formats: **728x90 Leaderboard** for desktops, **320x50** for mobile screens, or **300x250 Medium Rectangles** for grid components.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white shrink-0 text-[11px]">4</div>
                  <div>
                    <h5 className="font-bold text-zinc-200">Inject Scripts & Enjoy Cashflow</h5>
                    <p className="text-zinc-500 mt-0.5">
                      Toggle the corresponding Ad Slot to <span className="text-emerald-400 font-semibold font-mono">ON</span> on the left, paste the javascript snippet from AdSterra, and save. The app will immediately begin projecting live AdSterra ads to customers world-wide!
                    </p>
                  </div>
                </div>

                {/* Helpful tips card */}
                <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 text-[11px] text-zinc-400 space-y-1.5 pt-3">
                  <span className="font-bold text-amber-500 font-mono block uppercase tracking-widest text-[9px] flex items-center gap-1">
                    <HelpCircle size={11} /> Pro Tips for High Impressions
                  </span>
                  <p>
                    1. Keep the <strong className="text-zinc-200">Grid Native Slot</strong> active; it blends styled sponsor banners between your camera gear listings, yielding high clickthrough rates.
                  </p>
                  <p>
                    2. Avoid excessive ad codes; keeping 2 static slots active provides a spectacular balance of visual aesthetics and high monetization revenue.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
