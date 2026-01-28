<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Banner with Background Image -->
    <div 
      class="relative text-white overflow-hidden"
      :style="heroBackgroundStyle"
    >
      <!-- Dark overlay for text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <!-- Banner content -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ currentBanner?.title || 'Welcome to Dream Pack' }}</h1>
          <p class="text-xl md:text-2xl mb-8">{{ currentBanner?.subtitle || 'Premium packaging solutions for every business' }}</p>
          <a
            :href="currentBanner?.link_url || '/shop'"
            class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Shopping
          </a>
        </div>
      </div>

      <!-- Carousel indicators (only show if multiple banners) -->
      <div v-if="banners.length > 1" class="absolute bottom-4 left-0 right-0">
        <div class="flex justify-center space-x-2">
          <button
            v-for="(banner, index) in banners"
            :key="banner.id"
            @click="currentBannerIndex = index"
            :class="[
              'w-3 h-3 rounded-full transition-all',
              index === currentBannerIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            ]"
          ></button>
        </div>
      </div>
    </div>

    <!-- Shop by Category -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold mb-8 text-center">{{ t('home.shopByCategory') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link
          v-for="category in categoryCards"
          :key="category.id"
          :to="category.route"
          class="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <!-- Background image with overlay -->
          <div 
            class="relative h-48 bg-cover bg-center"
            :style="{ backgroundImage: `url(${category.image})` }"
          >
            <!-- Dark overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity"></div>
            
            <!-- Category title centered -->
            <div class="absolute inset-0 flex items-center justify-center">
              <h3 class="text-white text-xl font-bold text-center px-4">{{ category.name }}</h3>
            </div>
          </div>
          
          <!-- Hover effect - slight zoom on image -->
          <div class="absolute inset-0 transform scale-105 group-hover:scale-110 transition-transform duration-300"
               :style="{ backgroundImage: `url(${category.image})` }"
               style="background-size: cover; background-position: center; opacity: 0.3;">
          </div>
        </router-link>
      </div>
    </div>

    <!-- Featured Products -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold mb-8">{{ t('home.featuredProducts') }}</h2>
      <div v-if="productsStore.loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in productsStore.featuredProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>
      <div class="text-center mt-8">
        <router-link
          to="/shop"
          class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
        >
          View All Products
        </router-link>
      </div>
    </div>

    <!-- Special Offers Banner -->
    <div class="bg-orange-500 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-2">Special Offer!</h2>
          <p class="text-lg">Get 20% off on all selected products this weekend only</p>
          <router-link
            to="/shop?category=electronics"
            class="bg-white text-orange-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block mt-4"
          >
            Shop now
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { useToastStore } from '@/stores/toast';
import { useI18n } from 'vue-i18n';
import { bannerService } from '@/services/bannerService';
import type { HomeBanner } from '@/types';

const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const toastStore = useToastStore();
const { t } = useI18n();

// Banner data
const banners = ref<HomeBanner[]>([]);
const currentBannerIndex = ref(0);
let autoRotateInterval: number | null = null;

// Static category cards with images and route mapping
const categoryCards = [
  {
    id: 1,
    name: 'Pouches and Bag',
    image: '/images/categories/pouches-bags.svg',
    route: { path: '/shop', query: { category: 'Flexible Packaging' } }
  },
  {
    id: 2,
    name: 'Boxes and Cartons',
    image: '/images/categories/boxes-cartons.svg',
    route: { path: '/shop', query: { category: 'Rigid Packaging' } }
  },
  {
    id: 3,
    name: 'Bottles for Packaging',
    image: '/images/categories/bottles-packaging.svg',
    route: { path: '/shop', query: { category: 'Bottles & Containers' } }
  },
  {
    id: 4,
    name: 'Packaging for Retail',
    image: '/images/categories/retail-packaging.svg',
    route: { path: '/shop', query: { category: 'Shelf-ready & Retail Packaging' } }
  }
];

// Computed properties
const currentBanner = computed(() => {
  return banners.value[currentBannerIndex.value] || null;
});

const heroBackgroundStyle = computed(() => {
  if (currentBanner.value && currentBanner.value.images.length > 0) {
    return {
      backgroundImage: `url(${currentBanner.value.images[0].url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '500px'
    };
  }
  // Fallback to default gradient
  return {
    background: 'linear-gradient(to right, #2563eb, #1e40af)',
    minHeight: '500px'
  };
});

// Auto-rotate banners
const startAutoRotate = () => {
  if (banners.value.length > 1) {
    autoRotateInterval = setInterval(() => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length;
    }, 5000); // Rotate every 5 seconds
  }
};

const stopAutoRotate = () => {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
    autoRotateInterval = null;
  }
};

const handleAddToCart = (product: any, variant: any) => {
  cartStore.addToCart(product, variant);
  toastStore.success(`${product.name} added to cart!`);
};

onMounted(async () => {
  // Load banners
  try {
    banners.value = await bannerService.getBanners();
    startAutoRotate();
  } catch (error) {
    console.error('Failed to load banners:', error);
  }

  // Load products and categories
  await Promise.all([
    productsStore.fetchFeaturedProducts(),
    productsStore.fetchCategories()
  ]);
});

onUnmounted(() => {
  stopAutoRotate();
});
</script>