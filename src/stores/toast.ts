import { ref } from 'vue';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

let toastId = 0;

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = `toast-${++toastId}`;
  const newToast = { ...toast, id };
  
  toasts.value.push(newToast);
  
  const duration = toast.duration || 3000;
  setTimeout(() => {
    removeToast(id);
  }, duration);
};

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

export const useToastStore = () => {
  const success = (message: string, title?: string, duration?: number) => {
    addToast({ type: 'success', message, title, duration });
  };

  const error = (message: string, title?: string, duration?: number) => {
    addToast({ type: 'error', message, title, duration });
  };

  const warning = (message: string, title?: string, duration?: number) => {
    addToast({ type: 'warning', message, title, duration });
  };

  const info = (message: string, title?: string, duration?: number) => {
    addToast({ type: 'info', message, title, duration });
  };

  return {
    success,
    error,
    warning,
    info,
    removeToast,
    toasts
  };
};