<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useForm } from '@tanstack/vue-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateCategory } from '@/modules/categories/composables/useUpdateCategory'
import {
  updateCategorySchema,
  type Category,
  type UpdateCategoryRequest,
} from '@/modules/categories/types/category'

const props = defineProps<{
  category: Category | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errorMessage, errors, updateCategory } = useUpdateCategory()

const form = useForm({
  defaultValues: {
    name: '',
    description: '',
  } as UpdateCategoryRequest,
  validators: {
    onSubmit: updateCategorySchema,
  },
  onSubmit: async ({ value }) => {
    if (!props.category) return
    const success = await updateCategory(props.category.id, value)
    if (success) {
      emit('update:open', false)
      emit('success')
    }
  },
})

watchEffect(() => {
  if (props.open && props.category) {
    form.setFieldValue('name', props.category.name)
    form.setFieldValue('description', props.category.description ?? '')
  }
})

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogDescription>Update the details of this category.</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent.stop="form.handleSubmit">
        <form.Field name="name">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Name</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                placeholder="Category name"
              />
              <p v-if="state.meta.errors.length" class="text-sm text-destructive">
                {{
                  typeof state.meta.errors[0] === 'object'
                    ? state.meta.errors[0]?.message
                    : state.meta.errors[0]
                }}
              </p>
            </div>
          </template>
        </form.Field>

        <form.Field name="description">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Description</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                placeholder="Optional description"
              />
              <p v-if="state.meta.errors.length" class="text-sm text-destructive">
                {{
                  typeof state.meta.errors[0] === 'object'
                    ? state.meta.errors[0]?.message
                    : state.meta.errors[0]
                }}
              </p>
            </div>
          </template>
        </form.Field>

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
          <form.Subscribe>
            <template #default="{ canSubmit }">
              <Button type="submit" :disabled="!canSubmit || isLoading">
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </Button>
            </template>
          </form.Subscribe>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
