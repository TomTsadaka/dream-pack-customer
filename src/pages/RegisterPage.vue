<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Join DPShoping today</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="handleRegister">
          <!-- Name -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input"
              placeholder="John Doe"
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
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

          <!-- Address -->
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              required
              minlength="5"
              class="input"
              placeholder="Street address"
            />
            <div v-if="errors.address" class="mt-1 text-sm text-red-600">
              {{ errors.address }}
            </div>
          </div>

          <!-- City and Country in same row -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                required
                minlength="2"
                class="input"
                placeholder="City"
              />
              <div v-if="errors.city" class="mt-1 text-sm text-red-600">
                {{ errors.city }}
              </div>
            </div>
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                id="country"
                v-model="form.country"
                type="text"
                required
                minlength="2"
                class="input"
                placeholder="Country"
              />
              <div v-if="errors.country" class="mt-1 text-sm text-red-600">
                {{ errors.country }}
              </div>
            </div>
          </div>

          <!-- Postal Code -->
          <div class="mb-4">
            <label for="postal_code" class="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              id="postal_code"
              v-model="form.postal_code"
              type="text"
              required
              minlength="3"
              pattern="[a-zA-Z0-9\s\-]+"
              class="input"
              placeholder="12345 or ABC-123"
            />
            <div v-if="errors.postal_code" class="mt-1 text-sm text-red-600">
              {{ errors.postal_code }}
            </div>
          </div>

          <!-- Contact Number -->
          <div class="mb-4">
            <label for="contact_number" class="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              id="contact_number"
              v-model="form.contact_number"
              type="tel"
              required
              minlength="7"
              pattern="[0-9\s\+\-]+"
              class="input"
              placeholder="+63 9XXXXXXXXX"
            />
            <div v-if="errors.contact_number" class="mt-1 text-sm text-red-600">
              {{ errors.contact_number }}
            </div>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="input"
              placeholder="••••••••"
            />
          </div>

          <!-- Confirm Password -->
          <div class="mb-6">
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              minlength="6"
              class="input"
              placeholder="••••••••"
            />
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
            {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <router-link
            to="/login"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </router-link>
        </div>
      </div>

      <!-- Terms -->
      <div class="mt-6 text-center text-sm text-gray-600">
        By creating an account, you agree to our
        <a href="#" class="text-primary-600 hover:text-primary-700">Terms of Service</a>
        and
        <a href="#" class="text-primary-600 hover:text-primary-700">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { RegisterForm } from '@/types';
import Toast from '@/components/Toast.vue';

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
    
    // Validate new fields
    if (form.value.address.length < 5) {
      errors.value.address = 'Address must be at least 5 characters long';
    }
    
    if (form.value.city.length < 2) {
      errors.value.city = 'City must be at least 2 characters long';
    }
    
    if (form.value.country.length < 2) {
      errors.value.country = 'Country must be at least 2 characters long';
    }
    
    if (form.value.postal_code.length < 3) {
      errors.value.postal_code = 'Postal code must be at least 3 characters long';
    }
    
    const postalRegex = /^[a-zA-Z0-9\s\-]+$/;
    if (!postalRegex.test(form.value.postal_code)) {
      errors.value.postal_code = 'Postal code can only contain letters, numbers, spaces, and hyphens';
    }
    
    const contactRegex = /^[0-9\s\+\-]+$/;
    if (!contactRegex.test(form.value.contact_number)) {
      errors.value.contact_number = 'Contact number can only contain digits, spaces, +, and -';
    } else if (form.value.contact_number.length < 7) {
      errors.value.contact_number = 'Contact number must be at least 7 characters long';
    }
    
    if (form.value.password !== form.value.password_confirmation) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    
    // Check if there are any validation errors
    if (Object.keys(errors.value).length > 0) {
      return;
    }
    
    // address and contact_number are required by backend (Laravel) registration API
    const result = await authStore.register(form.value);
    
    if (result.success) {
      const toastRef = document.querySelector('Toast') as any;
      if (toastRef) {
        toastRef.success('Account created successfully!');
      }
      
      router.push('/');
    } else {
      errorMessage.value = result.message || 'Registration failed';
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
});
</script>