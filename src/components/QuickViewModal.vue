<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div 
        class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Close button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="grid md:grid-cols-2 gap-6 p-6">
          <!-- Left: Image Gallery -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
              <img
                :src="currentImage"
                :alt="product.name"
                class="w-full h-full object-cover"
                @error="($event.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/400/400.jpg'"
              />
              
              <!-- Stock Badge -->
              <div
                v-if="selectedVariant.stock <= 5"
                class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"
              >
                 Only {{ selectedVariant.stock }} left
              </div>
            </div>

            <!-- Thumbnail Gallery -->
            <div class="flex gap-2 overflow-x-auto pb-2">
              <button
                v-for="(image, index) in selectedVariant.images"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden',
                  currentImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                ]"
              >
                <img
                  :src="image"
                  :alt="`${product.name} ${index + 1}`"
                  class="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  @error="($event.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/80/80.jpg'"
                />
              </button>
            </div>
          </div>

          <!-- Right: Product Info & Variant Selection -->
          <div class="space-y-6">
            <!-- Product Name and Rating -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h2>
              
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <div class="flex items-center">
                  <div class="flex">
                    <span
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'text-sm',
                        i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      ]"
                    >
                      ★
                    </span>
                  </div>
                  <span class="ml-1">({{ product.rating }})</span>
                </div>
                <span>•</span>
                <span>{{ product.soldCount }} sold</span>
              </div>
              
              <!-- Product Description -->
              <div class="mt-3 text-sm text-gray-600 leading-relaxed">
                {{ product.baseDescription[settingsStore.locale] || product.baseDescription.en }}
              </div>
            </div>

            <!-- Price and SKU -->
            <div class="space-y-2">
              <div class="flex items-baseline gap-3">
                <span v-if="selectedVariant.salePrice && selectedVariant.salePrice < selectedVariant.price" class="text-2xl font-bold text-orange-500">
                  {{ formatMoney(selectedVariant.salePrice) }}
                </span>
                <span :class="selectedVariant.salePrice && selectedVariant.salePrice < selectedVariant.price ? 'text-lg text-gray-400 line-through' : 'text-2xl font-bold text-gray-900'">
                  {{ formatMoney(selectedVariant.price) }}
                </span>
              </div>
              
              <div class="text-sm text-gray-600">
                SKU: {{ selectedVariant.sku }}
              </div>
            </div>

            <!-- Variant Selectors -->
            <div class="space-y-4">
              <!-- Colors -->
              <div v-if="normalizedOptions.colors.length > 0">
                <h3 class="text-sm font-medium text-gray-900 mb-2">Color</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in normalizedOptions.colors"
                    :key="color.id"
                    @click="selectColor(color)"
                    :disabled="!isColorAvailable(color.name)"
                    :class="[
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedColorName === color.name ? 'border-orange-500 scale-110' : 'border-gray-300',
                      !isColorAvailable(color.name) ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
                    ]"
                    :style="{ backgroundColor: color.hex }"
                    :title="color.name"
                  >
                    <span v-if="selectedColorName === color.name" class="text-white text-xs">✓</span>
                  </button>
                </div>
              </div>

              <!-- Sizes -->
              <div v-if="normalizedOptions.sizes.length > 0">
                <h3 class="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in normalizedOptions.sizes"
                    :key="size.id"
                    @click="selectSize(size)"
                    :disabled="!isSizeAvailable(size.value)"
                    :class="[
                      'px-4 py-2 rounded-lg border transition-all font-medium',
                      selectedSizeValue === size.value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300 bg-white text-gray-700',
                      !isSizeAvailable(size.value) ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
                    ]"
                  >
                    {{ size.value }}
                  </button>
                </div>
              </div>

              <!-- Pcs per Pack -->
              <div v-if="normalizedOptions.pcsPerPack.length > 0">
                <h3 class="text-sm font-medium text-gray-900 mb-2">Quantity per Pack</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="pack in normalizedOptions.pcsPerPack"
                    :key="pack.id"
                    @click="selectPcsPerPack(pack)"
                    :disabled="!isPcsPerPackAvailable(pack.value)"
                    :class="[
                      'px-4 py-2 rounded-lg border transition-all font-medium text-sm',
                      selectedPcsPerPackValue === pack.value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300 bg-white text-gray-700',
                      !isPcsPerPackAvailable(pack.value) ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
                    ]"
                  >
                    {{ pack.label || `${pack.value} pcs/pack` }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Add to Cart and View Details -->
            <div class="space-y-3 pt-4 border-t">
              <button
                @click="handleAddToCart"
                :disabled="selectedVariant.stock === 0 || isAddingToCart"
                class="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <span v-if="isAddingToCart">Adding...</span>
                <span v-else-if="selectedVariant.stock === 0">Out of Stock</span>
                <span v-else>Add to Cart</span>
              </button>
              
              <!-- <RouterLink
                :to="`/product/${product.id}`"
                @click="closeModal"
                class="block w-full text-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Full Details
              </RouterLink> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useToastStore } from '@/stores/toast';
import { useSettingsStore } from '@/stores/settings';
import { formatMoney as formatMoneyUtil } from '@/utils/money';

import type { Product, ProductVariant, ProductAttribute } from '@/types';

interface Props {
  isOpen: boolean;
  product: Product;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const cartStore = useCartStore();
const toastStore = useToastStore();
const settingsStore = useSettingsStore();


// State
const currentImageIndex = ref(0);
const selectedColorName = ref('');
const selectedSizeValue = ref('');
const selectedPcsPerPackValue = ref<number | null>(null);
const isAddingToCart = ref(false);

// Normalize options
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

// Current image
const currentImage = computed(() => {
  return selectedVariant.value.images?.[currentImageIndex.value] || 
         selectedVariant.value.images?.[0] || 
         'https://picsum.photos/seed/placeholder/400/400.jpg';
});

// Selected variant (computed based on current selections)
const selectedVariant = computed((): ProductVariant => {
  if (!props.product.variants || props.product.variants.length === 0) {
    return createFallbackVariant();
  }

  // Try to find exact match
  let matchingVariants = props.product.variants;
  
  if (selectedColorName.value) {
    matchingVariants = matchingVariants.filter(v => 
      v.color.toLowerCase() === selectedColorName.value.toLowerCase()
    );
  }
  
  if (selectedSizeValue.value) {
    matchingVariants = matchingVariants.filter(v => 
      v.size === selectedSizeValue.value
    );
  }
  
  if (selectedPcsPerPackValue !== null) {
    matchingVariants = matchingVariants.filter(v => 
      v.packSize === selectedPcsPerPackValue.value
    );
  }

  // Prefer in-stock variant
  const inStockVariant = matchingVariants.find(v => v.stock > 0);
  if (inStockVariant) {
    return inStockVariant;
  }

  // Return first matching variant
  if (matchingVariants.length > 0) {
    return matchingVariants[0];
  }

  // Fallback to first available variant
  return props.product.variants[0];
});

// Helper to create fallback variant
const createFallbackVariant = (): ProductVariant => ({
  variantId: 'fallback',
  color: 'N/A',
  size: 'N/A',
  packSize: 1,
  sku: 'N/A',
  price: 0,
  stock: 0,
  images: ['https://picsum.photos/seed/placeholder/400/400.jpg']
});

// Format money helper using the utility
const formatMoney = (amountILS: number): string => {
  return formatMoneyUtil(amountILS, settingsStore.currency, settingsStore.locale, settingsStore.rates);
};

// Availability checks
const isColorAvailable = (colorName: string): boolean => {
  return props.product.variants?.some(v => 
    v.color.toLowerCase() === colorName.toLowerCase() && v.stock > 0
  ) || false;
};

const isSizeAvailable = (sizeValue: string | number): boolean => {
  return props.product.variants?.some(v => 
    v.color.toLowerCase() === selectedColorName.value.toLowerCase() && 
    v.size === sizeValue && 
    v.stock > 0
  ) || false;
};

const isPcsPerPackAvailable = (packSize: string | number): boolean => {
  return props.product.variants?.some(v => 
    v.color.toLowerCase() === selectedColorName.value.toLowerCase() && 
    v.size === selectedSizeValue.value && 
    v.packSize === packSize && 
    v.stock > 0
  ) || false;
};

// Selection handlers
const selectColor = (color: ProductAttribute) => {
  selectedColorName.value = color.name;
  
  // Auto-select first available size for this color
  const firstAvailableSize = normalizedOptions.value.sizes.find(size => 
    props.product.variants?.some(v => 
      v.color.toLowerCase() === color.name.toLowerCase() && 
      v.size === size.value && 
      v.stock > 0
    )
  );
  
  if (firstAvailableSize) {
    selectedSizeValue.value = firstAvailableSize.value as string;
    
    // Auto-select first available pack size for this color+size
    const firstAvailablePack = normalizedOptions.value.pcsPerPack.find(pack => 
      props.product.variants?.some(v => 
        v.color.toLowerCase() === color.name.toLowerCase() && 
        v.size === firstAvailableSize.value && 
        v.packSize === pack.value && 
        v.stock > 0
      )
    );
    
    if (firstAvailablePack) {
      selectedPcsPerPackValue.value = firstAvailablePack.value as number;
    }
  }
};

const selectSize = (size: ProductAttribute) => {
  selectedSizeValue.value = size.value as string;
  
  // Auto-select first available pack size for this color+size
  const firstAvailablePack = normalizedOptions.value.pcsPerPack.find(pack => 
    props.product.variants?.some(v => 
      v.color.toLowerCase() === selectedColorName.value.toLowerCase() && 
      v.size === size.value && 
      v.packSize === pack.value && 
      v.stock > 0
    )
  );
  
  if (firstAvailablePack) {
    selectedPcsPerPackValue.value = firstAvailablePack.value as number;
  }
};

const selectPcsPerPack = (pack: ProductAttribute) => {
  selectedPcsPerPackValue.value = pack.value as number;
};

// Initialize selections when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.product.variants?.length > 0) {
    // Find first in-stock variant
    const firstInStockVariant = props.product.variants.find(v => v.stock > 0) || props.product.variants[0];
    
    selectedColorName.value = firstInStockVariant.color;
    selectedSizeValue.value = firstInStockVariant.size;
    selectedPcsPerPackValue.value = firstInStockVariant.packSize;
    currentImageIndex.value = 0;
  }
});

// Handle add to cart
const handleAddToCart = async () => {
    if (selectedVariant.value.stock === 0) {
    toastStore.error('This item is out of stock');
    return;
  }

  isAddingToCart.value = true;
  
  try {
    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    cartStore.addToCart(props.product, selectedVariant.value, 1);
    toastStore.success(`${props.product.name} added to cart`);
    closeModal();
  } catch (error) {
    toastStore.error('Failed to add item to cart');
  } finally {
    isAddingToCart.value = false;
  }
};

// Close modal
const closeModal = () => {
  emit('close');
};

const handleBackdropClick = () => {
  closeModal();
};
</script>

<style scoped>
/* Custom scrollbar for thumbnails */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>