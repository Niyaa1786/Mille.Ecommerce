import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cartService } from '../services/cartService'
import type {
  AddToCartRequest,
  CartItem,
  GetCartResponse,
  UpdateCartItemRequest,
} from '../types/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const totalPrice = ref<number>(0)

  const totalItems = computed(() => items.value.length)
  const isEmpty = computed(() => items.value.length === 0)

  function applyAndSaveCart(data: GetCartResponse | null) {
    items.value = data?.items ?? []
    totalPrice.value = data?.totalPrice ?? 0

    localStorage.setItem('items', JSON.stringify(items.value))
    localStorage.setItem('totalPrice', totalPrice.value.toString())
  }

  function restoreCart() {
    const storedItems = localStorage.getItem('items')
    const storedTotalPrice = localStorage.getItem('totalPrice')
    items.value = storedItems ? JSON.parse(storedItems) : []
    totalPrice.value = storedTotalPrice ? Number(storedTotalPrice) : 0
  }

  async function refreshCart(): Promise<void> {
    const res = await cartService.getCart()
    applyAndSaveCart(res.data)
  }

  async function addToCart(data: AddToCartRequest) {
    const res = await cartService.addToCart(data)
    await refreshCart()
  }

  async function updateCartItem(id: number, data: UpdateCartItemRequest) {
    await cartService.updateCartItem(id, data)
    await refreshCart()
  }

  async function removeCartItem(id: number) {
    await cartService.removeCartItem(id)
    await refreshCart()
  }

  function clear() {
    items.value = []
    totalPrice.value = 0
    localStorage.removeItem('items')
    localStorage.removeItem('totalPrice')
  }

  return {
    items,
    totalPrice,
    totalItems,
    isEmpty,
    restoreCart,
    refreshCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clear,
  }
})
