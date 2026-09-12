import type { ProductStatus } from '@/modules/products/types/product'

export type PaginationMetaResponse = {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type PaginationMetaRequest = {
  page: number
  pageSize: number
  includeDeleted: boolean
  keyword?: string
}

export type ProductPaginationMetaRequest = PaginationMetaRequest & {
  categoryId?: string
  Status?: ProductStatus
}
