<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDeleteProduct } from '../composables/useDeleteProduct'
import type { ProductList } from '../types/product'

const props = defineProps<{
  product: ProductList | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errorMessage, errors, deleteProduct } = useDeleteProduct()

async function handleConfirm() {
  if (!props.product) return
  const success = await deleteProduct(props.product.id)
  if (success) {
    emit('update:open', false)
    emit('success')
  }
}

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete
          <span class="font-semibold text-foreground">{{ product?.name }}</span
          >? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>
      <ul v-if="errors.length" class="list-disc pl-4 text-sm text-destructive">
        <li v-for="(err, idx) in errors" :key="idx">{{ err }}</li>
      </ul>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          :disabled="isLoading"
          @click="handleOpenChange(false)"
        >
          Cancel
        </Button>
        <Button variant="destructive" :disabled="isLoading" @click="handleConfirm">
          {{ isLoading ? 'Deleting...' : 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
