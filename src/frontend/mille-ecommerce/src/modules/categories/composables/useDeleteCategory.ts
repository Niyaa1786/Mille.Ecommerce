import { ref } from 'vue'
import { categoryService } from '../services/categoryService'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'

export function useDeleteCategory() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function deleteCategory(id: number): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await categoryService.deleteCategory(id)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<null>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to delete category with ID: ${id}.`
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

  return { isLoading, errorMessage, errors, deleteCategory }
}
