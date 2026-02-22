import { api } from './apiClient';
import type { Product, Category, PaginatedResponse, ShopFilters, ProductVariant, ApiCategoriesResponse } from '@/types';
import { mockProducts } from '@/mocks/products';
import { mockCategories } from '@/mocks/categories';

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

// Helper function to get variant price (salePrice takes precedence if valid)
const getVariantPrice = (variant: ProductVariant): number => {
  if (variant.salePrice && variant.salePrice > 0 && variant.salePrice < variant.price) {
    return variant.salePrice;
  }
  return variant.price;
};

export const productService = {
  async getProducts(params?: {
    page?: number;
    search?: string;
    category?: string;
    colors?: string[];
    sizes?: string[];
    packSizes?: number[];
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> {
    // IMPORTANT: Always use mock mode when VITE_USE_MOCKS=true, never call API
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      let filtered = [...mockProducts];
      
      // Search filter
      if (params?.search) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(params.search!.toLowerCase()) ||
product.baseDescription?.en.toLowerCase().includes(params.search!.toLowerCase()) ||
          product.baseDescription?.he.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      
      // Category filter (case-insensitive)
      if (params?.category) {
        filtered = filtered.filter(product => 
          product.category.parent?.toLowerCase() === params.category!.toLowerCase()
        );
      }
      
      // Variant filters - filter products that have at least one matching variant
      if (params?.colors?.length || params?.sizes?.length || params?.packSizes?.length) {
        filtered = filtered.filter(product => {
          return product.variants.some(variant => {
            const colorMatch = !params?.colors?.length || 
              params.colors.some(color => color.toLowerCase() === variant.color.toLowerCase());
            const sizeMatch = !params?.sizes?.length || 
              params.sizes.some(size => size.toLowerCase() === variant.size.toLowerCase());
            const packMatch = !params?.packSizes?.length || params.packSizes.includes(variant.packSize);
            return colorMatch && sizeMatch && packMatch;
          });
        });
      }
      
      // Sorting
      if (params?.sort_by) {
        filtered.sort((a, b) => {
          let aValue: any, bValue: any;
          
          if (params.sort_by === 'price') {
            // Use the minimum price from variants for sorting
            aValue = Math.min(...a.variants.map(v => getVariantPrice(v)));
            bValue = Math.min(...b.variants.map(v => getVariantPrice(v)));
          } else if (params.sort_by === 'rating') {
            aValue = a.rating;
            bValue = b.rating;
          } else if (params.sort_by === 'soldCount') {
            aValue = a.soldCount;
            bValue = b.soldCount;
          } else if (params.sort_by === 'name') {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
          } else {
            aValue = a[params.sort_by as keyof Product];
            bValue = b[params.sort_by as keyof Product];
          }
          
          // Handle string comparisons
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return params.sort_order === 'desc' 
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }
          
          // Handle numeric comparisons
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return params.sort_order === 'desc' 
              ? bValue - aValue
              : aValue - bValue;
          }
          
          return 0;
        });
      }
      
      const page = params?.page || 1;
      const perPage = 12;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      
      const result = {
        data: filtered.slice(startIndex, endIndex),
        current_page: page,
        last_page: Math.ceil(filtered.length / perPage),
        per_page: perPage,
        total: filtered.length
      };
      return result;
    }
    
    // Only call API if mock mode is explicitly false
    const response = await api.get<any>('/api/products', { params });
    
    // Defensively parse response - handle wrapped { data: {...} } or direct
    const apiData = response?.data ?? response;
    const payload = apiData?.data ?? apiData;
    
    const products = payload?.products ?? [];
    const paginationRaw = payload?.pagination ?? {};
    
    return {
      data: products,
      current_page: paginationRaw.current_page ?? paginationRaw.currentPage ?? 1,
      last_page: paginationRaw.last_page ?? paginationRaw.lastPage ?? 1,
      per_page: paginationRaw.per_page ?? paginationRaw.perPage ?? 12,
      total: paginationRaw.total ?? 0
    };
  },

  async getProduct(id: number): Promise<Product> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    }
    
    const response = await api.get<any>(`/api/products/${id}`);
    // Handle wrapped response { data: Product } or direct Product
    const payload = response?.data ?? response;
    return payload as Product;
  },

  async getVariantById(productId: number, variantId: string): Promise<ProductVariant | null> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const product = mockProducts.find(p => p.id === productId);
      if (!product) {
        return null;
      }
      
      return product.variants.find(v => v.variantId === variantId) || null;
    }
    
    return null; // API mode would handle this differently
  },

  async getFeaturedProducts(): Promise<Product[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      return mockProducts
        .filter(product => product.rating >= 4.5)
        .slice(0, 8);
    }
    
    const response = await api.get<any>('/api/products/featured');
    const payload = response?.data ?? response;
    if (Array.isArray(payload)) {
      return payload;
    }
    return (payload as any)?.data?.products ?? (payload as any)?.products ?? [];
  },

  async getCategories(): Promise<Category[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      return mockCategories;
    }
    
    const response = await api.get<any>('/api/categories');
    // Handle wrapped { success: true, data: [...] } or { data: [...] } or direct [...]
    // Also handle legacy format { categories: [...] }
    const payload = response?.data ?? response;
    if (Array.isArray(payload)) {
      return payload;
    }
    return (payload as any)?.categories ?? [];
  }
};