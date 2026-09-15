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
import { useDeleteAddress } from '@/modules/users/composables/useDeleteAddress'
import type { AddressDto } from '@/modules/users/types/user'
import { toast } from 'vue-sonner'

const props = defineProps<{
  address: AddressDto | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errorMessage, deleteAddress } = useDeleteAddress()

async function handleConfirm() {
  if (!props.address) return
  const success = await deleteAddress(props.address.id)
  if (success) {
    toast.success('Address deleted successfully')
    emit('update:open', false)
    emit('success')
  } else {
    toast.error(errorMessage.value ?? 'Failed to delete address')
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
        <DialogTitle>Delete Address</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the address for
          <span class="font-semibold text-foreground">{{ address?.receiverName }}</span
          >? This action cannot be undone.
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
          Cancel
        </Button>
        <Button variant="destructive" :disabled="isLoading" @click="handleConfirm">
          {{ isLoading ? 'Deleting...' : 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
