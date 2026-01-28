<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="h-24 w-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
         <h2 class="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
         <p class="text-gray-500 mb-6">Looks like you haven't added any products yet</p>
        <router-link
          to="/shop"
          class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
        >
          Start Shopping
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else>
        <div class="bg-white rounded-lg shadow-md mb-6">
          <div class="p-6">
            <div v-for="item in cartStore.items" :key="item.product.id" class="border-b last:border-b-0 pb-6 mb-6 last:pb-0 last:mb-0">
              <div class="flex gap-4">
                <!-- Product Image -->
                 <img
                    :src="item.variant.images[0]"
                    :alt="item.product.name"
                    class="w-24 h-24 object-cover rounded-lg"
                  />

                  <!-- Product Details -->
                  <div class="flex-1">
                    <div class="flex justify-between mb-2">
                      <h3 class="font-semibold text-lg">{{ item.product.name }}</h3>
                    </div>

                     <!-- Variant Info -->
                     <div class="mb-2 p-3 bg-gray-50 rounded-lg">
                       <p class="text-sm font-medium text-gray-700 mb-1">
                         Color: {{ item.variant.color }} • Size: {{ item.variant.size }} • {{ item.variant.packSize }} pcs/pack
                       </p>
                       <p class="text-xs text-gray-600">SKU: {{ item.variant.sku }}</p>
                     </div>
                    
                    <p class="text-gray-600 text-sm mb-4">{{ item.product.category }}</p>

                    <!-- Price and Quantity -->
                    <div class="flex justify-between items-center mb-4">
                      <div class="flex items-center gap-3">
                        <div class="flex items-center border border-gray-300 rounded-lg">
                          <button
                            @click="handleQuantityChange(item.productId, item.variantId, item.quantity - 1)"
                            class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            :disabled="item.quantity <= 1"
                          >
                            -
                          </button>
                          <span class="px-3 py-1 border-x border-gray-300">{{ item.quantity }}</span>
                          <button
                            @click="handleQuantityChange(item.productId, item.variantId, item.quantity + 1)"
                            class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <span class="text-sm text-gray-600">
                          {{ item.variant.stock }} available
                        </span>
                      </div>

                       <div class="text-right">
<div v-if="item.variant.salePrice && item.variant.salePrice < item.variant.price">
                            <span class="text-lg font-semibold">{{ formatMoney(item.variant.salePrice * item.quantity) }}</span>
                            <span class="text-sm text-gray-400 line-through block">{{ formatMoney(item.variant.price * item.quantity) }}</span>
                          </div>
                          <div v-else>
                            <span class="text-lg font-semibold">{{ formatMoney(item.variant.price * item.quantity) }}</span>
                          </div>
                       </div>
                    </div>
                     <!-- Remove Button -->
                     <div class="flex items-start">
                       <button
                         @click="handleRemoveItem(item.productId, item.variantId)"
                         class="text-red-500 hover:text-red-700 transition-colors"
                       >
                       <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     </button>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div class="space-y-2 mb-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>₱{{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span>₱10.00</span>
            </div>
            <div class="border-t pt-2">
              <div class="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₱{{ cartStore.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <router-link
              to="/shop"
              class="block w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2"
            >
              Continue Shopping
            </router-link>
            
            <router-link
              to="/checkout"
              class="block w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center"
            >
              Proceed to Checkout
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toast';
import { useSettingsStore } from '@/stores/settings';
import { formatMoney as formatMoneyUtil } from '@/utils/money';


const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const toastStore = useToastStore();
const settingsStore = useSettingsStore();


// Price formatting using currency utilities
const formatMoney = (amountILS: number): string => {
  return formatMoneyUtil(amountILS, settingsStore.currency, settingsStore.locale, settingsStore.rates);
};

const handleRemoveItem = (productId: number, variantId: string) => {
  cartStore.removeFromCart(productId, variantId);
  toastStore.info('Item removed from cart');
};

const handleQuantityChange = (productId: number, variantId: string, quantity: number) => {
  if (quantity <= 0) {
    cartStore.removeFromCart(productId, variantId);
    toastStore.info('Item removed from cart');
  } else {
    const item = cartStore.items.find(item => 
      item.productId === productId && item.variantId === variantId
    );
    if (item && quantity <= item.variant.stock) {
      cartStore.updateQuantity(productId, variantId, quantity);
    } else if (item && quantity > item.variant.stock) {
      toastStore.warning(`Only ${item.variant.stock} items available`);
    } else {
      cartStore.updateQuantity(productId, variantId, quantity);
    }
  }
};

onMounted(() => {
  cartStore.init();
  authStore.init();
});
</script>