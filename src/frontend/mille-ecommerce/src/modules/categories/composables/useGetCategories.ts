import { ref } from 'vue'
import { type CategoriesResponse } from '../types/category'
import type { PaginationMetaRequest, PaginationMetaResponse } from '@/shared/types/pagination'
import { categoryService } from '../services/categoryService'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'

export function useGetCategories() {
  const categories = ref<CategoriesResponse['items']>([])
  const pagination = ref<PaginationMetaResponse>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  })

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function fetchCategories(params: PaginationMetaRequest) {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await categoryService.getCategories(params)
      categories.value = res.data?.items ?? []
      if (res.data) {
        pagination.value = {
          page: res.data.page,
          pageSize: res.data.pageSize,
          totalCount: res.data.totalCount,
          totalPages: res.data.totalPages,
        }
      }
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<CategoriesResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to load category list'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  return { categories, pagination, isLoading, errorMessage, errors, fetchCategories }
}
