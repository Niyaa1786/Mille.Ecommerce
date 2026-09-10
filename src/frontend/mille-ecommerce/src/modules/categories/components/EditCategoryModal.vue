<template>
  <Dialog
    :visible="visible"
    @update:visible="updateVisible"
    header="Edit Category"
    :modal="true"
    :style="{ width: '450px' }"
    :closable="true"
  >
    <div v-if="isLoadingCategory" class="flex justify-center p-4">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem" />
    </div>
    <Form
      v-else
      v-slot="$formState"
      :initial-values="form"
      :resolver="zodResolver(updateCategorySchema)"
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
        <Button type="submit" label="Save" :loading="isLoading" />
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
import { reactive, watch, ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import type { FormSubmitEvent } from '@primevue/forms'
import { updateCategorySchema } from '../types/category'
import { useUpdateCategory } from '../composables/useUpdateCategory'
import { useGetCategory } from '../composables/useGetCategory'

const props = defineProps<{
  visible: boolean
  categoryId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const { isLoading, errors, updateCategory } = useUpdateCategory()
const { category, isLoading: isLoadingCategory, fetchCategory } = useGetCategory()

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

const loadCategoryData = async () => {
  if (!props.categoryId) return
  await fetchCategory(props.categoryId)
  if (category.value) {
    form.name = category.value.name
    form.description = category.value.description || ''
  }
}

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid || !props.categoryId) return
  const success = await updateCategory(props.categoryId, {
    name: form.name,
    description: form.description,
  })
  if (success) {
    emit('success')
    closeDialog()
  }
}

watch(
  () => props.visible,
  async (newVal) => {
    if (newVal && props.categoryId) {
      resetForm()
      await loadCategoryData()
    }
  },
  { immediate: true },
)
</script>
