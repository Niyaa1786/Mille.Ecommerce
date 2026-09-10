<template>
  <Dialog
    :visible="visible"
    @update:visible="updateVisible"
    header="Create Category"
    :modal="true"
    :style="{ width: '450px' }"
    :closable="true"
  >
    <Form
      v-slot="$formState"
      :initial-values="form"
      :resolver="zodResolver(createCategorySchema)"
      :validate-on-submit="true"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-1">
        <label for="name" class="font-medium">Name</label>
        <InputText id="name" v-model="form.name" name="name" type="text" fluid />
        <Message v-if="$formState.name?.invalid" severity="error" size="small" variant="simple">{{
          $formState.name.error?.message
        }}</Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="description" class="font-medium">Description</label>
        <InputText
          id="description"
          v-model="form.description"
          name="description"
          type="text"
          fluid
        />
        <Message
          v-if="$formState.description?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $formState.description.error?.message }}</Message
        >
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancel" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Create" :loading="isLoading" />
      </div>

      <div v-if="errors.length">
        <Message v-for="err in errors" :key="err" severity="error" variant="simple">
          {{ err }}
        </Message>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import type { FormSubmitEvent } from '@primevue/forms'
import { createCategorySchema } from '../types/category'
import { useCreateCategory } from '../composables/useCreateCategory'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errors, createCategory } = useCreateCategory()

const form = reactive({
  name: '',
  description: '',
})

const updateVisible = (val: boolean) => {
  emit('update:visible', val)
}

const closeDialog = () => {
  updateVisible(false)
}

const resetForm = () => {
  form.name = ''
  form.description = ''
}

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) return
  const success = await createCategory(form)
  if (success) {
    emit('success')
    closeDialog()
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) resetForm()
  },
)
</script>
