<template>
  <Dialog
    :visible="visible"
    @update:visible="updateVisible"
    header="Delete Category"
    :modal="true"
    :style="{ width: '400px' }"
    :closable="true"
  >
    <div class="flex flex-col gap-4">
      <p>Are you sure you want to delete this category? This action cannot be undone.</p>
      <div class="flex justify-end gap-2 mt-2">
        <Button type="button" label="Cancel" severity="secondary" @click="closeDialog" />
        <Button
          type="button"
          label="Delete"
          severity="danger"
          :loading="isLoading"
          @click="handleDelete"
        />
      </div>
      <div v-if="errors.length">
        <Message v-for="err in errors" :key="err" severity="error" variant="simple">
          {{ err }}
        </Message>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useDeleteCategory } from '../composables/useDeleteCategory'

const props = defineProps<{
  visible: boolean
  categoryId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errors, deleteCategory } = useDeleteCategory()

const updateVisible = (val: boolean) => {
  emit('update:visible', val)
}

const closeDialog = () => {
  updateVisible(false)
}

const handleDelete = async () => {
  if (!props.categoryId) return
  const success = await deleteCategory(props.categoryId)
  if (success) {
    emit('success')
    closeDialog()
  }
}
</script>
