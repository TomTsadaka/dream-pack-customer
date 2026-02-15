<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">New to DPShoping?</span>
          </div>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <router-link
            to="/register"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create an account
          </router-link>
        </div>
      </div>

      <!-- Demo Account Info -->
      <!-- <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          <strong>Demo Account:</strong><br>
          Email: demo@example.com<br>
          Password: password
        </p>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { LoginForm } from '@/types';
import Toast from '@/components/Toast.vue';

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
      const toastRef = document.querySelector('Toast') as any;
      if (toastRef) {
        toastRef.success('Login successful!');
      }
      
      // Redirect to intended page or home
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
  // If already logged in, redirect
  if (authStore.isLoggedIn) {
    router.push('/');
  }
  
  // Pre-fill demo account for convenience
  form.value = {
    email: 'demo@example.com',
    password: 'password'
  };
});
</script>