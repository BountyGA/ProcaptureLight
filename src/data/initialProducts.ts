/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'pc-rl18',
    name: 'ProCapture Spectrum 18" LED Ring Light',
    serialNumber: 'PC-RL18-8742',
    price: 55000,
    quantityInStock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1619597455322-4fbbd820250a?q=80&w=600&auto=format&fit=crop',
    category: 'Ring Lights',
    description: 'Professional high-intensity 18-inch ring light with step-less dimming, bi-color temperature adjustments (3200K-5600K), and built-in USB ports. Perfect for portraits, live-streaming, and detail-oriented photography.',
    features: [
      'CRI > 95 for ultra-accurate skin tones',
      'Dual color control knobs',
      'Includes premium phone mounts and a cold-shoe mount',
      'Output Power: 55W high-efficiency LEDs'
    ],
    isFeatured: true
  },
  {
    id: 'pc-lp60',
    name: 'ProCapture StreamLine Dual Bi-Color LED Panel Set',
    serialNumber: 'PC-LP60-1284',
    price: 115000,
    quantityInStock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=600&auto=format&fit=crop',
    category: 'LED Panels',
    description: 'An essential 2-pack studio lighting kit featuring ultra-slim, silent bi-color panels. Generates up to 4800 lumens of soft, diffused light with zero flicker. Includes wireless remote controllers and visual LCD status displays.',
    features: [
      '600 individual premium LEDs per panel',
      '3200K to 5600K color range tuning',
      'High heat dissipation metal chassis',
      'Dual power modes (AC adapter or NP-F battery slots)'
    ],
    isFeatured: true
  },
  {
    id: 'pc-sb90',
    name: 'ProCapture Octa-Dome 90cm Octagonal Softbox',
    serialNumber: 'PC-SB90-5020',
    price: 34500,
    quantityInStock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop',
    category: 'Softboxes',
    description: 'Premium parabolic softbox designed for beauty and portrait photographers. Features a quick-setup umbrella mechanism, highly reflective silver coating internally, and double diffusion screens for smooth feathering gradients.',
    features: [
      'Bowens S-Type mount compatibility',
      'Heavy-duty alloy frame rods',
      'Includes 40-degree fabric grid (egg crate)',
      'Inner and outer cloth diffusers included'
    ],
    isFeatured: false
  },
  {
    id: 'pc-pc08',
    name: 'ProCapture PocketCOB 80W Portable RGB Video Light',
    serialNumber: 'PC-PC08-3010',
    price: 48000,
    quantityInStock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=600&auto=format&fit=crop',
    category: 'COB Lights',
    description: 'Pocket-sized but exceptionally bright 80W Chip-On-Board light. Offers continuous full-gamut RGB spectrum values, adjustable lighting special effects (thunderstorm, TV, candle, paparazzi), and intelligent active fan cooling.',
    features: [
      '0% to 100% fine luminance dimming',
      'Full RGB + CCT control',
      'Bluetooth integration for smartphone control app',
      'Integrated heavy-duty silent magnetic fan module'
    ],
    isFeatured: true
  },
  {
    id: 'pc-as24',
    name: 'ProCapture AeroStand 2.4m Heavy Duty Light Stand',
    serialNumber: 'PC-AS24-4411',
    price: 18000,
    quantityInStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop',
    category: 'Stands',
    description: 'Solid aluminum air-cushioned light stand extending up to 2.4 meters. Built to safely absorb impacts and prevent heavy lights or modifiers from crashing down. Engineered with strong ergonomic locking levers.',
    features: [
      'Pneumatic air-cushioning for safe adjustments',
      'Collapsible 3-section heavy duty central column',
      'Standard 1/4" to 3/8" spigot adapter stud',
      'Supports loads up to 8.5kg'
    ],
    isFeatured: false
  }
];
