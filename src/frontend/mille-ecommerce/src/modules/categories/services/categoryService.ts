import type { ApiResponse } from '@/shared/types/api'

import apiClient from '@/shared/services/axios'
import type {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from '../types/category'
import type { PaginationMetaRequest } from '@/shared/types/pagination'

const BASE_URL = '/api/Categories'

export const categoryService = {
  async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<CreateCategoryResponse>> {
    const res = await apiClient.post<ApiResponse<CreateCategoryResponse>>(`${BASE_URL}`, data)
    return res.data
  },

  async updateCategory(
    id: number,
    data: UpdateCategoryRequest,
  ): Promise<ApiResponse<UpdateCategoryResponse>> {
    const res = await apiClient.put<ApiResponse<UpdateCategoryResponse>>(`${BASE_URL}/${id}`, data)
    return res.data
  },

  async deleteCategory(id: number): Promise<ApiResponse<null>> {
    const res = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`)
    return res.data
  },

  async getCategory(id: number): Promise<ApiResponse<CategoryResponse>> {
    const res = await apiClient.get<ApiResponse<CategoryResponse>>(`${BASE_URL}/${id}`)
    return res.data
  },

  async getCategories(params: PaginationMetaRequest): Promise<ApiResponse<CategoriesResponse>> {
    const res = await apiClient.get<ApiResponse<CategoriesResponse>>(`${BASE_URL}`, {
      params: params,
    })
    return res.data
  },
}
