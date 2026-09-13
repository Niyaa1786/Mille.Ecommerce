import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { orderService } from '../services/orderService'
import type { ConfirmPaymentResponse } from '../types/order'

export function useConfirmPayment() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function confirmPayment(id: string): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await orderService.confirmPayment(id)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<ConfirmPaymentResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to confirm payment for order: ${id}.`
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

  return { isLoading, errorMessage, errors, confirmPayment }
}
