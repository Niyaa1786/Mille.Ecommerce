import type { ApiResponse } from '@/shared/types/api'
import { categoryService } from '../services/categoryService'
import type { UpdateCategoryRequest, UpdateCategoryResponse } from '../types/category'
import axios from 'axios'
import { ref } from 'vue'

export function useUpdateCategory() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function updateCategory(id: number, data: UpdateCategoryRequest): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await categoryService.updateCategory(id, data)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<UpdateCategoryResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to update category with ID:${id}.`
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList)
        }
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, errorMessage, errors, updateCategory }
}
