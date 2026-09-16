<template>
  <div
    class="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/20"
  >
    <RouterLink :to="`/products/${product.id}`" class="contents">
      <div class="relative aspect-square overflow-hidden bg-muted">
        <img
          v-if="product.thumbnailUrl"
          :src="product.thumbnailUrl"
          :alt="product.name"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageOff class="h-8 w-8" />
        </div>

        <Badge
          v-if="product.status !== 'Active'"
          variant="secondary"
          class="absolute left-2 top-2 bg-background/90"
        >
          {{ PRODUCT_STATUS_LABELS[product.status] }}
        </Badge>
      </div>

      <div class="flex flex-1 flex-col gap-1 p-3">
        <span class="text-xs text-muted-foreground">{{ product.categoryName }}</span>
        <h3 class="line-clamp-2 text-sm font-medium leading-snug">{{ product.name }}</h3>
        <div class="mt-auto pt-2 text-sm font-semibold">
          {{
            product.status === 'Contact' ? 'Contact us' : `From ${formatCurrency(product.minPrice)}`
          }}
        </div>
      </div>
    </RouterLink>

    <div class="flex gap-2 p-3 pt-0">
      <Button as-child variant="outline" size="sm" class="flex-1">
        <RouterLink :to="`/products/${product.id}`">View details</RouterLink>
      </Button>
      <Button
        size="sm"
        class="flex-1"
        :disabled="isAdding || isFetchingVariant || product.status !== 'Active'"
        @click.stop.prevent="handleAddToCart"
      >
        <ShoppingCart class="h-4 w-4" />
        {{ isAdding || isFetchingVariant ? 'Adding...' : 'Add to cart' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ImageOff, ShoppingCart } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { PRODUCT_STATUS_LABELS, type ProductList } from '../types/product'
import { productService } from '../services/productService'
import { formatCurrency } from '@/shared/utils/format'
import { useAddToCart } from '@/modules/carts/composables/useAddToCart'

const props = defineProps<{
  product: ProductList
}>()

const { isLoading: isAdding, addToCart } = useAddToCart()
const isFetchingVariant = ref(false)

async function handleAddToCart() {
  if (isAdding.value || isFetchingVariant.value) return

  isFetchingVariant.value = true
  try {
    const res = await productService.getProduct(props.product.id)
    const variant = res.data?.variants.find((v) => v.stock > 0) ?? res.data?.variants[0]

    if (!variant) {
      toast.error('This product has no available options.')
      return
    }

    const success = await addToCart({ productVariantId: variant.id, quantity: 1 })
    if (success) {
      toast.success(`Added "${props.product.name}" to your cart`)
    } else {
      toast.error('Failed to add item to cart.')
    }
  } catch {
    toast.error('Failed to add item to cart.')
  } finally {
    isFetchingVariant.value = false
  }
}
</script>
