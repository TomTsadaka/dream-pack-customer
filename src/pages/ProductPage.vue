<template>
  <div v-if="productsStore.loading" class="text-center py-12">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>

  <div v-else-if="!productsStore.currentProduct" class="text-center py-12">
    <p class="text-gray-500 text-lg mb-4">Product not found</p>
    <router-link to="/shop" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">
      Back to Shop
    </router-link>
  </div>

   <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     <!-- Back Button -->
     <div class="mb-6">
       <BackButton />
     </div>
     
     <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Images Gallery -->
      <div class="order-2 lg:order-1">
        <div class="relative">
          <img
            :src="currentVariant?.images[0]"
            :alt="productsStore.currentProduct.name"
            class="w-full h-96 object-cover rounded-lg cursor-pointer"
            @click="openGallery(currentVariant?.images || [])"
          />
          
          <!-- Stock Badge -->
          <div
            v-if="currentVariant?.stock <= 10"
            class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
          >
            Only {{ currentVariant.stock }} left
          </div>
        </div>

        <!-- Thumbnails -->
        <div v-if="currentVariant?.images.length > 1" class="grid grid-cols-4 gap-2 mt-4">
          <img
            v-for="(image, index) in currentVariant.images"
            :key="index"
            :src="image"
            :alt="`Product image ${index + 1}`"
            @click="changeMainImage(image)"
            :class="[
              'w-full h-20 object-cover rounded cursor-pointer transition-all',
              image === currentVariant.images[0] 
                ? 'ring-2 ring-offset-2 ring-primary-500' 
                : 'hover:opacity-80'
            ]"
          />
        </div>
      </div>

      <!-- Product Info and Variant Selector -->
      <div class="order-1 lg:order-2 space-y-6">
        <!-- Product Title and SKU -->
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ productsStore.currentProduct.name }}</h1>
          <div v-if="currentVariant" class="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>SKU: {{ currentVariant.sku }}</span>
            <span v-if="currentVariant.stock > 0" class="text-green-600">{{ currentVariant.stock }} in stock</span>
            <span v-else class="text-red-600">Out of stock</span>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-8">
          <p class="text-gray-700">{{ productsStore.currentProduct.baseDescription }}</p>
        </div>

        <!-- Price -->
        <div class="mb-8">
          <div v-if="currentVariant?.salePrice" class="flex items-center gap-4">
            <span class="text-3xl font-bold text-orange-500">${{ currentVariant.salePrice }}</span>
            <span class="text-xl text-gray-400 line-through">${{ currentVariant.price }}</span>
            <span class="text-sm text-gray-500 ml-2">Save ${{ (currentVariant.price - currentVariant.salePrice).toFixed(2) }}</span>
          </div>
          <div v-else class="text-3xl font-bold text-gray-900">
            ${{ currentVariant?.price || '0.00' }}
          </div>
        </div>

        <!-- Variant Selector -->
        <div v-if="productsStore.currentProduct" class="bg-white rounded-lg p-6">
          <VariantSelector
            :product="productsStore.currentProduct"
            :initial-variant="currentVariant"
            @variant-changed="handleVariantChange"
          />
        </div>

        <!-- Add to Cart Button -->
        <button
          @click="handleAddToCart"
          :disabled="!currentVariant || currentVariant.stock === 0"
          class="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {{ !currentVariant ? 'Select Options' : 
             currentVariant.stock === 0 ? 'Out of Stock' : 
             'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Gallery Modal -->
  <ProductGalleryModal
    v-if="showGallery"
    :images="galleryImages"
    :is-open="showGallery"
    @close="closeGallery"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import VariantSelector from '@/components/VariantSelector.vue';
import ProductGalleryModal from '@/components/ProductGalleryModal.vue';
import BackButton from '@/components/BackButton.vue';
import type { ProductVariant } from '@/types';
import Toast from '@/components/Toast.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();

const showGallery = ref(false);
const galleryImages = ref<string[]>([]);

// Computed properties
const currentVariant = computed(() => productsStore.currentVariant);

// Get initial variant from URL params
const getInitialVariant = () => {
  if (!productsStore.currentProduct) return null;
  
  const color = route.query.color as string;
  const size = route.query.size as string;
  const pack = route.query.pack as string;
  
  if (color && size && pack) {
    const variantId = `${color}-${size}-${pack}`;
    return productsStore.currentProduct?.variants.find(v => v.variantId === variantId) || null;
  }
  
  return productsStore.currentProduct?.variants.find(v => v.stock > 0) || null;
};

// Image gallery functions
const changeMainImage = (image: string) => {
  if (currentVariant.value && currentVariant.value.images.length > 1) {
    // Move clicked image to first position
    const images = [...currentVariant.value.images];
    const imageIndex = images.indexOf(image);
    if (imageIndex > 0) {
      images.splice(imageIndex, 1);
      images.unshift(image);
      currentVariant.value.images = images;
    }
  }
};

const openGallery = (images: string[]) => {
  galleryImages.value = images;
  showGallery.value = true;
};

const closeGallery = () => {
  showGallery.value = false;
  galleryImages.value = [];
};

// Cart functions
const handleAddToCart = () => {
  if (currentVariant.value) {
    cartStore.addToCart(productsStore.currentProduct, currentVariant.value);
    
    const toastRef = document.querySelector('Toast') as any;
    if (toastRef) {
      toastRef.success(`${productsStore.currentProduct.name} (${currentVariant.value.color} / ${currentVariant.value.size} / ${currentVariant.value.packSize} pcs) added to cart!`);
    }
  }
};

// Variant selection
const handleVariantChange = (variant: ProductVariant) => {
  productsStore.setCurrentVariant(variant);
  
  // Update URL
  const query = { ...route.query };
  if (variant) {
    query.color = variant.color;
    query.size = variant.size;
    query.pack = variant.packSize.toString();
  }
  router.replace({ query });
};

onMounted(async () => {
  const productId = parseInt(route.params.id as string);
  await productsStore.fetchProduct(productId);
  
  // Set initial variant from URL or first available
  const urlVariant = getInitialVariant();
  if (urlVariant) {
    productsStore.setCurrentVariant(urlVariant);
  } else {
    const firstAvailable = productsStore.currentProduct?.variants.find(v => v.stock > 0);
    if (firstAvailable) {
      productsStore.setCurrentVariant(firstAvailable);
    }
  }
});

// Watch for variant changes to update gallery
watch(currentVariant, (newVariant) => {
  if (newVariant) {
    galleryImages.value = newVariant.images;
  }
});
</script>