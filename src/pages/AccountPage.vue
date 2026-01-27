<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">My Account</h1>

      <div v-if="!authStore.isLoggedIn" class="text-center py-12">
        <p class="text-gray-500 text-lg mb-4">Please login to view your account</p>
        <router-link
          to="/login"
          class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
        >
          Login
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Account Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <nav class="space-y-2">
              <router-link
                to="/account"
                class="block px-4 py-2 text-sm font-medium rounded-lg bg-primary-50 text-primary-700"
              >
                Profile
              </router-link>
              <router-link
                to="/orders"
                class="block px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Orders
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-6">Profile Information</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  class="input"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="input"
                  disabled
                />
                <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <input
                  :value="formatDate(authStore.user?.created_at)"
                  type="text"
                  class="input"
                  disabled
                />
              </div>
            </div>

            <div class="mt-6 flex gap-3">
              <button
                v-if="!isEditing"
                @click="isEditing = true"
                class="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Edit Profile
              </button>
              
              <template v-else>
                <button
                  @click="handleSaveProfile"
                  class="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  @click="handleCancelEdit"
                  class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </template>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 class="text-xl font-semibold mb-4">Quick Stats</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-primary-600">{{ ordersStore.orders.length }}</div>
                <div class="text-sm text-gray-600">Total Orders</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ completedOrders }}</div>
                <div class="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOrdersStore } from '@/stores/orders';
import Toast from '@/components/Toast.vue';

const router = useRouter();
const authStore = useAuthStore();
const ordersStore = useOrdersStore();

const isEditing = ref(false);
const profileForm = ref({
  name: '',
  email: ''
});

const completedOrders = computed(() => {
  return ordersStore.orders.filter(order => order.status === 'delivered').length;
});

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleSaveProfile = () => {
  // In a real app, this would call an API to update the profile
  // For now, we'll just update the local store
  if (authStore.user) {
    authStore.user.name = profileForm.value.name;
    localStorage.setItem('auth_user', JSON.stringify(authStore.user));
  }
  
  isEditing.value = false;
  
  const toastRef = document.querySelector('Toast') as any;
  if (toastRef) {
    toastRef.success('Profile updated successfully!');
  }
};

const handleCancelEdit = () => {
  // Reset form to original values
  if (authStore.user) {
    profileForm.value.name = authStore.user.name;
    profileForm.value.email = authStore.user.email;
  }
  
  isEditing.value = false;
};

const handleLogout = async () => {
  await authStore.logout();
  
  const toastRef = document.querySelector('Toast') as any;
  if (toastRef) {
    toastRef.info('Logged out successfully');
  }
  
  router.push('/');
};

onMounted(async () => {
  await authStore.init();
  
  if (authStore.user) {
    profileForm.value.name = authStore.user.name;
    profileForm.value.email = authStore.user.email;
  }
  
  await ordersStore.fetchOrders();
});
</script>