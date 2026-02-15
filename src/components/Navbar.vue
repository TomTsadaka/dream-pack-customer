<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <span class="text-xl font-bold text-gray-800">Dream Pack</span>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="hidden md:block flex-1 max-w-xl mx-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Navigation Items -->
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <div class="relative">
            <button
              @click="showLanguageMenu = !showLanguageMenu"
              class="flex items-center space-x-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <img :src="currentLanguage.flagSrc" class="w-5 h-5" :alt="currentLanguage.label" />
              <span class="hidden sm:inline">{{ currentLanguage.code.toUpperCase() }}</span>
              <svg class="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Language Dropdown -->
            <div v-if="showLanguageMenu" class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50">
              <button
                v-for="language in languageOptions"
                :key="language.code"
                @click="selectLanguage(language.code)"
                class="inline-flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                :class="{ 'bg-gray-50 text-gray-800': settingsStore.locale === language.code }"
              >
                 <img :src="language.flagSrc" class="w-5 h-5" :alt="language.label" />
                 <span>{{ language.label }}</span>
              </button>
            </div>
          </div>

          <!-- Cart -->
          <router-link to="/cart" class="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-gray-800 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div v-if="authStore.isLoggedIn" class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-1 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div class="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-gray-600">{{ authStore.user?.name.charAt(0).toUpperCase() }}</span>
              </div>
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50">
              <router-link
                to="/account"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                My Account
              </router-link>
              <router-link
                to="/orders"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                My Orders
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Login/Register -->
          <div v-else class="flex items-center space-x-3">
            <router-link
              to="/login"
              class="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors text-sm font-medium"
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
            class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200"
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
