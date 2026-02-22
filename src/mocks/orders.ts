import type { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 1001,
    user_id: 1,
    order_number: 'ORD-TEST001',
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
        id: 1,
        product_id: 1,
        product_title: 'Test Product 1',
        product_sku: 'TP-001',
        quantity: 1,
        unit_price: 69.99,
        total_price: 69.99,
        size: 'Medium',
        chosen_color: { name: 'Red', value: 'Red', slug: 'red' },
        pieces_per_package: 6,
        image: null
      },
      {
        id: 2,
        product_id: 5,
        product_title: 'Test Product 2',
        product_sku: 'TP-002',
        quantity: 2,
        unit_price: 32.99,
        total_price: 65.98,
        size: 'Large',
        chosen_color: { name: 'Blue', value: 'Blue', slug: 'blue' },
        pieces_per_package: 25,
        image: null
      }
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-18T14:22:00Z'
  },
  {
    id: 1002,
    user_id: 8,
    order_number: 'ORD-TEST002',
    total: 89.98,
    status: 'shipped',
    shipping_address: {
      name: 'Kim Test',
      phone: '+0987654321',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      postal_code: '90001'
    },
    items: [
      {
        id: 3,
        product_id: 2,
        product_title: 'Test Product 3',
        product_sku: 'TP-003',
        quantity: 3,
        unit_price: 29.99,
        total_price: 89.97,
        size: 'Small',
        chosen_color: null,
        pieces_per_package: 12,
        image: null
      }
    ],
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-21T16:45:00Z'
  }
];