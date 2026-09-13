<script setup lang="ts">
import { watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetProduct } from '../composables/useGetProduct'
import { PRODUCT_STATUS_LABELS } from '../types/product'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import Table from '@/components/ui/table/Table.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'

const props = defineProps<{
  productId: string | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { product, isLoading, errorMessage, fetchProduct } = useGetProduct()

watch(
  [() => props.open, () => props.productId],
  ([isOpen, id]) => {
    if (isOpen && id) fetchProduct(id)
  },
  { immediate: true },
)

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Product Details</DialogTitle>
        <DialogDescription>Full product information.</DialogDescription>
      </DialogHeader>

      <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

      <div v-if="isLoading" class="space-y-4">
        <Skeleton class="h-6 w-1/2" />
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-24 w-full" />
      </div>

      <div v-else-if="product" class="space-y-5">
        <div class="space-y-1">
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="text-sm text-muted-foreground">
            {{ product.description || 'No description' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-muted-foreground text-xs uppercase">Category</span>
            <p class="font-medium">{{ product.categoryName || '-' }}</p>
          </div>
          <div>
            <span class="text-muted-foreground text-xs uppercase">Status</span>
            <p>
              <Badge variant="secondary">{{ PRODUCT_STATUS_LABELS[product.status] }}</Badge>
            </p>
          </div>
          <div>
            <span class="text-muted-foreground text-xs uppercase">Created At</span>
            <p class="font-medium">{{ formatDate(product.createdAt) }}</p>
          </div>
          <div>
            <span class="text-muted-foreground text-xs uppercase">Updated At</span>
            <p class="font-medium">{{ formatDate(product.updatedAt) }}</p>
          </div>
        </div>

        <div v-if="product.images?.length" class="space-y-2">
          <h4 class="font-medium">Images</h4>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="img in product.images"
              :key="img.id"
              class="relative w-24 h-24 border rounded-md overflow-hidden"
            >
              <img :src="img.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
              <span
                v-if="img.isThumbnail"
                class="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] text-center"
              >
                Thumbnail
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="font-medium">Variants ({{ product.variants?.length ?? 0 }})</h4>
          <div class="rounded-md border overflow-hidden">
            <Table>
              <TableHeader class="bg-muted/50">
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead class="text-right">Price</TableHead>
                  <TableHead class="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="v in product.variants" :key="v.id">
                  <TableCell class="font-mono text-xs">{{ v.sku }}</TableCell>
                  <TableCell>{{ v.size || '-' }}</TableCell>
                  <TableCell>{{ v.color || '-' }}</TableCell>
                  <TableCell class="text-right">{{ formatCurrency(v.price) }}</TableCell>
                  <TableCell class="text-right">{{ v.stock }}</TableCell>
                </TableRow>

                <TableRow v-if="!product.variants?.length">
                  <TableCell colspan="5" class="h-24 text-center text-muted-foreground">
                    No variants
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
