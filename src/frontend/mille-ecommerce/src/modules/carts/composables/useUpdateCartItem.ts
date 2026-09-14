import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { useCartStore } from '../stores/cartStore'
import type { UpdateCartItemRequest } from '../types/cart'

export function useUpdateCartItem() {
  const cartStore = useCartStore()

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function updateCartItem(cartItemId: number, data: UpdateCartItemRequest): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await cartStore.updateCartItem(cartItemId, data)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to update cart item #${cartItemId}.`
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      } else {
        errorMessage.value = `Failed to update cart item #${cartItemId}.`
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, errorMessage, errors, updateCartItem }
}
