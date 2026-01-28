<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-1 md:space-x-2">
            <div class="w-6 h-6 md:w-8 md:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm md:text-lg">D</span>
            </div>
            <span class="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">Dream Pack</span>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="hidden md:block flex-1 max-w-lg mx-4 md:mx-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Navigation Items -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- Language Switcher -->
          <div class="relative">
            <button
              @click="showLanguageMenu = !showLanguageMenu"
              class="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
            >
              <span class="inline-flex items-center gap-2">
                <img :src="currentLanguage.flagSrc" class="w-4 h-4 inline-block" :alt="currentLanguage.label" />
                <span>{{ currentLanguage.label }}</span>
              </span>
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Language Dropdown -->
            <div v-if="showLanguageMenu" class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50">
              <button
                v-for="language in languageOptions"
                :key="language.code"
                @click="selectLanguage(language.code)"
                class="inline-flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                :class="{ 'bg-primary-50 text-primary-600': settingsStore.locale === language.code }"
              >
                   <img :src="language.flagSrc" class="w-4 h-4 inline-block" :alt="language.label" />
                   <span>{{ language.label }}</span>
              </button>
            </div>
          </div>

          <!-- Cart -->
          <router-link to="/cart" class="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
            <svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div v-if="authStore.isLoggedIn" class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-1 md:space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <div class="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-xs md:text-sm font-medium">{{ authStore.user?.name.charAt(0).toUpperCase() }}</span>
              </div>
              <svg class="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50">
              <router-link
                to="/account"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Account
              </router-link>
              <router-link
                to="/orders"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Orders
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Login/Register -->
          <div v-else class="flex items-center space-x-1 md:space-x-2">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-primary-600 transition-colors font-medium text-sm md:text-base"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="bg-primary-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm md:text-base"
            >
              Register
            </router-link>
          </div>
        </div>
      </div>

      <!-- Mobile Search -->
      <div class="md:hidden pb-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search products..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useProductsStore } from '@/stores/products';
import { useSettingsStore } from '@/stores/settings';
import US_FLAG from '@/assets/flags/us.svg';
import IL_FLAG from '@/assets/flags/il.svg';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const productsStore = useProductsStore();
const settingsStore = useSettingsStore();

const searchQuery = ref('');
const showUserMenu = ref(false);
const showCurrencyMenu = ref(false);
const showLanguageMenu = ref(false);

// Currency options
const currencies = [
  { code: 'ILS', symbol: '₪' },
  { code: 'USD', symbol: '$' },
  { code: 'PHP', symbol: '₱' }
];

// Language options
const languageOptions = [
  {
    code: 'en',
    label: 'English',
    emoji: '🇺🇸',
    flagSrc: US_FLAG
  },
  {
    code: 'he',
    label: 'עברית',
    emoji: '🇮🇱',
    flagSrc: IL_FLAG
  }
];

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/shop',
      query: { q: searchQuery.value.trim() }
    });
  }
};

const handleLogout = async () => {
  showUserMenu.value = false;
  await authStore.logout();
  router.push('/');
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};



const selectLanguage = (locale: string) => {
  settingsStore.setLocale(locale as 'en' | 'he');
  showLanguageMenu.value = false;
};

const currentLanguage = computed(() => {
  return languageOptions.find(l => l.code === settingsStore.locale) || languageOptions[0];
});



const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showUserMenu.value = false;
    showLanguageMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.w-4 {
  width: 1rem;
  height: 1rem;
}
</style>