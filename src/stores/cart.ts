import { defineStore } from 'pinia';
import type { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  loading: boolean;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    loading: false
  }),

  getters: {
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        const price = item.variant.salePrice || item.variant.price;
        return total + (price * item.quantity);
      }, 0);
    },
    
    total: (state) => {
      const subtotal = state.items.reduce((total, item) => {
        const price = item.variant.salePrice || item.variant.price;
        return total + (price * item.quantity);
      }, 0);
      return subtotal + 10; // $10 shipping
    },
    
    getItemByVariantId: (state) => (productId: number, variantId: string) => {
      return state.items.find(item => item.productId === productId && item.variantId === variantId);
    }
  },

  actions: {
    init() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    },

    addToCart(product: Product, variant: ProductVariant, quantity = 1) {
      const existingItem = this.items.find(item => 
        item.productId === product.id && item.variantId === variant.variantId
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: Date.now(),
          productId: product.id,
          variantId: variant.variantId,
          product,
          variant,
          quantity
        });
      }
      
      this.saveCart();
    },

    removeFromCart(productId: number, variantId: string) {
      this.items = this.items.filter(item => 
        !(item.productId === productId && item.variantId === variantId)
      );
      this.saveCart();
    },

    updateQuantity(productId: number, variantId: string, quantity: number) {
      const item = this.items.find(item => 
        item.productId === productId && item.variantId === variantId
      );
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId, variantId);
        } else {
          item.quantity = quantity;
          this.saveCart();
        }
      }
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  }
});