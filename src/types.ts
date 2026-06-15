/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  serialNumber: string;
  price: number;
  quantityInStock: number;
  imageUrl: string;
  category: string;
  description: string;
  features: string[]; // Specs list
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: {
    name: string;
    serialNumber: string;
    quantity: number;
    price: number;
  }[];
  totalCost: number;
  customerName?: string;
  status: 'Pending' | 'Shipped' | 'Completed';
  viaWhatsApp: boolean;
}

export interface AdZone {
  id: string;
  name: string;
  format: 'Banner 728x90' | 'Banner 320x50' | 'Square 300x250' | 'Native';
  description: string;
  isActive: boolean;
  htmlCode?: string; // AdSterra embed code if owner puts real code
}

export interface AdStats {
  views: number;
  clicks: number;
  earnings: number;
}
