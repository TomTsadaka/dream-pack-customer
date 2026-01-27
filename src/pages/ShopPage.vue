<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filters -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Search -->
          <div class="flex-1">
            <input
              v-model="productsStore.filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Search products..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <!-- Category Filter -->
          <select
            v-model="selectedCategory"
            @change="handleSelectChange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            <option
              v-for="category in productsStore.categories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>

          <!-- Sort -->
          <select
            v-model="productsStore.filters.sort_by"
            @change="handleSortChange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Name</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Rating</option>
            <option value="soldCount">Most Popular</option>
          </select>
        </div>
      </div>

      <!-- Mobile Category Dropdown -->
      <div class="lg:hidden w-full mb-4">
        <div class="relative">
          <button
            @click="showMobileCategories = !showMobileCategories"
            class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex justify-between items-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span>{{ selectedCategory || 'All Categories' }}</span>
            <svg 
              class="h-5 w-5 text-gray-400 transition-transform"
              :class="{ 'rotate-180': showMobileCategories }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Mobile Category Menu -->
          <div 
            v-if="showMobileCategories"
            class="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            <button
              @click="handleMobileCategorySelect('')"
              class="block w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
            >
              All Categories
            </button>
            <button
              v-for="category in productsStore.categories"
              :key="category.id"
              @click="handleMobileCategorySelect(category.name)"
              class="block w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div class="flex justify-between items-center">
                <span>{{ category.name }}</span>
                <span class="text-sm text-gray-500">({{ category.product_count }})</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Debug Panel (Mock Mode Only) -->
      <!-- <div v-if="isMockMode" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 class="font-semibold text-yellow-800 mb-2">🐛 Debug Panel (Mock Mode)</h3>
        <div class="text-sm space-y-1">
          <p><strong>Total Products Loaded:</strong> {{ productsStore.products.length }}</p>
          <p><strong>Active Filters:</strong></p>
          <ul class="ml-4">
            <li>Colors: {{ selectedColors.join(', ') || 'None' }}</li>
            <li>Sizes: {{ selectedSizes.join(', ') || 'None' }}</li>
            <li>Pack Sizes: {{ selectedPackSizes.join(', ') || 'None' }}</li>
            <li>Category: {{ selectedCategory || 'None' }}</li>
          </ul>
          <p><strong>Results After Filtering:</strong> {{ productsStore.filteredProducts.length }}</p>
        </div>
      </div> -->

      <!-- Alert Banner for Empty Results -->
      <div v-if="productsStore.filteredProducts.length === 0 && productsStore.products.length > 0" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-red-800">No products match current filters</h3>
            <p class="text-red-600 text-sm mt-1">
              Mock mode: {{ isMockMode ? 'true' : 'false' }}
            </p>
          </div>
          <button
            @click="resetAllFilters"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- Alert Banner for No Products -->
      <div v-if="productsStore.products.length === 0" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 class="font-semibold text-red-800">No products returned</h3>
        <p class="text-red-600 text-sm mt-1">
          Mock mode: {{ isMockMode ? 'true' : 'false' }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Category Sidebar -->
        <div class="hidden lg:block w-64">
          <CategorySideNav
            :categories="productsStore.categories"
            @category-changed="handleCategoryChanged"
            @price-filter-changed="handlePriceFilterChanged"
          />
        </div>
        
        <!-- Products Grid -->
        <div class="lg:col-span-3">
          <!-- Results Count -->
          <div class="mb-4">
            <p class="text-gray-600">
              Showing {{ productsStore.pagination.total }} products
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="productsStore.loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>

          <!-- Products Grid -->
          <div v-else-if="productsStore.filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in productsStore.filteredProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddToCart"
            />
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-12">
            <p class="text-gray-500 text-lg">No products found</p>
            <button
              @click="clearAllFilters"
              class="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="!productsStore.loading && productsStore.filteredProducts.length > 0"
            :current-page="productsStore.pagination.currentPage"
            :last-page="productsStore.pagination.lastPage"
            @page-changed="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import ProductCard from '@/components/ProductCard.vue';
import CategorySideNav from '@/components/CategorySideNav.vue';
import Pagination from '@/components/Pagination.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();

const selectedCategory = ref('');
const showMobileCategories = ref(false);
const selectedColors = ref<string[]>([]);
const selectedSizes = ref<string[]>([]);
const selectedPackSizes = ref<number[]>([]);
let searchTimeout: number;

// Computed property for mock mode visibility
const isMockMode = computed(() => import.meta.env.VITE_USE_MOCKS === 'true');

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    productsStore.fetchProducts(1);
  }, 500);
};

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category;
  productsStore.setFilters({ category });
  productsStore.fetchProducts(1);
  
  // Update URL maintaining search query
  const query = { ...route.query };
  if (category) {
    query.category = category.toLowerCase();
  } else {
    delete query.category;
  }
  // Keep search query if it exists
  if (productsStore.filters.search) {
    query.q = productsStore.filters.search;
  }
  router.replace({ query });
};

const handleSelectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  handleCategoryChange(target.value);
};

const handleMobileCategorySelect = (category: string) => {
  selectedCategory.value = category;
  productsStore.setFilters({ category });
  productsStore.fetchProducts(1);
  showMobileCategories.value = false;
  
  // Update URL maintaining other filters
  const query = { ...route.query };
  if (category) {
    query.category = category.toLowerCase();
  } else {
    delete query.category;
  }
  router.replace({ query });
};

const handlePageChange = (page: number) => {
  productsStore.fetchProducts(page);
  
  // Update URL
  router.replace({ query: { ...route.query, page: page.toString() } });
};

const handleSortChange = () => {
  productsStore.fetchProducts(1);
};

const handleAddToCart = (product: any, variant: any) => {
  cartStore.addToCart(product, variant);
};

const handleCategoryChanged = (category: string) => {
  handleCategoryChange(category);
};

const handlePriceFilterChanged = (priceRange: { min: number; max: number }) => {
  productsStore.setFilters({ minPrice: priceRange.min, maxPrice: priceRange.max });
  productsStore.fetchProducts(1);
};

const clearAllFilters = () => {
  selectedCategory.value = '';
  selectedColors.value = [];
  selectedSizes.value = [];
  selectedPackSizes.value = [];
  productsStore.resetFilters();
  productsStore.fetchProducts(1);
  router.replace({ query: {} });
};

const resetAllFilters = () => {
  clearAllFilters();
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative') && showMobileCategories.value) {
    showMobileCategories.value = false;
  }
};

// Initialize from URL query parameters
onMounted(async () => {
  await productsStore.fetchCategories();
  
  // Prepare all filters from URL first
  const filtersToUpdate: any = {};
  
  if (route.query.category) {
    selectedCategory.value = route.query.category as string;
    filtersToUpdate.category = route.query.category as string;
  }
  
  if (route.query.q) {
    filtersToUpdate.search = route.query.q as string;
  }
  
  // Handle color filters from URL
  if (route.query.colors) {
    const colors = (route.query.colors as string).split(',').map(c => c.trim()).filter(Boolean);
    selectedColors.value = colors;
    filtersToUpdate.colors = colors;
  }
  
  // Handle size filters from URL
  if (route.query.sizes) {
    const sizes = (route.query.sizes as string).split(',').map(s => s.trim()).filter(Boolean);
    selectedSizes.value = sizes;
    filtersToUpdate.sizes = sizes;
  }
  
  // Handle pack size filters from URL (convert strings to numbers)
  if (route.query.packs) {
    const packSizes = (route.query.packs as string).split(',')
      .map(p => parseInt(p.trim()))
      .filter(p => !isNaN(p));
    selectedPackSizes.value = packSizes;
    filtersToUpdate.packSizes = packSizes;
  }
  
  // Apply all filters to store at once
  if (Object.keys(filtersToUpdate).length > 0) {
    productsStore.setFilters(filtersToUpdate);
  }
  
  const page = parseInt(route.query.page as string) || 1;
  await productsStore.fetchProducts(page);
  
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for route changes
watch(
  () => route.query,
  async (newQuery) => {
    if (newQuery.category !== selectedCategory.value) {
      selectedCategory.value = newQuery.category as string || '';
      productsStore.setFilters({ category: newQuery.category as string || '' });
    }
    
    if (newQuery.q !== productsStore.filters.search) {
      productsStore.setFilters({ search: newQuery.q as string || '' });
    }
    
    // Handle color filter changes
    if (newQuery.colors) {
      const colors = (newQuery.colors as string).split(',').map(c => c.trim()).filter(Boolean);
      if (JSON.stringify(colors) !== JSON.stringify(selectedColors.value)) {
        selectedColors.value = colors;
        productsStore.setFilters({ colors });
      }
    } else if (selectedColors.value.length > 0) {
      selectedColors.value = [];
      productsStore.setFilters({ colors: [] });
    }
    
    // Handle size filter changes
    if (newQuery.sizes) {
      const sizes = (newQuery.sizes as string).split(',').map(s => s.trim()).filter(Boolean);
      if (JSON.stringify(sizes) !== JSON.stringify(selectedSizes.value)) {
        selectedSizes.value = sizes;
        productsStore.setFilters({ sizes });
      }
    } else if (selectedSizes.value.length > 0) {
      selectedSizes.value = [];
      productsStore.setFilters({ sizes: [] });
    }
    
    // Handle pack size filter changes
    if (newQuery.packs) {
      const packSizes = (newQuery.packs as string).split(',')
        .map(p => parseInt(p.trim()))
        .filter(p => !isNaN(p));
      if (JSON.stringify(packSizes) !== JSON.stringify(selectedPackSizes.value)) {
        selectedPackSizes.value = packSizes;
        productsStore.setFilters({ packSizes });
      }
    } else if (selectedPackSizes.value.length > 0) {
      selectedPackSizes.value = [];
      productsStore.setFilters({ packSizes: [] });
    }
    
    const page = parseInt(newQuery.page as string) || 1;
    await productsStore.fetchProducts(page);
  }
);
</script>