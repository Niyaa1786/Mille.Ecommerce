<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useUpdateOrderStatus } from '../composables/useUpdateOrderStatus'
import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
  type OrderSummaryDto,
  type UpdateOrderStatusRequest,
} from '../types/order'

const props = defineProps<{
  order: OrderSummaryDto | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errorMessage, errors, updateOrderStatus } = useUpdateOrderStatus()

const newStatus = ref<OrderStatus | ''>('')
const note = ref('')

/**
 * Valid transitions based on backend domain rules:
 * - Pending   -> Confirmed | Cancelled
 * - Confirmed -> Shipping  | Cancelled
 * - Shipping  -> Completed | Cancelled
 * - Completed / Cancelled -> (none)
 */
function getAllowedTransitions(current: string): OrderStatus[] {
  switch (current) {
    case 'Pending':
      return ['Confirmed', 'Cancelled']
    case 'Confirmed':
      return ['Shipping', 'Cancelled']
    case 'Shipping':
      return ['Completed', 'Cancelled']
    default:
      return []
  }
}

const allowedStatuses = computed<OrderStatus[]>(() =>
  props.order ? getAllowedTransitions(props.order.status) : [],
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      newStatus.value = ''
      note.value = ''
    }
  },
)

async function handleSubmit() {
  if (!props.order || !newStatus.value) return

  const payload: UpdateOrderStatusRequest = {
    newStatus: newStatus.value,
    note: note.value || undefined,
  }

  const success = await updateOrderStatus(props.order.id, payload)
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
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogDescription>
          Change status of order
          <span class="font-mono">{{ order?.id.slice(0, 8).toUpperCase() }}</span
          >.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Current status -->
        <div class="rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <span class="text-muted-foreground">Current: </span>
          <span class="font-medium">
            {{ order ? (ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status) : '—' }}
          </span>
        </div>

        <!-- New status -->
        <div class="grid gap-2">
          <Label>New Status</Label>
          <Select
            :model-value="newStatus"
            :disabled="!allowedStatuses.length"
            @update:model-value="(v) => (newStatus = v as OrderStatus)"
          >
            <SelectTrigger>
              <SelectValue
                :placeholder="
                  allowedStatuses.length ? 'Select new status' : 'No transitions available'
                "
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="s in allowedStatuses" :key="s" :value="s">
                {{ ORDER_STATUS_LABELS[s] }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Note -->
        <div class="grid gap-2">
          <Label>Note (optional)</Label>
          <Input v-model="note" placeholder="Reason / description..." maxlength="500" />
        </div>

        <!-- Errors -->
        <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>
        <ul v-if="errors.length" class="list-disc pl-4 text-sm text-destructive">
          <li v-for="(err, idx) in errors" :key="idx">{{ err }}</li>
        </ul>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          :disabled="isLoading"
          @click="handleOpenChange(false)"
        >
          Cancel
        </Button>
        <Button :disabled="isLoading || !newStatus" @click="handleSubmit">
          {{ isLoading ? 'Updating...' : 'Update Status' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
