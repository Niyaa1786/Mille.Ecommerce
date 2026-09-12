import { useAuthStore } from '@/modules/auth/stores/authStore'
import LoginView from '@/modules/auth/views/LoginView.vue'
import RegisterView from '@/modules/auth/views/RegisterView.vue'
import CategoryList from '@/modules/categories/views/CategoryList.vue'
import ProductList from '@/modules/products/views/ProductList.vue'
import Home from '@/shared/components/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //Auth Routes
    {
      path: '/',
      name: 'HomeView',
      component: Home,
      meta: { layout: 'admin' },
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        layout: 'auth',
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
      meta: {
        layout: 'auth',
      },
    },
    //Admin Routes
    {
      path: '/categories',
      name: 'CategoryList',
      component: CategoryList,
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/products',
      name: 'ProductList',
      component: ProductList,
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  authStore.restoreSession()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' }
  }
  return true
})

export default router
