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

import { useConfirmPayment } from '../composables/useConfirmPayment'
import type { OrderSummaryDto } from '../types/order'
import { formatCurrency } from '@/shared/utils/format'

const props = defineProps<{
  order: OrderSummaryDto | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errorMessage, errors, confirmPayment } = useConfirmPayment()

async function handleConfirm() {
  if (!props.order) return
  const success = await confirmPayment(props.order.id)
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
        <DialogTitle>Confirm COD Payment</DialogTitle>
        <DialogDescription>
          Confirm that the customer has paid
          <span class="font-semibold text-foreground">
            {{ order ? formatCurrency(order.totalAmount) : '' }}
          </span>
          in cash for this order.
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
        <Button :disabled="isLoading" @click="handleConfirm">
          {{ isLoading ? 'Confirming...' : 'Confirm Payment' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
