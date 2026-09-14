import { z } from 'zod'

export const addToCartSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().int().gt(0, 'Quantity must be greater than 0'),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().gt(0, 'Quantity must be greater than 0'),
})

export type AddToCartRequest = z.infer<typeof addToCartSchema>
export type UpdateCartItemRequest = z.infer<typeof updateCartItemSchema>

export type AddToCartResponse = {
  message: string
  productName: string
  totalCartItems: number
}

export type UpdateCartItemResponse = {
  cartItemId: number
  quantity: number
  itemSubTotal: number
  cartTotalAmount: number
}

export type RemoveCartItemResponse = {
  message: string
}

export type GetCartResponse = {
  cartId: string
  items: CartItem[]
  totalPrice: number
}

export type CartItem = {
  id: number
  productVariantId: string
  productName: string
  sku: string | null
  size: string | null
  color: string | null
  price: number
  quantity: number
  subtotal: number
  thumbnailUrl: string | null
}
