<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="!authStore.isLoggedIn" class="text-center py-12">
      <p class="text-gray-500 text-lg mb-4">Please login to proceed with checkout</p>
      <router-link
        to="/login"
        class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
      >
        Login
      </router-link>
    </div>

    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>

      <div v-if="cartStore.items.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <router-link
          to="/shop"
          class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
        >
          Start Shopping
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-6">Shipping Information</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  v-model="shippingForm.name"
                  type="text"
                  required
                  class="input"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  v-model="shippingForm.phone"
                  type="tel"
                  required
                  class="input"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                v-model="shippingForm.address"
                type="text"
                required
                class="input"
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  v-model="shippingForm.city"
                  type="text"
                  required
                  class="input"
                  placeholder="New York"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  v-model="shippingForm.postal_code"
                  type="text"
                  required
                  class="input"
                  placeholder="10001"
                />
              </div>
            </div>

            <!-- Payment Method -->
            <h2 class="text-xl font-semibold mb-6">Payment Method</h2>
            
            <div class="space-y-3 mb-6">
              <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="cod"
                  class="mr-3"
                />
                <div>
                  <div class="font-medium">Cash on Delivery</div>
                  <div class="text-sm text-gray-600">Pay when you receive your order</div>
                </div>
              </label>
              
              <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="card"
                  class="mr-3"
                />
                <div>
                  <div class="font-medium">Credit/Debit Card</div>
                  <div class="text-sm text-gray-600">Pay securely with your card</div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              :disabled="ordersStore.loading"
              class="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ ordersStore.loading ? 'Processing...' : 'Place Order' }}
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

            <!-- Cart Items -->
            <div class="space-y-3 mb-4">
              <div
                v-for="item in cartStore.items"
                :key="item.product.id"
                class="flex justify-between text-sm"
              >
                <div class="flex-1">
                  <span class="font-medium">{{ item.quantity }} × {{ item.product.name }}</span>
                </div>
                <span>
                  ${{ ((item.product.salePrice || item.product.price) * item.quantity).toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Summary -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span>$10.00</span>
              </div>
              <div class="border-t pt-2">
                <div class="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${{ cartStore.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useOrdersStore } from '@/stores/orders';
import type { ShippingForm } from '@/types';
import Toast from '@/components/Toast.vue';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const ordersStore = useOrdersStore();

const shippingForm = ref<ShippingForm>({
  name: '',
  phone: '',
  address: '',
  city: '',
  postal_code: ''
});

const paymentMethod = ref('cod');

const handleSubmit = async () => {
  try {
    const orderItems = cartStore.items.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.salePrice || item.product.price
    }));

    const orderData = {
      items: orderItems,
      shipping_address: shippingForm.value,
      total: cartStore.total
    };

    const result = await ordersStore.createOrder(orderData);
    
    if (result.success) {
      cartStore.clearCart();
      
      const toastRef = document.querySelector('Toast') as any;
      if (toastRef) {
        toastRef.success('Order placed successfully!');
      }
      
      router.push('/orders');
    } else {
      const toastRef = document.querySelector('Toast') as any;
      if (toastRef) {
        toastRef.error(result.message);
      }
    }
  } catch (error) {
    const toastRef = document.querySelector('Toast') as any;
    if (toastRef) {
      toastRef.error('Failed to place order. Please try again.');
    }
  }
};

onMounted(() => {
  if (authStore.isLoggedIn && authStore.user) {
    shippingForm.value.name = authStore.user.name;
  }
  cartStore.init();
});
</script>