import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { orderService } from '../services/orderService'
import type { CreateOrderRequest, CreateOrderResponse } from '../types/order'

export function useCreateOrder() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse | null> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await orderService.createOrder(data)
      return res.data
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<CreateOrderResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to create order.'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, errorMessage, errors, createOrder }
}
