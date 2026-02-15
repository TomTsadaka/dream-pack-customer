<template>
  <div id="app">
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Toast ref="toastRef" />
    
    <!-- Lazy loaded Footer -->
    <LazyFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Toast from '@/components/Toast.vue';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useToastStore } from '@/stores/toast';
import { useSettingsStore } from '@/stores/settings';
import { useI18n } from 'vue-i18n';

const LazyFooter = defineAsyncComponent(() => 
  import('@/components/Footer.vue')
);

const toastRef = ref<InstanceType<typeof Toast> | null>(null);

// Initialize stores
const authStore = useAuthStore();
const cartStore = useCartStore();
const settingsStore = useSettingsStore();
const { t } = useI18n();

onMounted(async () => {
  // Defer store initialization to not block rendering
  requestAnimationFrame(async () => {
    // Initialize auth state
    await authStore.init();
    
    // Initialize cart
    cartStore.init();
  });
  
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
