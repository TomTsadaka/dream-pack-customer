export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  variantId: string;
  color: string;
  colorHex?: string;
  size: string;
  sizeId?: string | number;
  packSize: number;
  packSizeId?: string | number;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  image?: string;
  attributes?: { [key: string]: string };
}

export interface ProductCategory {
  id: number;
  categoryName: string;
  description: string;
}

export interface ProductAttribute {
  id: string | number;
  name: string;
  hex?: string;
  value: string | number;
  label?: string;
  image_url?: string;
}

// Helper type for options to maintain backward compatibility
export type ProductOptions = {
  colors?: string[] | ProductAttribute[];
  sizes?: string[] | ProductAttribute[];
  pcsPerPack?: number[] | ProductAttribute[];
}

export interface ProductCategory {
  parent: string;  // e.g., "Flexible Packaging", "Rigid Packaging", etc.
  tag: string;      // e.g., "Bubble Wrap", "Corrugated Boxes", etc.
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  baseDescription: string;
  category: ProductCategory;
  rating: number;
  soldCount: number;
  image?: string;
  price?: number;
  salePrice?: number;
  // Backward compatibility - optional simple arrays
  colors?: string[];
  sizes?: string[];
  pcsPerPack?: number[];
  // Required structure - detailed objects for hex/images
  options?: {
    colors?: (string[] | ProductAttribute[]);
    sizes?: (string[] | ProductAttribute[]);
    pcsPerPack?: (number[] | ProductAttribute[]);
  };
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
  // Additional fields for category structure
  parent?: string;
  tag?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  product_count: number;
}

export interface CartItem {
  id: number;
  productId: number;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
  };
  items: {
    product_id: number;
    variant_id: string;
    product_name: string;
    variant_name: string;
    quantity: number;
    price: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface ShopFilters {
  search?: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  packSizes?: number[];
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}