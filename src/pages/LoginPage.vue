<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Packaging Image -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-700 to-gray-900 items-center justify-center p-12">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <!-- Decorative Boxes -->
      <div class="relative z-10 text-center">
        <div class="flex justify-center mb-8">
          <div class="w-32 h-32 border-4 border-white/30 rounded-lg mx-4 transform rotate-6"></div>
          <div class="w-32 h-32 border-4 border-white/30 rounded-lg mx-4 -mt-4"></div>
          <div class="w-32 h-32 border-4 border-white/30 rounded-lg mx-4 transform -rotate-6"></div>
        </div>
        <h2 class="text-4xl font-bold text-white mb-4">Dream Pack</h2>
        <p class="text-gray-300 text-lg max-w-md">Premium packaging solutions for your business</p>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-gray-50">
      <div class="max-w-md w-full">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <router-link to="/" class="text-3xl font-bold text-gray-800">Dream Pack</router-link>
          <p class="text-gray-500 mt-2">Premium Packaging Solutions</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p class="text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <form @submit.prevent="handleLogin">
            <!-- Email -->
            <div class="mb-5">
              <label for="email" class="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="you@example.com"
              />
            </div>

            <!-- Password -->
            <div class="mb-5">
              <label for="password" class="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>

            <!-- Remember Me & Forgot -->
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 text-gray-600 focus:ring-gray-400 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-500">Remember me</span>
              </label>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-[#1F2937] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#374151] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-3 bg-white text-gray-400">or</span>
            </div>
          </div>

          <!-- Register Link -->
          <div class="text-center">
            <span class="text-gray-500">Don't have an account? </span>
            <router-link
              to="/register"
              class="text-gray-700 font-medium hover:underline"
            >
              Sign up
            </router-link>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <router-link to="/" class="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { LoginForm } from '@/types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref<LoginForm>({
  email: '',
  password: ''
});

const errorMessage = ref('');

const handleLogin = async () => {
  try {
    errorMessage.value = '';
    
    const result = await authStore.login(form.value);
    
    if (result.success) {
      const redirect = route.query.redirect as string || '/';
      router.push(redirect);
    } else {
      errorMessage.value = result.message || 'Login failed';
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred';
  }
};

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/');
  }
});
</script>
