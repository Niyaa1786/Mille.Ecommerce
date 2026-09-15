<script setup lang="ts">
import { watchEffect } from 'vue'
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
import { useAddAddress } from '@/modules/users/composables/useAddAddress'
import { useUpdateAddress } from '@/modules/users/composables/useUpdateAddress'
import {
  addAddressSchema,
  type AddAddressRequest,
  type AddressDto,
} from '@/modules/users/types/user'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
  address: AddressDto | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const isEdit = () => props.address !== null

const { isLoading: isAdding, errorMessage: addError, addAddress } = useAddAddress()
const { isLoading: isUpdating, errorMessage: updateError, updateAddress } = useUpdateAddress()

const form = useForm({
  defaultValues: {
    receiverName: '',
    receiverPhone: '',
    addressLine: '',
    isDefault: false,
  } as AddAddressRequest,
  validators: {
    onSubmit: addAddressSchema,
  },
  onSubmit: async ({ value }) => {
    const success = isEdit()
      ? await updateAddress(props.address!.id, value)
      : (await addAddress(value)) !== null

    if (success) {
      toast.success(isEdit() ? 'Address updated successfully' : 'Address added successfully')
      emit('update:open', false)
      emit('success')
    } else {
      toast.error((isEdit() ? updateError.value : addError.value) ?? 'Failed to save address')
    }

    if (success) {
      emit('update:open', false)
      emit('success')
    }
  },
})

watchEffect(() => {
  if (props.open) {
    form.setFieldValue('receiverName', props.address?.receiverName ?? '')
    form.setFieldValue('receiverPhone', props.address?.receiverPhone ?? '')
    form.setFieldValue('addressLine', props.address?.addressLine ?? '')
    form.setFieldValue('isDefault', props.address?.isDefault ?? false)
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
        <DialogTitle>{{ isEdit() ? 'Edit address' : 'Add Address' }}</DialogTitle>
        <DialogDescription>Recipient info & shipping address.</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent.stop="form.handleSubmit">
        <form.Field name="receiverName">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Receiver Name</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                placeholder="John Doe"
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

        <form.Field name="receiverPhone">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Phone number</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                type="tel"
                placeholder="0987654321"
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

        <form.Field name="addressLine">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Address</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                placeholder="Street name, ward, district, city/province"
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

        <form.Field name="isDefault">
          <template #default="{ field }">
            <label class="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                :checked="field.state.value"
                @change="(e) => field.handleChange((e.target as HTMLInputElement).checked)"
              />
              Set default
            </label>
          </template>
        </form.Field>

        <p v-if="addError || updateError" class="text-sm text-destructive">
          {{ addError || updateError }}
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            :disabled="isAdding || isUpdating"
            @click="handleOpenChange(false)"
          >
            Huỷ
          </Button>
          <form.Subscribe>
            <template #default="{ canSubmit }">
              <Button type="submit" :disabled="!canSubmit || isAdding || isUpdating">
                {{ isAdding || isUpdating ? 'Saving...' : 'Save' }}
              </Button>
            </template>
          </form.Subscribe>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
