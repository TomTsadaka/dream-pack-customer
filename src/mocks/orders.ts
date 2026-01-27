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
        variant_id: 'bubble-wrap-red-small-6',
        product_name: 'Wireless Bluetooth Headphones',
        variant_name: 'Red Small (6 pack)',
        quantity: 1,
        price: 69.99
      },
      {
        product_id: 5,
        variant_id: 'corrugated-boxes-brown-standard-25',
        product_name: 'Stainless Steel Water Bottle',
        variant_name: 'Brown Standard (25 pack)',
        quantity: 2,
        price: 32.99
      },
      {
        product_id: 8,
        variant_id: 'plastic-containers-gray-standard-50',
        product_name: 'Ergonomic Office Chair',
        variant_name: 'Gray Standard (50 pack)',
        quantity: 1,
        price: 24.99
      }
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-18T14:22:00Z'
  },
  {
    id: 1002,
    user_id: 2,
    total: 89.98,
    status: 'shipped',
    shipping_address: {
      name: 'Jane Smith',
      phone: '+0987654321',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      postal_code: '90001'
    },
    items: [
      {
        product_id: 2,
        variant_id: 'stretch-film-blue-medium-12',
        product_name: 'Organic Cotton T-Shirt',
        variant_name: 'Blue Medium (12 pack)',
        quantity: 3,
        price: 29.99
      }
    ],
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-21T16:45:00Z'
  },
  {
    id: 1003,
    user_id: 1,
    total: 219.97,
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
        product_id: 4,
        variant_id: 'foam-sheets-green-large-24',
        product_name: 'Smartphone Case',
        variant_name: 'Green Large (24 pack)',
        quantity: 1,
        price: 19.99
      },
      {
        product_id: 7,
        variant_id: 'folding-cartons-black-heavy-duty-50',
        product_name: 'Wireless Mouse',
        variant_name: 'Black Heavy Duty (50 pack)',
        quantity: 2,
        price: 39.99
      },
      {
        product_id: 9,
        variant_id: 'pet-bottles-clear-500ml-6',
        product_name: 'USB-C Cable',
        variant_name: 'Clear 500ml (6 pack)',
        quantity: 3,
        price: 14.99
      }
    ],
    created_at: '2024-01-22T13:20:00Z',
    updated_at: '2024-01-22T13:20:00Z'
  },
  {
    id: 1004,
    user_id: 3,
    total: 149.95,
    status: 'pending',
    shipping_address: {
      name: 'Mike Johnson',
      phone: '+1122334455',
      address: '789 Pine Street',
      city: 'Chicago',
      postal_code: '60601'
    },
    items: [
      {
        product_id: 6,
        variant_id: 'mailer-boxes-kraft-standard-10',
        product_name: 'Running Shoes',
        variant_name: 'Kraft Standard (10 pack)',
        quantity: 1,
        price: 149.95
      }
    ],
    created_at: '2024-01-23T11:45:00Z',
    updated_at: '2024-01-23T11:45:00Z'
  }
];