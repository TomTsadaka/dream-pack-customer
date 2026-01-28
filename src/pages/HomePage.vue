<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Welcome to Dream Pack</h1>
          <p class="text-xl mb-8">Premium packaging solutions for every business</p>
          <router-link
            to="/shop"
            class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Shopping
          </router-link>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold mb-8 text-center">{{ t('home.shopByCategory') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/shop?category=${category.slug}`"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-primary-600 font-bold text-lg">{{ category.name.charAt(0) }}</span>
          </div>
          <h3 class="font-semibold">{{ category.name }}</h3>
          <p class="text-sm text-gray-600 mt-1">{{ category.product_count }} products</p>
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
import { onMounted } from 'vue';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { useToastStore } from '@/stores/toast';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const toastStore = useToastStore();
const { t } = useI18n();

const categories = [
  { id: 1, name: 'Pouches and Bags', slug: 'pouches-and-bags', product_count: 8 },
  { id: 2, name: 'Boxes and Cartons', slug: 'boxes-and-cartons', product_count: 7 },
  { id: 3, name: 'Bottles for packaging', slug: 'bottles', product_count: 8 },
  { id: 4, name: 'Packaging For Retail', slug: 'retail', product_count: 7 }
];

const handleAddToCart = (product: any, variant: any) => {
  cartStore.addToCart(product, variant);
  
  toastStore.success(`${product.name} added to cart!`);
};

onMounted(async () => {
  await Promise.all([
    productsStore.fetchFeaturedProducts(),
    productsStore.fetchCategories()
  ]);
});
</script>