import { defineStore } from 'pinia';
import type { User, LoginForm, RegisterForm } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && !!state.user
  },

  actions: {
    async init() {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      }
    },

    async login(credentials: LoginForm) {
      try {
        this.loading = true;
        const response = await authService.login(credentials);
        
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login failed' 
        };
      } finally {
        this.loading = false;
      }
    },

    async register(userData: RegisterForm) {
      try {
        this.loading = true;
        const response = await authService.register(userData);
        
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Registration failed' 
        };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },

    async fetchUser() {
      try {
        const user = await authService.getUser();
        this.user = user;
        this.isAuthenticated = true;
        
        localStorage.setItem('auth_user', JSON.stringify(user));
      } catch (error) {
        this.logout();
      }
    }
  }
});