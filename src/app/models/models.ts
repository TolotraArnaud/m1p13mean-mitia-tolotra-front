// models/category.model.ts
export interface Category {
  _id?: string;
  nom: string;
  type: 'shop' | 'product';
  isValidated?: boolean;
}

// models/shop.model.ts
export interface Shop {
  _id?: string;
  nom: string;
  description?: string;
  categorie: Category | string;
  owner: any;
  isActivated?: boolean;
  isActive?: boolean;
  createdAt?: string;
  topProducts?: Product[];
}

// models/product.model.ts
export interface Product {
  _id?: string;
  nom: string;
  description?: string;
  prix: number;
  stock?: number;
  shop: Shop | string;
  image?: string;
  poid?: number;
  popular?: boolean;
  promo?: number;
  isStockable?: boolean;
  manualAvailability?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
}

// models/booking.model.ts
export interface BookingItem {
  product: Product | string;
  name?: string;
  prix?: number;
  quantity: number;
}

export interface Booking {
  _id?: string;
  user?: any;
  shop: Shop | string;
  items: BookingItem[];
  type: 'collect' | 'try';
  status?: 'pending' | 'confirmed' | 'completed' | 'expired' | 'cancelled';
  pickupCode?: string;
  totalAmount?: number;
  expiresAt?: string;
  createdAt?: string;
}

// Cart item (local, pas en base)
export interface CartItem {
  product: Product;
  quantity: number;
}

// models/stats.model.ts
export interface GlobalStats {
  users: number;
  shops: number;
  products: number;
  platformValue: number;
  averageProductsPerShop: string;
}

export interface InventoryStats {
  totalProduits: number;
  valeurTotaleStock: number;
  ruptures: number;
}
