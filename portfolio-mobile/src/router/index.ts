import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import { authService } from '@/services/api';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/tabs/',
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardPage.vue'),
      },
      {
        path: 'works',
        name: 'Works',
        component: () => import('@/views/WorksPage.vue'),
      },
      {
        path: 'experience',
        name: 'Experience',
        component: () => import('@/views/ExperiencePage.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/SettingsPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const loggedIn = authService.isAuthenticated();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!loggedIn) {
      return next('/login');
    }
  }

  if (to.matched.some((record) => record.meta.guestOnly)) {
    if (loggedIn) {
      return next('/tabs/dashboard');
    }
  }

  next();
});

export default router;
