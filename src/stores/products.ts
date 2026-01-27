import { defineStore } from 'pinia';
import type { Product, Category, PaginatedResponse, ShopFilters, ProductVariant, ProductAttribute } from '@/types';
import { productService } from '@/services/productService';

interface ProductsState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  currentVariant: ProductVariant | null;
  loading: boolean;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  filters: {
    search?: string;
    category?: string;
    colors?: string[];
    sizes?: string[];
    packSizes?: number[];
    minPrice?: number;
    maxPrice?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  };
  availableOptions: {
    colors: string[];
    sizes: string[];
    packSizes: number[];
  };
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    categories: [],
    featuredProducts: [],
    currentProduct: null,
    currentVariant: null,
    loading: false,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 12,
      total: 0
    },
    filters: {
      search: '',
      category: '',
      colors: [],
      sizes: [],
      packSizes: [],
      sort_by: 'name',
      sort_order: 'asc'
    },
    availableOptions: {
      colors: [],
      sizes: [],
      packSizes: []
    }
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = state.products;
      
      if (state.filters.search) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(state.filters.search!.toLowerCase()) ||
          product.baseDescription.toLowerCase().includes(state.filters.search!.toLowerCase())
        );
      }
      
      if (state.filters.category) {
        filtered = filtered.filter(product => 
          product.category.parent === state.filters.category
        );
      }
      
      if (state.filters.colors && state.filters.colors.length > 0) {
        filtered = filtered.filter(product => 
          state.filters.colors!.some(color => 
            product.options?.colors?.some(opt => 
              typeof opt === 'string' ? opt === color : opt.name === color
            )
          )
        );
      }
      
      if (state.filters.sizes && state.filters.sizes.length > 0) {
        filtered = filtered.filter(product => 
          state.filters.sizes!.some(size => 
            product.options?.sizes?.some(opt => 
              typeof opt === 'string' ? opt === size : opt.value === size
            )
          )
        );
      }
      
      if (state.filters.packSizes && state.filters.packSizes.length > 0) {
        filtered = filtered.filter(product => 
          state.filters.packSizes!.includes(product.variants?.[0]?.packSize || 1)
        );
      }
      
      // Price range filtering using VARIANT prices
      if (state.filters.minPrice !== undefined || state.filters.maxPrice !== undefined) {
        const minPrice = state.filters.minPrice || 0;
        const maxPrice = state.filters.maxPrice || Infinity;
        
        filtered = filtered.filter(product => {
          const variantPrices = product.variants.map(v => v.salePrice && v.salePrice > 0 && v.salePrice < v.price ? v.salePrice : v.price);
          const validPrices = variantPrices.filter(p => Number.isFinite(p) && p > 0);
          
          return validPrices.length > 0 && validPrices.some(price => price >= minPrice && price <= maxPrice);
        });
      }
      
      return filtered;
    },
    
    getProductById: (state) => (id: number) => {
      return state.products.find(product => product.id === id) || state.currentProduct;
    },
    
    getVariantById: (state) => (productId: number, variantId: string) => {
      const product = state.products.find(p => p.id === productId) || state.currentProduct;
      if (!product) return null;
      return product.variants.find(v => v.variantId === variantId) || null;
    }
  },

  actions: {
    async fetchProducts(page = 1) {
      try {
        this.loading = true;
        const response = await productService.getProducts({
          page,
          search: this.filters.search,
          category: this.filters.category,
          colors: this.filters.colors,
          sizes: this.filters.sizes,
          packSizes: this.filters.packSizes,
          sort_by: this.filters.sort_by,
          sort_order: this.filters.sort_order
        });
        
        this.products = response.data;
        this.pagination = {
          currentPage: response.current_page,
          lastPage: response.last_page,
          perPage: response.per_page,
          total: response.total
        };
        
        // Update available options from filtered products
        this.updateAvailableOptions();
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchFeaturedProducts() {
      try {
        this.loading = true;
        this.featuredProducts = await productService.getFeaturedProducts();
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProduct(id: number) {
      try {
        this.loading = true;
        const product = await productService.getProduct(id);
        this.currentProduct = product;
        
        // Set initial variant from URL params or first available
        if (product) {
          const urlParams = new URLSearchParams(window.location.search);
          const urlColor = urlParams.get('color');
          const urlSize = urlParams.get('size');
          const urlPack = urlParams.get('pack');
          
          if (urlColor && urlSize && urlPack) {
            const variantId = `${urlColor}-${urlSize}-${urlPack}`;
            const variant = product.variants.find(v => v.variantId === variantId);
            if (variant && variant.stock > 0) {
              this.currentVariant = variant;
            } else {
              this.currentVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
            }
          } else {
            this.currentVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
          }
        }
        
        return product;
      } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    setCurrentVariant(variant: ProductVariant) {
      this.currentVariant = variant;
    },

    setFilters(filters: Partial<ShopFilters>) {
      this.filters = { ...this.filters, ...filters };
    },

    resetFilters() {
      this.filters = {
        search: '',
        category: '',
        colors: [],
        sizes: [],
        packSizes: [],
        sort_by: 'name',
        sort_order: 'asc'
      };
    },

    updateAvailableOptions() {
      // Extract all unique options from filtered products
      const colors = new Set<string>();
      const sizes = new Set<string>();
      const packSizes = new Set<number>();
      
      this.filteredProducts.forEach(product => {
        // Ensure product.options exists
        if (!product.options) return;
        
        // Handle both old string arrays and new ProductAttribute arrays
        if (Array.isArray(product.options.colors)) {
          (product.options.colors as string[]).forEach(color => colors.add(color));
        } else if (Array.isArray(product.options.sizes)) {
          (product.options.sizes as string[]).forEach(size => sizes.add(size));
        } else if (Array.isArray(product.options.pcsPerPack)) {
          (product.options.pcsPerPack as number[]).forEach(pack => packSizes.add(pack));
        }
        
        // Handle new ProductAttribute arrays
        else {
          // Handle new format - detailed objects
          if (product.options.colors) {
            (product.options.colors as ProductAttribute[]).forEach(attr => {
              if (attr && attr.name) colors.add(attr.name);
              if (attr && attr.hex) {
                // Store hex separately for UI if available
                // We'll use attr.hex for swatches and attr.name for display
              }
            });
          } else if (product.options.sizes) {
            (product.options.sizes as ProductAttribute[]).forEach(attr => {
              if (attr && attr.name) sizes.add(attr.name);
              if (attr && attr.id) {
                // Use value for variant matching if available
              }
            });
          } else if (product.options.pcsPerPack) {
            (product.options.pcsPerPack as ProductAttribute[]).forEach(attr => {
              if (attr && attr.value !== undefined) packSizes.add(Number(attr.value));
              if (attr && attr.id) {
                // Use value for variant matching if available
              }
            });
          }
        }
      });
      
      this.availableOptions = {
        colors: Array.from(colors),
        sizes: Array.from(sizes),
        packSizes: Array.from(packSizes)
      };
    },

    async fetchCategories() {
      try {
        this.categories = await productService.getCategories();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
  }
});