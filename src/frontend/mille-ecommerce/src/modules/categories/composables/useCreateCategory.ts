import { ref } from 'vue'
import type { CreateCategoryRequest, CreateCategoryResponse } from '../types/category'
import { categoryService } from '../services/categoryService'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'

export function useCreateCategory() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function createCategory(data: CreateCategoryRequest): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await categoryService.createCategory(data)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<CreateCategoryResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? `Failed to create category.`
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

  return { isLoading, errorMessage, errors, createCategory }
}
