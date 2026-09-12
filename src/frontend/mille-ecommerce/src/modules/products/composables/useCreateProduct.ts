import { ref } from 'vue'
import type { CreateProductRequest, CreateProductResponse } from '../types/product'
import { productService } from '../services/productService'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'

export function useCreateProduct() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function createProduct(data: CreateProductRequest): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []
    try {
      await productService.createProduct(data)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<CreateProductResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? `Failed to create product.`
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
  return { isLoading, errorMessage, errors, createProduct }
}
