import { computed, ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { useCartStore } from '../stores/cartStore'

export function useGetCart() {
  const cartStore = useCartStore()

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function fetchCart(): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await cartStore.refreshCart()
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to load cart.'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      } else {
        errorMessage.value = 'Failed to load cart.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    items: computed(() => cartStore.items),
    totalPrice: computed(() => cartStore.totalPrice),
    totalItems: cartStore.totalItems,
    isEmpty: cartStore.isEmpty,
    isLoading,
    errorMessage,
    errors,
    fetchCart,
    refresh: fetchCart,
  }
}
