import { ref } from 'vue'
import { type ProductsResponse } from '../types/product'
import type {
  PaginationMetaResponse,
  ProductPaginationMetaRequest,
} from '@/shared/types/pagination'
import { productService } from '../services/productService'
import type { ApiResponse } from '@/shared/types/api'
import axios from 'axios'

export function useGetProducts() {
  const products = ref<ProductsResponse['items']>([])
  const pagination = ref<PaginationMetaResponse>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  })

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function fetchProducts(params: ProductPaginationMetaRequest) {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await productService.getProducts(params)
      products.value = res.data?.items ?? []
      if (res.data) {
        pagination.value = {
          page: res.data.page,
          pageSize: res.data.pageSize,
          totalCount: res.data.totalCount,
          totalPages: res.data.totalPages,
        }
      }
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<ProductsResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to load products list'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  return { products, pagination, isLoading, errorMessage, errors, fetchProducts }
}
