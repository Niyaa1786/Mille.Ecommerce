export type PaginationMeta = {
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
