import apiClient from './apiClient';
import { api } from './apiClient';
import type { Order, ShippingForm } from '@/types';
import { mockOrders } from '@/mocks/orders';

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

interface CreateOrderPayload {
  user_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    pieces_per_package?: number;
  }>;
  notes?: string;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      return mockOrders;
    }
    
    const response = await apiClient.get<{ data: Order[] }>('/api/orders');
    return response.data.data;
  },

  async getOrdersByUser(userId: number): Promise<Order[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      return mockOrders.filter(o => o.user_id === userId);
    }
    
    const response = await apiClient.get<{ 
      data: { 
        orders: Array<{
          id: string;
          order_number: string;
          status: string;
          status_label: string;
          subtotal: string;
          tax_amount: string;
          shipping_amount: string;
          total: string;
          total_items: number;
          created_at: string;
          shipping_address: {
            name: string;
            email?: string;
            phone: string;
            address: string;
            city: string;
            state?: string;
            postal_code: string;
            country?: string;
          };
          items: Array<{
            id: number;
            product_id: number;
            product_title: string;
            product_sku: string;
            quantity: number;
            unit_price: string;
            total_price: string;
            size: string | null;
            chosen_color: {
              name: string;
              value: string;
              slug: string;
            } | null;
            pieces_per_package: number;
            image: string | null;
          }>;
        }> 
      } 
    }>('/api/orders/by-user', {
      params: { user_id: userId }
    });
    
    return response.data.data.orders.map(order => ({
      id: order.id,
      user_id: userId,
      order_number: order.order_number,
      total: parseFloat(order.total),
      status: (order.status === 'pending_payment' ? 'pending' : order.status) as Order['status'],
      shipping_address: {
        name: order.shipping_address.name || '',
        phone: order.shipping_address.phone || '',
        address: order.shipping_address.address || '',
        city: order.shipping_address.city || '',
        postal_code: order.shipping_address.postal_code || '',
        email: order.shipping_address.email,
        country: order.shipping_address.country,
        state: order.shipping_address.state
      },
      items: order.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_title: item.product_title,
        product_sku: item.product_sku,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        total_price: parseFloat(item.total_price),
        size: item.size,
        chosen_color: item.chosen_color,
        pieces_per_package: item.pieces_per_package,
        image: item.image
      })),
      created_at: order.created_at,
      updated_at: order.created_at
    }));
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
    
    const response = await apiClient.get<{ data: Order }>(`/api/orders/${id}`);
    return response.data.data;
  },

  async createOrder(orderData: CreateOrderPayload): Promise<Order> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const newOrder: Order = {
        id: mockOrders.length + 1000,
        user_id: orderData.user_id,
        total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        shipping_address: {
          name: '',
          phone: '',
          address: '',
          city: '',
          postal_code: ''
        },
        items: orderData.items.map((item, index) => ({
          id: index + 1,
          product_id: item.product_id,
          product_title: '',
          product_sku: '',
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          size: item.size || null,
          chosen_color: item.color ? { name: item.color, value: item.color, slug: item.color.toLowerCase() } : null,
          pieces_per_package: item.pieces_per_package || 1,
          image: null
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockOrders.unshift(newOrder);
      
      return newOrder;
    }
    
    const response = await apiClient.post<{ data: Order }>('/api/orders', orderData);
    return response.data.data;
  }
};