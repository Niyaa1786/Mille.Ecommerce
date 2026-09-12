<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@tanstack/vue-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCategory } from '@/modules/categories/composables/useCreateCategory'
import {
  createCategorySchema,
  type CreateCategoryRequest,
} from '@/modules/categories/types/category'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const open = ref(false)
const { isLoading, errorMessage, errors, createCategory } = useCreateCategory()

const form = useForm({
  defaultValues: {
    name: '',
    description: '',
  } as CreateCategoryRequest,
  validators: {
    onSubmit: createCategorySchema,
  },
  onSubmit: async ({ value }) => {
    const success = await createCategory(value)
    if (success) {
      form.reset()
      open.value = false
      emit('success')
    }
  },
})

function handleOpenChange(value: boolean) {
  open.value = value
  if (value) form.reset()
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <Button>Create Category</Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create Category</DialogTitle>
        <DialogDescription>Add a new category to your catalog.</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="form.handleSubmit">
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
          <Button type="button" variant="outline" :disabled="isLoading" @click="open = false">
            Cancel
          </Button>
          <form.Subscribe>
            <template #default="{ canSubmit }">
              <Button type="submit" :disabled="!canSubmit || isLoading">
                {{ isLoading ? 'Creating...' : 'Create' }}
              </Button>
            </template>
          </form.Subscribe>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
