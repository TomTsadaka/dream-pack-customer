import { defineStore } from 'pinia';
import type { Order } from '@/types';
import { orderService } from '@/services/orderService';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    currentOrder: null,
    loading: false
  }),

  getters: {
    recentOrders: (state) => {
      return state.orders.slice().sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  },

  actions: {
    async fetchOrders() {
      try {
        this.loading = true;
        this.orders = await orderService.getOrders();
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchOrdersByUser(userId: number) {
      try {
        this.loading = true;
        this.orders = await orderService.getOrdersByUser(userId);
      } catch (error) {
        console.error('Failed to fetch user orders:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(id: number) {
      try {
        this.loading = true;
        const order = await orderService.getOrder(id);
        this.currentOrder = order;
        return order;
      } catch (error) {
        console.error('Failed to fetch order:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData: any) {
      try {
        this.loading = true;
        const order = await orderService.createOrder(orderData);
        this.orders.unshift(order);
        return { success: true, order };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Order creation failed' 
        };
      } finally {
        this.loading = false;
      }
    }
  }
});