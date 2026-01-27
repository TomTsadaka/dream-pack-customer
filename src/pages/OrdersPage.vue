<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">My Orders</h1>

      <div v-if="!authStore.isLoggedIn" class="text-center py-12">
        <p class="text-gray-500 text-lg mb-4">Please login to view your orders</p>
        <router-link
          to="/login"
          class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
        >
          Login
        </router-link>
      </div>

      <div v-else>
        <!-- Loading State -->
        <div v-if="ordersStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- Orders List -->
        <div v-else-if="ordersStore.orders.length > 0">
          <div class="space-y-6">
            <div
              v-for="order in ordersStore.recentOrders"
              :key="order.id"
              class="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <!-- Order Header -->
              <div class="bg-gray-50 px-6 py-4 border-b">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold">Order #{{ order.id }}</h3>
                    <p class="text-sm text-gray-600">
                      {{ formatDate(order.created_at) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <span :class="getStatusClass(order.status)">
                      {{ formatStatus(order.status) }}
                    </span>
                    <p class="text-lg font-semibold mt-1">
                      ${{ order.total.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="p-6">
                <div class="space-y-3 mb-4">
                  <div
                    v-for="item in order.items"
                    :key="item.product_id"
                    class="flex justify-between items-center"
                  >
                    <div class="flex-1">
                      <h4 class="font-medium">{{ item.product_name }}</h4>
                      <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</p>
                      <p class="text-sm text-gray-600">${{ item.price.toFixed(2) }} each</p>
                    </div>
                  </div>
                </div>

                <!-- Shipping Address -->
                <div class="border-t pt-4">
                  <h4 class="font-medium mb-2">Shipping Address</h4>
                  <p class="text-gray-600">
                    {{ order.shipping_address.name }}<br>
                    {{ order.shipping_address.address }}<br>
                    {{ order.shipping_address.city }}, {{ order.shipping_address.postal_code }}<br>
                    {{ order.shipping_address.phone }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 mt-4">
                  <button
                    @click="viewOrderDetails(order.id)"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    View Details
                  </button>
                  <button
                    v-if="order.status === 'delivered'"
                    class="text-orange-500 hover:text-orange-600 font-medium text-sm"
                  >
                    Order Again
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    class="text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="h-24 w-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
          <p class="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <router-link
            to="/shop"
            class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
          >
            Start Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOrdersStore } from '@/stores/orders';

const router = useRouter();
const authStore = useAuthStore();
const ordersStore = useOrdersStore();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800';
    case 'shipped':
      return 'px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800';
    case 'delivered':
      return 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
    case 'cancelled':
      return 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
    default:
      return 'px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
  }
};

const viewOrderDetails = (orderId: number) => {
  // In a real app, this would navigate to order details page
  // For now, we'll just show an alert
  alert(`Order details for #${orderId}`);
};

onMounted(async () => {
  await authStore.init();
  
  if (authStore.isLoggedIn) {
    await ordersStore.fetchOrders();
  }
});
</script>