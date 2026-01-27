import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
      meta: { title: 'Home' }
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/pages/ShopPage.vue'),
      meta: { title: 'Shop' }
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/pages/ProductPage.vue'),
      meta: { title: 'Product Details' }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/CartPage.vue'),
      meta: { title: 'Shopping Cart' }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/CheckoutPage.vue'),
      meta: { title: 'Checkout', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { title: 'Login', guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterPage.vue'),
      meta: { title: 'Register', guestOnly: true }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/AccountPage.vue'),
      meta: { title: 'My Account', requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/pages/OrdersPage.vue'),
      meta: { title: 'My Orders', requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: 'Page Not Found' }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.user && !authStore.loading) {
    await authStore.init();
  }
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }
  
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    next({ name: 'home' });
    return;
  }
  
  if (to.meta.title) {
    document.title = `${to.meta.title} - OnliShopping`;
  }
  
  next();
});

export default router;