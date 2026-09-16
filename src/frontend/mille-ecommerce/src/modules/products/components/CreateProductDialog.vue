<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { Plus, Upload, X, Trash2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateProduct } from '../composables/useCreateProduct'
import {
  createProductSchema,
  PRODUCT_STATUS_LABELS,
  type CreateProductRequest,
  type ProductStatus,
  type VariantRequest,
} from '../types/product'
import { useGetCategories } from '@/modules/categories/composables/useGetCategories'

const emit = defineEmits<{ (e: 'success'): void }>()

const open = ref(false)
const { isLoading, errorMessage, errors, createProduct } = useCreateProduct()
const { categories, fetchCategories } = useGetCategories()

const STATUS_OPTIONS: ProductStatus[] = ['Active', 'OutOfStock', 'Contact', 'Discontinued']

function emptyVariant(): VariantRequest {
  return { sku: '', price: 0, stock: 0, size: '', color: '' }
}

const form = useForm({
  defaultValues: {
    name: '',
    description: '',
    categoryId: 0,
    variants: [emptyVariant()],
    images: [] as File[],
    status: 'Active' as ProductStatus,
  } as CreateProductRequest,
  validators: { onSubmit: createProductSchema },
  onSubmit: async ({ value }) => {
    const success = await createProduct(value)
    if (success) {
      form.reset()
      open.value = false
      emit('success')
    }
  },
})

function handleOpenChange(value: boolean) {
  open.value = value
  if (value) {
    form.reset()
    fetchCategories({ page: 1, pageSize: 100, includeDeleted: false })
  }
}

function addVariant() {
  form.setFieldValue('variants', [...form.state.values.variants, emptyVariant()])
}

function removeVariant(idx: number) {
  const current = form.state.values.variants
  if (current.length <= 1) return
  form.setFieldValue(
    'variants',
    current.filter((_, i) => i !== idx),
  )
}

function handleFiles(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  form.setFieldValue('images', Array.from(input.files))
  input.value = ''
}

function removeImage(idx: number) {
  const current = form.state.values.images as File[]
  form.setFieldValue(
    'images',
    current.filter((_, i) => i !== idx),
  )
}

function getErrorMessage(errs: any[]): string | undefined {
  if (!errs?.length) return undefined
  const e = errs[0]
  return typeof e === 'object' ? e?.message : e
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <Button>
        <Plus class="mr-2 size-4" />
        Create Product
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create Product</DialogTitle>
        <DialogDescription>Add a new product with variants and images.</DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent.stop="form.handleSubmit">
        <!-- Name -->
        <form.Field name="name" v-slot="{ field, state }">
          <div class="grid gap-2">
            <Label :for="field.name">Name</Label>
            <Input
              :id="field.name"
              :model-value="field.state.value"
              placeholder="Product name"
              @update:model-value="(v) => field.handleChange(String(v))"
              @blur="field.handleBlur"
            />
            <p v-if="getErrorMessage(state.meta.errors)" class="text-xs text-destructive">
              {{ getErrorMessage(state.meta.errors) }}
            </p>
          </div>
        </form.Field>

        <!-- Description -->
        <form.Field name="description" v-slot="{ field }">
          <div class="grid gap-2">
            <Label :for="field.name">Description</Label>
            <Input
              :id="field.name"
              :model-value="field.state.value ?? ''"
              placeholder="Optional description"
              @update:model-value="(v) => field.handleChange(String(v))"
              @blur="field.handleBlur"
            />
          </div>
        </form.Field>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Category -->
          <form.Field name="categoryId" v-slot="{ field, state }">
            <div class="grid gap-2">
              <Label>Category</Label>
              <Select
                :model-value="field.state.value ? String(field.state.value) : ''"
                @update:model-value="(v) => field.handleChange(Number(v))"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
                    {{ cat.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p v-if="getErrorMessage(state.meta.errors)" class="text-xs text-destructive">
                {{ getErrorMessage(state.meta.errors) }}
              </p>
            </div>
          </form.Field>

          <!-- Status -->
          <form.Field name="status" v-slot="{ field }">
            <div class="grid gap-2">
              <Label>Status</Label>
              <Select
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(v as ProductStatus)"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="s in STATUS_OPTIONS" :key="s" :value="s">
                    {{ PRODUCT_STATUS_LABELS[s] }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form.Field>
        </div>

        <!-- Variants -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Label>Variants</Label>
            <Button type="button" variant="outline" size="sm" @click="addVariant">
              <Plus class="mr-1 size-4" />
              Add Variant
            </Button>
          </div>

          <form.Field name="variants" v-slot="{ field, state }">
            <div class="space-y-3">
              <Card
                v-for="(_, idx) in field.state.value as VariantRequest[]"
                :key="idx"
                class="relative pt-4"
              >
                <CardContent class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    v-if="(field.state.value as VariantRequest[]).length > 1"
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                    @click="removeVariant(idx)"
                  >
                    <Trash2 class="size-4" />
                  </Button>

                  <!-- SKU -->
                  <form.Field :name="`variants[${idx}].sku`" v-slot="{ field: f, state: s }">
                    <div class="grid gap-1.5">
                      <Label :for="f.name">SKU</Label>
                      <Input
                        :id="f.name"
                        :model-value="f.state.value"
                        placeholder="SKU-001"
                        @update:model-value="(v) => f.handleChange(String(v))"
                      />
                      <p v-if="getErrorMessage(s.meta.errors)" class="text-xs text-destructive">
                        {{ getErrorMessage(s.meta.errors) }}
                      </p>
                    </div>
                  </form.Field>

                  <!-- Price -->
                  <form.Field :name="`variants[${idx}].price`" v-slot="{ field: f, state: s }">
                    <div class="grid gap-1.5">
                      <Label :for="f.name">Price</Label>
                      <Input
                        :id="f.name"
                        type="number"
                        :model-value="f.state.value"
                        placeholder="0"
                        @update:model-value="(v) => f.handleChange(v === '' ? 0 : Number(v))"
                      />
                      <p v-if="getErrorMessage(s.meta.errors)" class="text-xs text-destructive">
                        {{ getErrorMessage(s.meta.errors) }}
                      </p>
                    </div>
                  </form.Field>

                  <!-- Stock -->
                  <form.Field :name="`variants[${idx}].stock`" v-slot="{ field: f, state: s }">
                    <div class="grid gap-1.5">
                      <Label :for="f.name">Stock</Label>
                      <Input
                        :id="f.name"
                        type="number"
                        :model-value="f.state.value"
                        placeholder="0"
                        @update:model-value="(v) => f.handleChange(v === '' ? 0 : Number(v))"
                      />
                      <p v-if="getErrorMessage(s.meta.errors)" class="text-xs text-destructive">
                        {{ getErrorMessage(s.meta.errors) }}
                      </p>
                    </div>
                  </form.Field>

                  <!-- Size -->
                  <form.Field :name="`variants[${idx}].size`" v-slot="{ field: f }">
                    <div class="grid gap-1.5">
                      <Label :for="f.name">Size (optional)</Label>
                      <Input
                        :id="f.name"
                        :model-value="f.state.value ?? ''"
                        placeholder="M / L / XL"
                        @update:model-value="(v) => f.handleChange(String(v))"
                      />
                    </div>
                  </form.Field>

                  <!-- Color -->
                  <form.Field :name="`variants[${idx}].color`" v-slot="{ field: f }">
                    <div class="grid gap-1.5 sm:col-span-2">
                      <Label :for="f.name">Color (optional)</Label>
                      <Input
                        :id="f.name"
                        :model-value="f.state.value ?? ''"
                        placeholder="Red / Black"
                        @update:model-value="(v) => f.handleChange(String(v))"
                      />
                    </div>
                  </form.Field>
                </CardContent>
              </Card>

              <p v-if="getErrorMessage(state.meta.errors)" class="text-xs text-destructive">
                {{ getErrorMessage(state.meta.errors) }}
              </p>
            </div>
          </form.Field>
        </div>

        <!-- Images Upload -->
        <form.Field name="images" v-slot="{ field, state }">
          <div class="grid gap-2">
            <Label>Images</Label>
            <div class="flex items-center gap-3">
              <Button type="button" variant="outline" as-child>
                <label class="cursor-pointer">
                  <Upload class="mr-2 size-4" /> Choose images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="handleFiles"
                  />
                </label>
              </Button>
              <span class="text-xs text-muted-foreground">
                {{ (field.state.value as File[]).length }} file(s) selected
              </span>
            </div>

            <div v-if="(field.state.value as File[]).length" class="flex flex-wrap gap-2 pt-1">
              <div
                v-for="(file, idx) in field.state.value as File[]"
                :key="idx"
                class="flex items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs"
              >
                <span class="max-w-36 truncate">{{ file.name }}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="size-4 text-muted-foreground hover:text-destructive"
                  @click="removeImage(idx)"
                >
                  <X class="size-3" />
                </Button>
              </div>
            </div>

            <p v-if="getErrorMessage(state.meta.errors)" class="text-xs text-destructive">
              {{ getErrorMessage(state.meta.errors) }}
            </p>
          </div>
        </form.Field>

        <!-- Errors -->
        <div
          v-if="errorMessage || errors.length"
          class="rounded-md bg-destructive/15 p-3 text-xs text-destructive"
        >
          <p v-if="errorMessage" class="font-medium">{{ errorMessage }}</p>
          <ul v-if="errors.length" class="list-disc pl-4 space-y-1 mt-1">
            <li v-for="(err, idx) in errors" :key="idx">{{ err }}</li>
          </ul>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" :disabled="isLoading" @click="open = false">
            Cancel
          </Button>
          <form.Subscribe v-slot="{ canSubmit }">
            <Button type="submit" :disabled="!canSubmit || isLoading">
              {{ isLoading ? 'Creating...' : 'Create' }}
            </Button>
          </form.Subscribe>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
