import { ref } from 'vue'
import type { UpdateProductRequest, UpdateProductResponse } from '../types/product'
import { productService } from '../services/productService'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'

export function useUpdateProduct() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function updateProduct(id: string, data: UpdateProductRequest): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await productService.updateProduct(id, data)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<UpdateProductResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to update product with ID: ${id}.`
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
  return { isLoading, errorMessage, errors, updateProduct }
}
