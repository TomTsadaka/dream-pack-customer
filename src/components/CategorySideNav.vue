<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <h3 class="font-semibold text-lg mb-4">Categories</h3>
    
    <!-- All Categories Option -->
    <div class="mb-6">
      <label class="flex items-center gap-2 cursor-pointer hover:text-blue-600">
        <input
          type="radio"
          name="category"
          :value="selectedCategory"
          @change="handleCategoryChange"
          class="text-blue-600"
        />
        <span>All Categories</span>
      </label>
    </div>

    <div class="border-t pt-4">
      <h3 class="font-semibold text-lg mb-4">Shop by Category</h3>
      
      <!-- Category List -->
      <div class="space-y-2">
        <label
          v-for="category in categories"
          :key="category.id"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50 border-blue-300': selectedCategory?.parent === category.parent }"
        >
          <input
            type="radio"
            :value="category.parent"
            v-model="selectedCategory"
            @change="handleCategoryChange"
            class="text-blue-600"
          />
          <div>
            <div class="font-medium">{{ category.categoryName }}</div>
            <div class="text-sm text-gray-600">{{ category.description }}</div>
          </div>
        </label>
      </div>
    </div>

    <!-- Price Range Filter -->
    <div class="border-t pt-4">
      <h3 class="font-semibold text-lg mb-4">Price Range</h3>
      
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            v-model="minPrice"
            @input="handlePriceFilterChange"
            placeholder="0"
            min="0"
            step="0.01"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            v-model="maxPrice"
            @input="handlePriceFilterChange"
            placeholder="1000"
            min="0"
            step="0.01"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="flex gap-2">
          <button
            @click="applyPriceFilter"
            :disabled="!isValidPriceRange"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
          
          <button
            @click="clearPriceFilter"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PACKAGING_CATEGORIES } from '@/mocks/products';
import type { ProductCategory } from '@/types';

interface Props {
  categories?: ProductCategory[];
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => PACKAGING_CATEGORIES
});

type Emit = {
  (e: "categoryChanged", category: ProductCategory | null): void
  (e: "priceFilterChanged", payload: { min: number | null; max: number | null }): void
}

const emit = defineEmits<Emit>();

const route = useRoute();
const router = useRouter();

// State
const selectedCategory = ref<ProductCategory | null>(null);
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);

// Computed
const isValidPriceRange = computed(() => {
  if (minPrice.value !== null && maxPrice.value !== null) {
    return minPrice.value >= 0 && maxPrice.value > minPrice.value;
  }
  return true;
});

// Initialize from route
const initializeFromRoute = () => {
  if (route.query.category) {
    const category = props.categories.find(c => c.parent === route.query.category);
    if (category) {
      selectedCategory.value = category;
    }
  }
  
  if (route.query.min) {
    minPrice.value = parseFloat(route.query.min as string) || null;
  }
  
  if (route.query.max) {
    maxPrice.value = parseFloat(route.query.max as string) || null;
  }
};

// Event handlers
const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const category = props.categories.find(c => c.parent === target.value);
  selectedCategory.value = category || null;
  
  // Update URL
  updateQuery();
  emit('categoryChanged', category || null);
};

const handlePriceFilterChange = () => {
  updateQuery();
};

const applyPriceFilter = () => {
  if (isValidPriceRange.value) {
    updateQuery();
    emit('priceFilterChanged', { min: minPrice.value, max: maxPrice.value });
  }
};

const clearPriceFilter = () => {
  minPrice.value = null;
  maxPrice.value = null;
  updateQuery();
  emit('priceFilterChanged', { min: null, max: null });
};

const updateQuery = () => {
  const query: any = {};
  
  if (selectedCategory.value) {
    query.category = selectedCategory.value.parent;
  }
  
  if (minPrice.value !== null) {
    query.min = minPrice.value.toString();
  }
  
  if (maxPrice.value !== null) {
    query.max = maxPrice.value.toString();
  }
  
  router.replace({ query });
};

// Initialize on mount
initializeFromRoute();
</script>