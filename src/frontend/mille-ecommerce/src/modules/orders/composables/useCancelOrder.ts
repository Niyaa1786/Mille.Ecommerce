import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { orderService } from '../services/orderService'
import type { CancelOrderResponse } from '../types/order'

export function useCancelOrder() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function cancelOrder(id: string): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await orderService.cancelOrder(id)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<CancelOrderResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to cancel order with ID: ${id}.`
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, errorMessage, errors, cancelOrder }
}
