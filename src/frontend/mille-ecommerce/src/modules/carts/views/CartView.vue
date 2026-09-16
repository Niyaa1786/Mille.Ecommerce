<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">Shopping Cart</h1>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col gap-4">
      <Skeleton v-for="n in 3" :key="n" class="h-24 w-full rounded-lg" />
    </div>

    <!-- Error -->
    <div
      v-else-if="errorMessage"
      class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-20 text-center"
    >
      <p class="font-medium text-destructive">{{ errorMessage }}</p>
      <Button variant="outline" size="sm" @click="fetchCart">Retry</Button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="isEmpty"
      class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-24 text-center"
    >
      <ShoppingCart class="h-12 w-12 text-muted-foreground" />
      <p class="font-medium">Your cart is empty</p>
      <p class="text-sm text-muted-foreground">Browse our products and add something you like.</p>
      <RouterLink to="/products">
        <Button class="mt-2">Continue shopping</Button>
      </RouterLink>
    </div>

    <!-- Data -->
    <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="flex flex-col gap-4 lg:col-span-2">
        <div v-for="item in items" :key="item.id" class="flex gap-4 rounded-lg border p-4">
          <div class="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              v-if="item.thumbnailUrl"
              :src="item.thumbnailUrl"
              :alt="item.productName"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center text-muted-foreground"
            >
              <ImageOff class="h-6 w-6" />
            </div>
          </div>

          <div class="flex flex-1 flex-col justify-between">
            <div>
              <h3 class="text-sm font-medium leading-snug">{{ item.productName }}</h3>
              <p class="mt-1 text-xs text-muted-foreground">
                <span v-if="item.size">Size: {{ item.size }}</span>
                <span v-if="item.size && item.color"> · </span>
                <span v-if="item.color">Color: {{ item.color }}</span>
              </p>
              <p v-if="item.sku" class="text-xs text-muted-foreground">SKU: {{ item.sku }}</p>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center rounded-md border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  :disabled="pendingItemId === item.id || item.quantity <= 1"
                  @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                >
                  <Minus class="h-4 w-4" />
                </Button>
                <span class="w-8 text-center text-sm">{{ item.quantity }}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  :disabled="pendingItemId === item.id"
                  @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                >
                  <Plus class="h-4 w-4" />
                </Button>
              </div>

              <span class="text-sm font-semibold">{{ formatCurrency(item.subtotal) }}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            class="shrink-0 hover:text-destructive"
            :disabled="pendingItemId === item.id"
            @click="handleRemoveItem(item.id)"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Summary -->
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Items</span>
              <span>{{ totalItems }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Subtotal</span>
              <span>{{ formatCurrency(totalPrice) }}</span>
            </div>
            <Separator />
            <div class="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{{ formatCurrency(totalPrice) }}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button class="w-full" size="lg" @click="handleCheckout">Checkout</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ImageOff, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useGetCart } from '../composables/useGetCart'
import { useUpdateCartItem } from '../composables/useUpdateCartItem'
import { useRemoveCartItem } from '../composables/useRemoveCartItem'
import { formatCurrency } from '@/shared/utils/format'

const router = useRouter()

const { items, totalPrice, totalItems, isEmpty, isLoading, errorMessage, fetchCart } = useGetCart()
const { updateCartItem } = useUpdateCartItem()
const { removeCartItem } = useRemoveCartItem()

const pendingItemId = ref<number | null>(null)

async function handleUpdateQuantity(cartItemId: number, quantity: number) {
  if (quantity < 1) return

  pendingItemId.value = cartItemId
  const success = await updateCartItem(cartItemId, { quantity })
  if (!success) {
    toast.error('Failed to update item quantity.')
  }
  pendingItemId.value = null
}

async function handleRemoveItem(cartItemId: number) {
  pendingItemId.value = cartItemId
  const success = await removeCartItem(cartItemId)
  if (success) {
    toast.success('Item removed from cart')
  } else {
    toast.error('Failed to remove item.')
  }
  pendingItemId.value = null
}

function handleCheckout() {
  router.push('/checkout')
}

onMounted(fetchCart)
</script>
