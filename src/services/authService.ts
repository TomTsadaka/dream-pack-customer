import apiClient from './apiClient';
import { api } from './apiClient';
import type { User, LoginForm, RegisterForm } from '@/types';

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

export const authService = {
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const mockUserId = credentials.email === 'kimtestaccount@gmail.com' ? 8 : 1;
      const mockUser: User = {
        id: mockUserId,
        name: mockUserId === 8 ? 'Kim Test' : 'John Doe',
        email: credentials.email,
        phone: '+1234567890',
        address: '123 Main Street',
        city: 'New York',
        country: 'United States',
        postal_code: '10001',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };
      
      return {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return {
      user: response.data.data.user,
      token: response.data.data.token
    };
  },

  async register(userData: RegisterForm): Promise<{ user: User; token: string }> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const mockUser: User = {
        id: 1,
        name: userData.name,
        email: userData.email,
        phone: userData.contact_number,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postal_code: userData.postal_code,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };
      
      return {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    return {
      user: response.data.data.user,
      token: response.data.data.token
    };
  },

  async logout(): Promise<void> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      return;
    }
    
    await apiClient.post('/api/auth/logout');
  },
 
  async getUser(): Promise<User> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main Street',
        city: 'New York',
        country: 'United States',
        postal_code: '10001',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };
      
      return mockUser;
    }
    
    const response = await apiClient.get<{ data: User }>('/api/auth/user');
    return response.data.data;
  }
};