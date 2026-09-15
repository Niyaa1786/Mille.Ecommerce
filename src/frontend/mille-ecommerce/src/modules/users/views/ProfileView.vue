<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

import { useGetProfile } from '@/modules/users/composables/useGetProfile'
import { useUpdateProfile } from '@/modules/users/composables/useUpdateProfile'
import { useUploadAvatar } from '@/modules/users/composables/useUploadAvatar'
import {
  updateProfileSchema,
  type UpdateProfileRequest,
  type AddressDto,
} from '@/modules/users/types/user'

import AddressFormDialog from '@/modules/users/components/AddressFormDialog.vue'
import DeleteAddressDialog from '@/modules/users/components/DeleteAddressDialog.vue'
import { toast } from 'vue-sonner'

const { profile, isLoading: isLoadingProfile, fetchProfile } = useGetProfile()
const { isLoading: isSaving, errorMessage: saveError, updateProfile } = useUpdateProfile()
const { isLoading: isUploading, errorMessage: uploadError, uploadAvatar } = useUploadAvatar()

const avatarInput = ref<HTMLInputElement | null>(null)

const form = useForm({
  defaultValues: {
    fullName: '',
    phone: '',
  } as UpdateProfileRequest,
  validators: {
    onSubmit: updateProfileSchema,
  },
  onSubmit: async ({ value }) => {
    const result = await updateProfile(value)
    if (result) {
      toast.success('Profile updated successfully')
      await fetchProfile()
    } else {
      toast.error(saveError.value ?? 'Failed to update profile')
    }
  },
})

async function loadProfile() {
  const ok = await fetchProfile()
  if (ok && profile.value) {
    form.setFieldValue('fullName', profile.value.fullName)
    form.setFieldValue('phone', profile.value.phone ?? '')
  }
}

onMounted(loadProfile)

async function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const res = await uploadAvatar(file)
  if (res) {
    toast.success('Avatar updated successfully')
    await fetchProfile()
  } else {
    toast.error(uploadError.value ?? 'Failed to upload avatar')
  }
}

const addressDialogOpen = ref(false)
const editingAddress = ref<AddressDto | null>(null)

function openAddAddress() {
  editingAddress.value = null
  addressDialogOpen.value = true
}

function openEditAddress(address: AddressDto) {
  editingAddress.value = address
  addressDialogOpen.value = true
}

const deleteDialogOpen = ref(false)
const deletingAddress = ref<AddressDto | null>(null)

function openDeleteAddress(address: AddressDto) {
  deletingAddress.value = address
  deleteDialogOpen.value = true
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <h1 class="mb-6 text-2xl font-bold">My Account</h1>

    <Tabs default-value="info">
      <TabsList>
        <TabsTrigger value="info">Profile</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your avatar and contact details.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div v-if="isLoadingProfile" class="text-sm text-muted-foreground">Loading...</div>

            <template v-else-if="profile">
              <div class="flex items-center gap-4">
                <Avatar class="h-16 w-16">
                  <AvatarImage v-if="profile.avatarUrl" :src="profile.avatarUrl" />
                  <AvatarFallback>{{ profile.fullName.charAt(0).toUpperCase() }}</AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    :disabled="isUploading"
                    @click="avatarInput?.click()"
                  >
                    {{ isUploading ? 'Uploading...' : 'Change avatar' }}
                  </Button>
                  <input
                    ref="avatarInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarChange"
                  />
                  <p v-if="uploadError" class="mt-1 text-sm text-destructive">{{ uploadError }}</p>
                </div>
              </div>

              <!-- Form -->
              <form class="flex flex-col gap-4" @submit.prevent.stop="form.handleSubmit">
                <div class="space-y-1">
                  <Label>Email</Label>
                  <Input :model-value="profile.email" disabled />
                </div>

                <form.Field name="fullName">
                  <template #default="{ field, state }">
                    <div class="space-y-1">
                      <Label :for="field.name">Full name</Label>
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

                <form.Field name="phone">
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

                <p v-if="saveError" class="text-sm text-destructive">{{ saveError }}</p>

                <form.Subscribe>
                  <template #default="{ canSubmit }">
                    <Button type="submit" class="w-fit" :disabled="!canSubmit || isSaving">
                      {{ isSaving ? 'Saving...' : 'Save changes' }}
                    </Button>
                  </template>
                </form.Subscribe>
              </form>
            </template>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- TAB: Addresses -->
      <TabsContent value="addresses">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Address Book</CardTitle>
              <CardDescription>Manage your shipping addresses.</CardDescription>
            </div>
            <Button size="sm" @click="openAddAddress">
              <Plus class="h-4 w-4" />
              Add address
            </Button>
          </CardHeader>
          <CardContent>
            <div v-if="!profile?.addresses.length" class="text-sm text-muted-foreground">
              No addresses yet.
            </div>

            <div v-else class="flex flex-col gap-3">
              <div
                v-for="address in profile.addresses"
                :key="address.id"
                class="flex items-start justify-between gap-4 rounded-lg border p-4"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ address.receiverName }}</span>
                    <Badge v-if="address.isDefault" variant="secondary">Default</Badge>
                  </div>
                  <p class="text-sm text-muted-foreground">{{ address.receiverPhone }}</p>
                  <p class="text-sm text-muted-foreground">{{ address.addressLine }}</p>
                </div>
                <div class="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon-sm" @click="openEditAddress(address)">
                    <Pencil class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    class="hover:text-destructive"
                    @click="openDeleteAddress(address)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <AddressFormDialog
      v-model:open="addressDialogOpen"
      :address="editingAddress"
      @success="fetchProfile"
    />
    <DeleteAddressDialog
      v-model:open="deleteDialogOpen"
      :address="deletingAddress"
      @success="fetchProfile"
    />
  </div>
</template>
