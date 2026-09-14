import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '@/modules/carts/stores/cartStore'

export function useLogout() {
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const router = useRouter()

  async function handleLogout() {
    authStore.logout()
    cartStore.clear()
    router.push('/login')
  }

  return { handleLogout }
}
