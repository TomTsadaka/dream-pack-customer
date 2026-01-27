<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Product Image - Clickable for Quick View -->
    <div class="relative group">
      <button
        @click="openQuickView"
        class="w-full h-48 overflow-hidden"
      >
        <img
          :src="activeVariant.images?.[0] || 'https://picsum.photos/seed/placeholder/400/400.jpg'"
          :alt="product.name"
          class="w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer"
          @error="($event.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/400/400.jpg'"
        />
      </button>
      
      <!-- Quick View Icon Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
      
      <!-- Sale Badge -->
      <div
        v-if="discountPercent !== null"
        class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold z-10"
      >
        {{ discountPercent }}% OFF
      </div>

      <!-- Stock Badge -->
      <div
        v-if="activeVariant.stock <= 5"
        class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10"
      >
        Only {{ activeVariant.stock }} left
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-3">
      <!-- Name with 2-line clamp -->
      <h3 class="font-medium text-sm mb-2 line-clamp-2 h-10 leading-5">{{ product.name }}</h3>

      <!-- Rating Stars and Sold Count -->
      <div class="flex items-center gap-2 mb-2">
        <div class="flex items-center">
          <div class="flex">
            <span
              v-for="i in 5"
              :key="i"
              :class="[
                'text-xs',
                i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
              ]"
            >
              ★
            </span>
          </div>
          <span class="ml-1 text-xs text-gray-600">({{ product.rating }})</span>
        </div>
        <span class="text-gray-400 text-xs">•</span>
        <span class="text-xs text-gray-600">{{ product.soldCount }} sold</span>
      </div>

      <!-- Price -->
      <div class="flex items-center gap-2 mb-3">
        <div v-if="hasPriceRange">
          <span class="text-lg font-bold text-orange-500">From {{ formatMoney(minPrice) }}</span>
          <span v-if="maxPrice !== minPrice" class="text-sm text-gray-500"> - {{ formatMoney(maxPrice) }}</span>
        </div>
        <div v-else>
          <span v-if="activeVariant.salePrice && activeVariant.salePrice < activeVariant.price" class="text-lg font-bold text-orange-500">
            {{ formatMoney(activeVariant.salePrice) }}
          </span>
          <span :class="activeVariant.salePrice && activeVariant.salePrice < activeVariant.price ? 'text-lg text-gray-400 line-through' : 'text-lg font-bold'">
            {{ formatMoney(activeVariant.price) }}
          </span>
        </div>
      </div>

      <!-- Minimal Color Preview (optional) -->
      <div v-if="normalizedOptions.colors.length > 1" class="mb-3 flex items-center gap-1">
        <span class="text-xs text-gray-500 mr-2">Colors:</span>
        <div
          v-for="color in normalizedOptions.colors.slice(0, 4)"
          :key="color.id"
          class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
          :style="{ backgroundColor: color.hex }"
          :title="color.name"
        />
        <span v-if="normalizedOptions.colors.length > 4" class="text-xs text-gray-500">+{{ normalizedOptions.colors.length - 4 }}</span>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click="openQuickView"
        class="w-full bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        View Options
      </button>
    </div>

    <!-- Quick View Modal -->
    <QuickViewModal
      :is-open="isQuickViewOpen"
      :product="product"
      @close="closeQuickView"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QuickViewModal from './QuickViewModal.vue';
import type { Product, ProductVariant, ProductAttribute } from '@/types';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'add-to-cart': [product: Product, variant: ProductVariant];
}>();

// Quick View modal state
const isQuickViewOpen = ref(false);
const selectedColorName = ref('');

// Normalize options to always be ProductAttribute arrays
const normalizedOptions = computed(() => {
  const normalizeArray = (arr: any[] | undefined): ProductAttribute[] => {
    if (!arr || !Array.isArray(arr)) return [];
    
    return arr.map((item, index) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return {
          id: String(item),
          name: String(item),
          value: item
        };
      }
      return item as ProductAttribute;
    });
  };

  return {
    colors: normalizeArray(props.product.options?.colors),
    sizes: normalizeArray(props.product.options?.sizes),
    pcsPerPack: normalizeArray(props.product.options?.pcsPerPack)
  };
});

// Initialize selected color to first available color
if (normalizedOptions.value.colors.length > 0 && !selectedColorName.value) {
  selectedColorName.value = normalizedOptions.value.colors[0].name;
}

// Compute active variant based on selected color
const activeVariant = computed((): ProductVariant => {
  if (!props.product.variants || props.product.variants.length === 0) {
    console.warn(`Product ${props.product.id} (${props.product.name}) has no variants`);
    return {
      variantId: 'fallback',
      color: 'N/A',
      size: 'N/A',
      packSize: 1,
      sku: 'N/A',
      price: 0,
      stock: 0,
      images: ['https://picsum.photos/seed/placeholder/400/400.jpg']
    };
  }

  // Filter variants by selected color
  let matchingVariants = props.product.variants;
  if (selectedColorName.value) {
    matchingVariants = matchingVariants.filter(v => 
      v.color.toLowerCase() === selectedColorName.value.toLowerCase()
    );
  }

  // Prefer in-stock variants
  const inStockVariant = matchingVariants.find(v => v.stock > 0);
  if (inStockVariant) {
    return inStockVariant;
  }

  // Fallback to first matching variant
  if (matchingVariants.length > 0) {
    return matchingVariants[0];
  }

  // Fallback to first available variant
  return props.product.variants[0];
});

// Price calculation helpers with NaN protection
const formatMoney = (amount: number | undefined | null): string => {
  const num = Number(amount);
  if (!Number.isFinite(num) || num < 0) {
    return '₱0.00';
  }
  return `₱${num.toFixed(2)}`;
};

const getDiscountPercent = (price: number, salePrice: number | undefined): number | null => {
  const priceNum = Number(price);
  const salePriceNum = Number(salePrice);
  
  if (!Number.isFinite(priceNum) || priceNum <= 0) return null;
  if (!Number.isFinite(salePriceNum) || salePriceNum >= priceNum) return null;
  
  return Math.round(((priceNum - salePriceNum) / priceNum) * 100);
};

const discountPercent = computed(() => 
  getDiscountPercent(activeVariant.value.price, activeVariant.value.salePrice)
);

// Calculate price range across all variants
const minPrice = computed(() => {
  if (!props.product.variants || props.product.variants.length === 0) return 0;
  
  const prices = props.product.variants
    .map(v => v.salePrice && v.salePrice > 0 ? v.salePrice : v.price)
    .filter(n => Number.isFinite(n) && n > 0);
  
  return prices.length > 0 ? Math.min(...prices) : 0;
});

const maxPrice = computed(() => {
  if (!props.product.variants || props.product.variants.length === 0) return 0;
  
  const prices = props.product.variants
    .map(v => v.salePrice && v.salePrice > 0 ? v.salePrice : v.price)
    .filter(n => Number.isFinite(n) && n > 0);
  
  return prices.length > 0 ? Math.max(...prices) : 0;
});

const hasPriceRange = computed(() => {
  return minPrice.value !== maxPrice.value && minPrice.value > 0 && maxPrice.value > 0;
});

// Quick View modal handlers
const openQuickView = () => {
  isQuickViewOpen.value = true;
};

const closeQuickView = () => {
  isQuickViewOpen.value = false;
};

// Legacy add to cart handler (for backwards compatibility)
const handleAddToCart = () => {
  emit('add-to-cart', props.product, activeVariant.value);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>