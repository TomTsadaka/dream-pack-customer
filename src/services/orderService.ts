import { api } from './apiClient';
import type { Order, ShippingForm } from '@/types';
import { mockOrders } from '@/mocks/orders';

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      return mockOrders;
    }
    
    const response = await api.get<Order[]>('/api/orders');
    return response.data;
  },

  async getOrder(id: number): Promise<Order> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const order = mockOrders.find(o => o.id === id);
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    }
    
    const response = await api.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData: {
    items: Array<{
      product_id: number;
      product_name: string;
      quantity: number;
      price: number;
    }>;
    shipping_address: ShippingForm;
    total: number;
  }): Promise<Order> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const newOrder: Order = {
        id: mockOrders.length + 1000,
        user_id: 1,
        total: orderData.total,
        status: 'pending',
        shipping_address: orderData.shipping_address,
        items: orderData.items,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockOrders.unshift(newOrder);
      
      return newOrder;
    }
    
    const response = await api.post<Order>('/api/orders', orderData);
    return response.data;
  }
};