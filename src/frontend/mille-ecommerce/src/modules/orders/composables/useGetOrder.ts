import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { orderService } from '../services/orderService'
import type { GetOrderResponse } from '../types/order'

export function useGetOrder() {
  const order = ref<GetOrderResponse | null>(null)

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function fetchOrder(id: string): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      order.value = (await orderService.getOrder(id)).data
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<GetOrderResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to load order with ID: ${id}, please try again.`
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

  return { order, isLoading, errorMessage, errors, fetchOrder }
}
