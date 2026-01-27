import type { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 1001,
    user_id: 1,
    total: 159.97,
    status: 'delivered',
    shipping_address: {
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      postal_code: '10001'
    },
    items: [
      {
        product_id: 1,
        product_name: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 69.99
      },
      {
        product_id: 5,
        product_name: 'Stainless Steel Water Bottle',
        quantity: 2,
        price: 32.99
      },
      {
        product_id: 8,
        product_name: 'Ceramic Plant Pots Set',
        quantity: 1,
        price: 24.00
      }
    ],
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-15T10:20:00Z'
  },
  {
    id: 1002,
    user_id: 1,
    total: 299.99,
    status: 'shipped',
    shipping_address: {
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      postal_code: '10001'
    },
    items: [
      {
        product_id: 2,
        product_name: 'Smart Watch Pro',
        quantity: 1,
        price: 299.99
      }
    ],
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-20T09:15:00Z'
  },
  {
    id: 1003,
    user_id: 1,
    total: 84.98,
    status: 'processing',
    shipping_address: {
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      postal_code: '10001'
    },
    items: [
      {
        product_id: 9,
        product_name: 'Running Shoes',
        quantity: 1,
        price: 99.99
      },
      {
        product_id: 13,
        product_name: 'Fitness Resistance Bands',
        quantity: 2,
        price: 19.99
      }
    ],
    created_at: '2024-01-22T11:20:00Z',
    updated_at: '2024-01-22T11:20:00Z'
  }
];