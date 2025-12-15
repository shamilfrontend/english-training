import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/Landing.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/Categories.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/training/:category?',
    name: 'Training',
    component: () => import('@/views/Training.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import('@/views/Review.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/Statistics.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
