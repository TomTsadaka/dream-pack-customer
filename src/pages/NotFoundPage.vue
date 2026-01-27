<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="text-gray-400 mb-4">
        <svg class="h-24 w-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-6xl font-bold text-gray-400 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="space-x-4">
        <router-link
          to="/"
          class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
        >
          Go Home
        </router-link>
        <router-link
          to="/shop"
          class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-block"
        >
          Shop Now
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this simple 404 page
</script>