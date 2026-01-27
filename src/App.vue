<template>
  <div id="app">
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Toast ref="toastRef" />
    
    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">D</span>
              </div>
              <span class="text-xl font-bold">Dream Pack</span>
            </div>
            <p class="text-gray-400">
              Your trusted packaging solutions provider for quality materials at great prices.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><router-link to="/" class="text-gray-400 hover:text-white">Home</router-link></li>
              <li><router-link to="/shop" class="text-gray-400 hover:text-white">Shop</router-link></li>
              <li><router-link to="/about" class="text-gray-400 hover:text-white">About Us</router-link></li>
              <li><router-link to="/contact" class="text-gray-400 hover:text-white">Contact</router-link></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h3 class="font-semibold mb-4">Customer Service</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Shipping Info</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Returns</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Track Order</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h3 class="font-semibold mb-4">Newsletter</h3>
            <p class="text-gray-400 mb-4">
              Subscribe to get special offers and updates
            </p>
            <div class="flex">
              <input
                type="email"
                placeholder="Your email"
                class="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button class="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Dream Pack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Toast from '@/components/Toast.vue';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useToastStore } from '@/stores/toast';

const toastRef = ref<InstanceType<typeof Toast> | null>(null);

// Initialize stores
const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(async () => {
  // Initialize auth state
  await authStore.init();
  
  // Initialize cart
  cartStore.init();
  
  // Make toast globally available (legacy)
  if (toastRef.value) {
    (window as any).toast = toastRef.value;
  }
  
  // Setup global toast store
  const toastStore = useToastStore();
  if (toastRef.value) {
    Object.assign(toastRef.value, toastStore);
  }
});
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>