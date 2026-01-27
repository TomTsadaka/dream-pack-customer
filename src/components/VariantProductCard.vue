<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Product Image -->
    <div class="relative">
      <img
        :src="displayVariant.images?.[0] || 'https://picsum.photos/seed/placeholder/400/400.jpg'"
        :alt="product.name"
        class="w-full h-48 object-cover cursor-pointer"
        @click="$emit('open-gallery', displayVariant.images || [])"
        @error="($event.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/400/400.jpg'"
      />
      
      <!-- Sale Badge -->
      <div
        v-if="discountPercent !== null"
        class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold"
      >
        {{ discountPercent }}% OFF
      </div>

      <!-- Stock Badge -->
      <div
        v-if="displayVariant.stock <= 10"
        class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"
      >
        Only {{ displayVariant.stock }} left
      </div>

      <!-- Variant Match Badge -->
      <div
        v-if="showVariantMatch"
        class="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold"
      >
        Color: {{ selectedColor }}
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

      <!-- Price Range or Single Price -->
      <div class="flex items-center gap-2 mb-3">
        <div v-if="hasPriceRange">
          <span class="text-lg font-bold text-orange-500">From {{ formatMoney(minPrice) }}</span>
          <span v-if="maxPrice !== minPrice" class="text-sm text-gray-500"> - {{ formatMoney(maxPrice) }}</span>
        </div>
        <div v-else>
          <span v-if="displayVariant.salePrice && displayVariant.salePrice < displayVariant.price" class="text-lg font-bold text-orange-500">
            {{ formatMoney(displayVariant.salePrice) }}
          </span>
          <span :class="displayVariant.salePrice && displayVariant.salePrice < displayVariant.price ? 'text-lg text-gray-400 line-through' : 'text-lg font-bold'">
            {{ formatMoney(displayVariant.price) }}
          </span>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click="handleAddToCart"
        :disabled="displayVariant.stock === 0"
        class="w-full bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ displayVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product, ProductVariant } from '@/types';

interface Props {
  product: Product;
  selectedFilters?: {
    colors?: string[];
    sizes?: string[];
    packSizes?: number[];
  };
}

const props = withDefaults(defineProps<Props>(), {
  selectedFilters: () => ({})
});

const emit = defineEmits<{
  'open-gallery': [images: string[]];
  'add-to-cart': [product: Product, variant: ProductVariant];
}>();

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

// Find the best matching variant for the current filters
const displayVariant = computed((): ProductVariant => {
  const variants = props.product.variants;
  
  // If no filters selected, return first available variant
  if (!props.selectedFilters.colors?.length && !props.selectedFilters.sizes?.length && !props.selectedFilters.packSizes?.length) {
    return variants.find(v => v.stock > 0) || variants[0];
  }
  
  // Find variants that match all selected filters (case-insensitive for colors/sizes)
  const matchingVariants = variants.filter(variant => {
    const colorMatch = !props.selectedFilters.colors?.length || 
      props.selectedFilters.colors.some(color => color.toLowerCase() === variant.color.toLowerCase());
    const sizeMatch = !props.selectedFilters.sizes?.length || 
      props.selectedFilters.sizes.some(size => size.toLowerCase() === variant.size.toLowerCase());
    const packMatch = !props.selectedFilters.packSizes?.length || props.selectedFilters.packSizes.includes(variant.packSize);
    
    return colorMatch && sizeMatch && packMatch;
  });
  
  // Return first matching in-stock variant, or first matching variant if none in stock
  const inStockMatch = matchingVariants.find(v => v.stock > 0);
  return inStockMatch || matchingVariants[0] || variants.find(v => v.stock > 0) || variants[0];
});

// Calculate discount percentage for display variant
const discountPercent = computed(() => 
  getDiscountPercent(displayVariant.value.price, displayVariant.value.salePrice)
);

// Check if we have a price range across variants
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

const showVariantMatch = computed(() => {
  return (props.selectedFilters.colors?.length || 0) > 0 && 
         (props.selectedFilters.sizes?.length || 0) > 0 && 
         displayVariant.value?.color;
});

const selectedColor = computed(() => {
  return props.selectedFilters.colors?.[0] || '';
});

const handleAddToCart = () => {
  emit('add-to-cart', props.product, displayVariant.value);
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