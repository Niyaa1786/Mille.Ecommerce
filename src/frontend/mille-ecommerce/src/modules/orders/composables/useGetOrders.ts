import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import type { OrderPaginationRequest, PaginationMetaResponse } from '@/shared/types/pagination'
import { orderService } from '../services/orderService'
import type { OrdersResponse } from '../types/order'

export function useGetOrders() {
  const orders = ref<OrdersResponse['orders']>([])
  const pagination = ref<PaginationMetaResponse>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  })

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function fetchOrders(params: OrderPaginationRequest): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await orderService.getOrders(params)
      orders.value = res.data?.orders ?? []
      if (res.data) {
        pagination.value = {
          page: res.data.page,
          pageSize: res.data.pageSize,
          totalCount: res.data.totalCount,
          totalPages: res.data.totalPages,
        }
      }
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<OrdersResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to load orders list.'
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

  return { orders, pagination, isLoading, errorMessage, errors, fetchOrders }
}
