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
import { useDeleteCategory } from '@/modules/categories/composables/useDeleteCategory'
import type { Category } from '@/modules/categories/types/category'

const props = defineProps<{
  category: Category | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errorMessage, errors, deleteCategory } = useDeleteCategory()

async function handleConfirm() {
  if (!props.category) return
  const success = await deleteCategory(props.category.id)
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
        <DialogTitle>Delete Category</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete
          <span class="font-semibold text-foreground">{{ category?.name }}</span
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
