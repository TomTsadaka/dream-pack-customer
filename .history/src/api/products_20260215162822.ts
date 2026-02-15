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
  
  // Call real API
  const response = await api.get<any>('/products', params);
  
  // Map pagination keys to camelCase
  const apiData = response.data;
  return {
    products: apiData.data.products,
    pagination: {
      currentPage: apiData.data.pagination.current_page,
      lastPage: apiData.data.pagination.last_page,
      perPage: apiData.data.pagination.per_page,
      total: apiData.data.pagination.total,
      hasMore: apiData.data.pagination.has_more
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
  
  const response = await api.get<Product>(`/api/products/${id}`);
  return response.data;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  if (USE_MOCKS) {
    await simulateLatency();
    
    return mockProducts
      .filter(product => product.rating >= 4.5)
      .slice(0, 8);
  }
  
  const response = await api.get<Product[]>('/products/featured');
  return response.data;
}