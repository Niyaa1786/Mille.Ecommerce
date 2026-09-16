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
import { useCancelOrder } from '@/modules/orders/composables/useCancelOrder'
import type { OrderSummaryDto } from '@/modules/orders/types/order'

const props = defineProps<{
  order: OrderSummaryDto | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errorMessage, cancelOrder } = useCancelOrder()

async function handleConfirm() {
  if (!props.order) return
  const success = await cancelOrder(props.order.id)
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
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel order
          <span class="font-semibold text-foreground">
            #{{ order?.id.slice(0, 8).toUpperCase() }}
          </span>
          ? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          :disabled="isLoading"
          @click="handleOpenChange(false)"
        >
          Keep order
        </Button>
        <Button variant="destructive" :disabled="isLoading" @click="handleConfirm">
          {{ isLoading ? 'Cancelling...' : 'Cancel order' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
