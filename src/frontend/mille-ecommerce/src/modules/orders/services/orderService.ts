import type { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/services/axios'
import type {
  CancelOrderResponse,
  ConfirmPaymentResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  OrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '../types/order'
import type { OrderPaginationRequest } from '@/shared/types/pagination'

const BASE_URL = '/api/Orders'

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> {
    const res = await apiClient.post<ApiResponse<CreateOrderResponse>>(`${BASE_URL}`, data)
    return res.data
  },

  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusRequest,
  ): Promise<ApiResponse<UpdateOrderStatusResponse>> {
    const res = await apiClient.put<ApiResponse<UpdateOrderStatusResponse>>(
      `${BASE_URL}/${id}/status`,
      data,
    )
    return res.data
  },

  async confirmPayment(id: string): Promise<ApiResponse<ConfirmPaymentResponse>> {
    const res = await apiClient.post<ApiResponse<ConfirmPaymentResponse>>(
      `${BASE_URL}/${id}/confirm-payment`,
    )
    return res.data
  },
  async cancelOrder(id: string): Promise<ApiResponse<CancelOrderResponse>> {
    const res = await apiClient.post<ApiResponse<CancelOrderResponse>>(`${BASE_URL}/${id}/cancel`)
    return res.data
  },

  async getOrders(params: OrderPaginationRequest): Promise<ApiResponse<OrdersResponse>> {
    const res = await apiClient.get<ApiResponse<OrdersResponse>>(`${BASE_URL}`, { params })
    return res.data
  },

  async getMyOrders(params: OrderPaginationRequest): Promise<ApiResponse<OrdersResponse>> {
    const res = await apiClient.get<ApiResponse<OrdersResponse>>(`${BASE_URL}/my-orders`, {
      params,
    })
    return res.data
  },

  async getOrder(id: string): Promise<ApiResponse<GetOrderResponse>> {
    const res = await apiClient.get<ApiResponse<GetOrderResponse>>(`${BASE_URL}/${id}`)
    return res.data
  },
}
