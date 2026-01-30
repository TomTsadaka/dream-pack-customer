<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">My Orders</h1>

      <!-- Status Tabs -->
      <div class="mb-8">
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            v-for="status in statusTabs"
            :key="status.key"
            @click="activeTab = status.key"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
              activeTab === status.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ status.label }}
            <span
              v-if="getOrderCount(status.key) > 0"
              :class="[
                'ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                activeTab === status.key
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ getOrderCount(status.key) }}
            </span>
          </button>
        </div>
      </div>

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
        <div v-else-if="filteredOrders.length > 0">
          <div class="space-y-6">
            <div
              v-for="order in filteredOrders"
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
                      {{ formatMoney(order.total) }}
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
                     class="flex gap-4 items-center"
                   >
                     <!-- Product Image -->
                     <img
                       :src="getOrderItemThumbnail(item)"
                       :alt="item.product_name"
                       @error="handleImageError"
                       class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                     />
                     
                     <div class="flex-1">
                       <h4 class="font-medium">{{ item.product_name }}</h4>
                       <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                       <p v-if="item.variant_name" class="text-xs text-gray-500">{{ item.variant_name }}</p>
                     </div>
                     <div class="text-right">
                       <p class="font-medium">{{ formatMoney(item.price * item.quantity) }}</p>
                       <p class="text-sm text-gray-600">{{ formatMoney(item.price) }} each</p>
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
                    v-if="order.status === 'pending' || order.status === 'processing'"
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
          <h2 class="text-xl font-semibold text-gray-600 mb-2">
            {{ activeTab === 'all' ? 'No orders yet' : `No ${getActiveTabLabel()} orders` }}
          </h2>
          <p class="text-gray-500 mb-6">
            {{ activeTab === 'all' ? 'Start shopping to see your orders here' : 'You have no orders in this status' }}
          </p>
          <router-link
            v-if="activeTab === 'all'"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOrdersStore } from '@/stores/orders';
import { useProductsStore } from '@/stores/products';
import { useSettingsStore } from '@/stores/settings';
import { formatMoney as formatMoneyUtil } from '@/utils/money';
import { resolveVariantThumbnail, handleImageError } from '@/utils/image';

const router = useRouter();
const authStore = useAuthStore();
const ordersStore = useOrdersStore();
const productsStore = useProductsStore();
const settingsStore = useSettingsStore();

// Status management
const activeTab = ref('all');

const statusTabs = [
  { key: 'all', label: 'All Orders' },
  { key: 'processing', label: 'Processing' },
  { key: 'to_ship', label: 'To Ship' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' }
];

// Computed properties for filtered orders
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return ordersStore.recentOrders;
  }
  
  // Map 'to_ship' tab to 'processing' status (you can adjust this based on your backend logic)
  const statusMap: Record<string, string> = {
    'to_ship': 'processing'
  };
  
  const targetStatus = statusMap[activeTab.value] || activeTab.value;
  
  return ordersStore.recentOrders.filter(order => order.status === targetStatus);
});

const getOrderCount = (status: string) => {
  if (status === 'all') {
    return ordersStore.orders.length;
  }
  
  const statusMap: Record<string, string> = {
    'to_ship': 'processing'
  };
  
  const targetStatus = statusMap[status] || status;
  
  return ordersStore.orders.filter(order => order.status === targetStatus).length;
};

// Format money using utility
const formatMoney = (amount: number): string => {
  return formatMoneyUtil(amount, settingsStore.currency, settingsStore.locale, settingsStore.rates);
};

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
  // Map backend status to display labels
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'processing': 'To Ship',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
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

const getOrderItemThumbnail = (orderItem: any) => {
  // First try to find the product by ID
  const product = productsStore.products.find(p => p.id === orderItem.product_id);
  
  if (product) {
    return resolveVariantThumbnail(product, undefined, orderItem.variant_id);
  }
  
  // Fallback to placeholder if product not found
  return '/images/placeholder-product.svg';
};

const getActiveTabLabel = () => {
  const tab = statusTabs.find(t => t.key === activeTab.value);
  return tab ? tab.label : '';
};

const viewOrderDetails = (orderId: number) => {
  // In a real app, this would navigate to order details page
  // For now, we'll just show an alert
  alert(`Order details for #${orderId}`);
};

onMounted(async () => {
  await authStore.init();
   
  if (authStore.isLoggedIn) {
     await Promise.all([
       ordersStore.fetchOrders(),
       productsStore.fetchProducts()
     ]);
   }
 });
</script>