import axios from 'axios';
import type { ApiResponse } from '@/types';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/api`,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    
    // Normalize errors into { message: string, status?: number, details?: any }
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      details: error.response?.data
    };
    
    return Promise.reject(normalizedError);
  }
);

export const getCsrfCookie = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return;
  }
  await apiClient.get('/sanctum/csrf-cookie');
};

export const api = {
  get: <T>(url: string, params?: any): Promise<ApiResponse<T>> => 
    apiClient.get(url, { params }).then(res => res.data),
  
  post: <T>(url: string, data?: any): Promise<ApiResponse<T>> => 
    apiClient.post(url, data).then(res => res.data),
  
  put: <T>(url: string, data?: any): Promise<ApiResponse<T>> => 
    apiClient.put(url, data).then(res => res.data),
  
  delete: <T>(url: string): Promise<ApiResponse<T>> => 
    apiClient.delete(url).then(res => res.data),
};

export default apiClient;