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

    <!-- Right Side - Register Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-gray-50 overflow-y-auto">
      <div class="max-w-md w-full">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-6">
          <router-link to="/" class="text-3xl font-bold text-gray-800">Dream Pack</router-link>
          <p class="text-gray-500 mt-2">Premium Packaging Solutions</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-8">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Create Account</h1>
            <p class="text-gray-500 mt-1">Join us today</p>
          </div>

          <form @submit.prevent="handleRegister">
            <!-- Name -->
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="John Doe"
              />
            </div>

            <!-- Email -->
            <div class="mb-4">
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

            <!-- Address -->
            <div class="mb-4">
              <label for="address" class="block text-sm font-medium text-gray-600 mb-2">
                Address
              </label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                required
                minlength="5"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="Street address"
              />
              <div v-if="errors.address" class="mt-1 text-sm text-red-500">
                {{ errors.address }}
              </div>
            </div>

            <!-- City and Country -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-600 mb-2">
                  City
                </label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                  placeholder="City"
                />
                <div v-if="errors.city" class="mt-1 text-sm text-red-500">
                  {{ errors.city }}
                </div>
              </div>
              <div>
                <label for="country" class="block text-sm font-medium text-gray-600 mb-2">
                  Country
                </label>
                <input
                  id="country"
                  v-model="form.country"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                  placeholder="Country"
                />
                <div v-if="errors.country" class="mt-1 text-sm text-red-500">
                  {{ errors.country }}
                </div>
              </div>
            </div>

            <!-- Postal Code -->
            <div class="mb-4">
              <label for="postal_code" class="block text-sm font-medium text-gray-600 mb-2">
                Postal Code
              </label>
              <input
                id="postal_code"
                v-model="form.postal_code"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="12345"
              />
              <div v-if="errors.postal_code" class="mt-1 text-sm text-red-500">
                {{ errors.postal_code }}
              </div>
            </div>

            <!-- Contact Number -->
            <div class="mb-4">
              <label for="contact_number" class="block text-sm font-medium text-gray-600 mb-2">
                Contact Number
              </label>
              <input
                id="contact_number"
                v-model="form.contact_number"
                type="tel"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="+63 9XXXXXXXXX"
              />
              <div v-if="errors.contact_number" class="mt-1 text-sm text-red-500">
                {{ errors.contact_number }}
              </div>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>

            <!-- Confirm Password -->
            <div class="mb-5">
              <label for="password_confirmation" class="block text-sm font-medium text-gray-600 mb-2">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                placeholder="••••••••"
              />
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
              {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
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

          <!-- Login Link -->
          <div class="text-center">
            <span class="text-gray-500">Already have an account? </span>
            <router-link
              to="/login"
              class="text-gray-700 font-medium hover:underline"
            >
              Sign in
            </router-link>
          </div>
        </div>

        <!-- Terms -->
        <div class="mt-5 text-center text-sm text-gray-500">
          By creating an account, you agree to our
          <a href="#" class="text-gray-700 hover:underline">Terms</a>
          and
          <a href="#" class="text-gray-700 hover:underline">Privacy Policy</a>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-5">
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { RegisterForm } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<RegisterForm>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  address: '',
  contact_number: '',
  city: '',
  country: '',
  postal_code: ''
});

const errorMessage = ref('');
const errors = ref<Record<string, string>>({});

const handleRegister = async () => {
  try {
    errorMessage.value = '';
    errors.value = {};
    
    if (form.value.address.length < 5) {
      errors.value.address = 'Address must be at least 5 characters';
    }
    
    if (form.value.city.length < 2) {
      errors.value.city = 'City is required';
    }
    
    if (form.value.country.length < 2) {
      errors.value.country = 'Country is required';
    }
    
    if (form.value.postal_code.length < 3) {
      errors.value.postal_code = 'Postal code is required';
    }
    
    if (form.value.password !== form.value.password_confirmation) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    
    if (Object.keys(errors.value).length > 0) {
      return;
    }
    
    const result = await authStore.register(form.value);
    
    if (result.success) {
      router.push('/');
    } else {
      errorMessage.value = result.message || 'Registration failed';
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
