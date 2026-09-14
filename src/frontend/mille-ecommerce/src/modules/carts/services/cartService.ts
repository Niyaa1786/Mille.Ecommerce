import apiClient from '@/shared/services/axios'
import type { ApiResponse } from '@/shared/types/api'
import type {
  AddToCartRequest,
  AddToCartResponse,
  GetCartResponse,
  RemoveCartItemResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
} from '../types/cart'

const BASE_URL = '/api/Carts'

export const cartService = {
  async getCart(): Promise<ApiResponse<GetCartResponse>> {
    const res = await apiClient.get<ApiResponse<GetCartResponse>>(`${BASE_URL}`)
    return res.data
  },

  async addToCart(data: AddToCartRequest): Promise<ApiResponse<AddToCartResponse>> {
    const res = await apiClient.post<ApiResponse<AddToCartResponse>>(`${BASE_URL}/items`, data)
    return res.data
  },

  async updateCartItem(
    cartItemId: number,
    data: UpdateCartItemRequest,
  ): Promise<ApiResponse<UpdateCartItemResponse>> {
    const res = await apiClient.put<ApiResponse<UpdateCartItemResponse>>(
      `${BASE_URL}/items/${cartItemId}`,
      data,
    )
    return res.data
  },

  async removeCartItem(cartItemId: number): Promise<ApiResponse<RemoveCartItemResponse>> {
    const res = await apiClient.delete<ApiResponse<RemoveCartItemResponse>>(
      `${BASE_URL}/items/${cartItemId}`,
    )
    return res.data
  },
}
