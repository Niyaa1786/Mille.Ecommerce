import z from 'zod'

export const createCategorySchema = z.object({
  name: z.string().nonempty('Fullname is required'),
  description: z.string().optional(),
})

export const updateCategorySchema = z.object({
  name: z.string().nonempty('Fullname is required'),
  description: z.string().optional(),
})

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>

export type CreateCategoryResponse = {
  id: number
  name: string
  description: string
}

export type UpdateCategoryResponse = {
  id: number
  name: string
  description: string
}

export type CategoriesResponse = {
  items: Category[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export type CategoryResponse = {
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}
