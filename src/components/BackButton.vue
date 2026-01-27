<template>
  <button
    @click="handleBack"
    :class="[
      'inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors',
      customClass
    ]"
  >
    <!-- Back Arrow -->
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    
    <!-- Label -->
    <span class="text-sm font-medium">Back</span>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  customClass?: string;
  fallbackRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
  customClass: '',
  fallbackRoute: '/shop'
});

const router = useRouter();

const handleBack = () => {
  // Check if there's history to go back to
  if (window.history.length > 1) {
    router.back();
  } else {
    // Fallback to specified route or default to /shop
    router.push(props.fallbackRoute);
  }
};
</script>

<style scoped>
button {
  /* Custom scrollbar styling if needed */
}
</style>