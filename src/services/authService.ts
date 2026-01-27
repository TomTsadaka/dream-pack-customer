import { api, getCsrfCookie } from './apiClient';
import type { User, LoginForm, RegisterForm } from '@/types';

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

export const authService = {
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: credentials.email,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };
      
      return {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    await getCsrfCookie();
    const response = await api.post<{ user: User; token: string }>('/login', credentials);
    return response.data;
  },

  async register(userData: RegisterForm): Promise<{ user: User; token: string }> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const mockUser: User = {
        id: 1,
        name: userData.name,
        email: userData.email,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };
      
      return {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    await getCsrfCookie();
    const response = await api.post<{ user: User; token: string }>('/register', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      return;
    }
    
    await api.post('/logout');
  },

  async getUser(): Promise<User> {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await simulateLatency();
      
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };
      
      return mockUser;
    }
    
    const response = await api.get<User>('/api/user');
    return response.data;
  }
};