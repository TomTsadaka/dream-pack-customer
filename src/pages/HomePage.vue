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
          <router-link
            v-if="getBannerLink.to"
            :to="getBannerLink.to"
            class="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors inline-block"
          >
            Start Shopping
          </router-link>
          <a
            v-else-if="getBannerLink.isExternal && getBannerLink.href"
            :href="getBannerLink.href"
            target="_blank"
            rel="noopener noreferrer"
            class="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors inline-block"
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
      <h2 class="text-2xl font-bold mb-8 text-center text-gray-800">{{ t('home.shopByCategory') }}</h2>
      
      <!-- Loading State -->
      <div v-if="isCategoriesLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
      
      <!-- Categories Grid -->
      <div v-else-if="categoryCards.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          v-for="category in categoryCards"
          :key="category.id"
          :to="category.route"
          class="group border border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer text-center"
        >
          <!-- Icon -->
          <div class="w-12 h-12 mx-auto mb-3 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          
          <!-- Category name -->
          <h3 class="text-gray-800 font-medium text-sm group-hover:text-gray-600 transition-colors">
            {{ category.name }}
          </h3>
        </router-link>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <p class="text-gray-400">No categories available</p>
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
          v-for="product in featuredList"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>
      <div class="text-center mt-8">
        <router-link
          to="/shop"
          class="border-2 border-gray-600 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
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
            class="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors inline-block mt-4"
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
import { useBannersStore } from '@/stores/banners';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { useToastStore } from '@/stores/toast';
import { useI18n } from 'vue-i18n';
import type { Banner } from '@/types';

const router = useRouter();
const productsStore = useProductsStore();
const bannersStore = useBannersStore();
const cartStore = useCartStore();
const toastStore = useToastStore();
const { t } = useI18n();

// Banner state
const currentBannerIndex = ref(0);
let autoRotateInterval: number | null = null;

// Computed properties
const banners = computed(() => bannersStore.sortedBanners);

const currentBanner = computed((): Banner | null => {
  return banners.value[currentBannerIndex.value] || bannersStore.heroBanner;
});

const categoryCards = computed(() => {
  const cats = productsStore.activeCategories;
  if (!cats.length) return [];
  
  return cats.slice(0, 4).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: getCategoryImage(category.slug),
    route: { path: '/shop', query: { category: category.slug } }
  }));
});

const isCategoriesLoading = computed(() => productsStore.categoriesLoading);

const featuredList = computed(() => {
  const products = productsStore.featuredProducts;
  if (!products) return [];
  return products;
});

const heroBackgroundStyle = computed(() => {
  if (currentBanner.value?.image_url) {
    return {
      backgroundImage: `url(${currentBanner.value.image_url})`,
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

// Link normalization: convert /products to /shop
interface BannerLink {
  to: string | null;
  isExternal: boolean;
  href?: string;
}

const normalizeBannerLink = (linkUrl: string): BannerLink => {
  if (!linkUrl) {
    return { to: '/shop', isExternal: false };
  }
  
  // Check if external URL
  if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
    return { to: null, isExternal: true, href: linkUrl };
  }
  
  // Convert /products to /shop
  let normalized = linkUrl;
  if (normalized.startsWith('/products')) {
    normalized = normalized.replace('/products', '/shop');
  }
  
  return { to: normalized, isExternal: false };
};

const getBannerLink = computed<BannerLink>(() => {
  if (!currentBanner.value?.link_url) {
    return { to: '/shop', isExternal: false };
  }
  return normalizeBannerLink(currentBanner.value.link_url);
});

const handleAddToCart = (product: any, variant: any) => {
  cartStore.addToCart(product, variant);
  toastStore.success(`${product.name} added to cart!`);
};

const getCategoryImage = (slug: string): string => {
  const imageMap: Record<string, string> = {
    'pouches': '/images/categories/pouches-bags.svg',
    'bottles-containers': '/images/categories/bottles-packaging.svg',
    'boxes': '/images/categories/boxes-cartons.svg',
    'shelf-ready-packaging': '/images/categories/retail-packaging.svg',
  };
  return imageMap[slug] || '/images/categories/default.svg';
};

onMounted(async () => {
  // Load banners from store
  await bannersStore.fetchBanners();
  startAutoRotate();

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