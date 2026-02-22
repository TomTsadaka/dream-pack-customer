import { api } from '@/services/apiClient';
import type { Product, Pagination } from '@/types';
import { mockProducts } from '@/mocks/products';

const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS).toLowerCase() === "true";

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

export async function fetchProducts(params: { page: number; limit: number; is_active: number }) {
  if (USE_MOCKS) {
    await simulateLatency();
    
    // Filter active products
    let filtered = mockProducts.filter(product => product.rating >= 4.0); // Basic active simulation
    
    // Apply pagination
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      pagination: {
        currentPage: params.page,
        lastPage: Math.ceil(filtered.length / params.limit),
        perPage: params.limit,
        total: filtered.length,
        hasMore: params.page < Math.ceil(filtered.length / params.limit)
      }
    };
  }
  
  // Call real API - pass params in { params } object for axios
  const response = await api.get<any>('/api/products', { params });
  
  // The API returns: { success: true, data: { products: [...], pagination: {...} } }
  // Axios wraps this in response.data
  const apiData = response?.data ?? response;
  const payload = apiData?.data ?? apiData;
  
  const products = Array.isArray(payload?.products) ? payload.products : [];
  const paginationRaw = payload?.pagination ?? {};
  
  return {
    products,
    pagination: {
      currentPage: paginationRaw.current_page ?? paginationRaw.currentPage ?? 1,
      lastPage: paginationRaw.last_page ?? paginationRaw.lastPage ?? 1,
      perPage: paginationRaw.per_page ?? paginationRaw.perPage ?? params.limit,
      total: paginationRaw.total ?? 0,
      hasMore: paginationRaw.has_more ?? paginationRaw.hasMore ?? false
    }
  };
}

export async function fetchProduct(id: number): Promise<Product> {
  if (USE_MOCKS) {
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
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  if (USE_MOCKS) {
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
}