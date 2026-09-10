import { ref } from 'vue'
import { categoryService } from '../services/categoryService'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import type { CategoryResponse } from '../types/category'

export function useGetCategory() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  const category = ref<CategoryResponse | null>(null)

  async function fetchCategory(id: number) {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      category.value = (await categoryService.getCategory(id)).data
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<CategoryResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ??
          `Failed to load category with ID: ${id}, please try again.`
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  return { category, isLoading, errorMessage, errors, fetchCategory }
}
