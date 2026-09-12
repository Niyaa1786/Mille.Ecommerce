import { ref } from 'vue'
import { type ProductResponse, type ProductsResponse } from '../types/product'
import { productService } from '../services/productService'
import type { ApiResponse } from '@/shared/types/api'
import axios from 'axios'

export function useGetProduct() {
  const product = ref<ProductResponse | null>(null)

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function fetchProduct(id: string) {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      product.value = (await productService.getProduct(id)).data
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<ProductResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to load product with ID: ${id}, please try again.`
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  return { product, isLoading, errorMessage, errors, fetchProduct }
}
