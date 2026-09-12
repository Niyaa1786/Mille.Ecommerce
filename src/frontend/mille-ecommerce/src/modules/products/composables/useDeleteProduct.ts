import type { ApiResponse } from '@/shared/types/api'
import axios from 'axios'
import { ref } from 'vue'
import { productService } from '../services/productService'

export function useDeleteProduct() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function deleteProduct(id: string): Promise<boolean> {
    isLoading.value = false
    errorMessage.value = null
    errors.value = []

    try {
      await productService.deleteProduct(id)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<null>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to delete product with ID: ${id}.`
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
  return { isLoading, errorMessage, errors, deleteProduct }
}
