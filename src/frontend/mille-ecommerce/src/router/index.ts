import { useAuthStore } from '@/modules/auth/stores/authStore'
import LoginView from '@/modules/auth/views/LoginView.vue'
import RegisterView from '@/modules/auth/views/RegisterView.vue'
import CategoryList from '@/modules/categories/views/CategoryList.vue'
import TestHomeView from '@/shared/components/Test-HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //Auth Routes
    {
      path: '/',
      name: 'HomeView',
      component: TestHomeView,
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
      path: '/category',
      name: 'CategoryList',
      component: CategoryList,
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from) => {
  const { isAuthenticated, restoreSession } = useAuthStore()
  restoreSession()
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  }
  return true
})

export default router
