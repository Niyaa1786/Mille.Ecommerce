<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGetProducts } from '../composables/useGetProducts'
import { PRODUCT_STATUS_LABELS, type ProductStatus, type ProductList } from '../types/product'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Info, Pencil, Trash2, X } from 'lucide-vue-next'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import Badge from '@/components/ui/badge/Badge.vue'
import DetailProductDialog from '../components/DetailProductDialog.vue'
import DeleteProductDialog from '../components/DeleteProductDialog.vue'
import CreateProductDialog from '../components/CreateProductDialog.vue'
import EditProductDialog from '../components/EditProductDialog.vue'
import { useGetCategories } from '@/modules/categories/composables/useGetCategories'

const { products, pagination, isLoading, errorMessage, fetchProducts } = useGetProducts()
const { categories, fetchCategories } = useGetCategories()

// Filters & pagination
const page = ref(1)
const pageSize = ref(10)
const keyword = ref<string | undefined>(undefined)
const categoryId = ref<number | undefined>(undefined)
const status = ref<ProductStatus | undefined>(undefined)

const STATUS_OPTIONS: ProductStatus[] = ['Active', 'OutOfStock', 'Contact', 'Discontinued']

async function loadProducts() {
  await fetchProducts({
    page: page.value,
    pageSize: pageSize.value,
    includeDeleted: false,
    keyword: keyword.value,
    categoryId: categoryId.value,
    status: status.value,
  })
}

async function goToPage(next: number) {
  if (next < 1 || next > pagination.value.totalPages) return
  page.value = next
  await loadProducts()
}

async function onSearch() {
  page.value = 1
  await loadProducts()
}

async function onStatusChange(value: ProductStatus | 'All') {
  status.value = value === 'All' ? undefined : value
  page.value = 1
  await loadProducts()
}

async function onCategoryChange(value: unknown) {
  if (typeof value !== 'string') return
  categoryId.value = value === 'All' ? undefined : Number(value)
  page.value = 1
  await loadProducts()
}

async function onResetFilters() {
  keyword.value = undefined
  categoryId.value = undefined
  status.value = undefined
  page.value = 1
  await loadProducts()
}

// Dialogs
const detailOpen = ref(false)
const productDetailId = ref<string | null>(null)
function openDetail(product: ProductList) {
  productDetailId.value = product.id
  detailOpen.value = true
}

const editOpen = ref(false)
const editingProductId = ref<string | null>(null)
function openEdit(product: ProductList) {
  editingProductId.value = product.id
  editOpen.value = true
}

const deleteOpen = ref(false)
const deletingProduct = ref<ProductList | null>(null)
function openDelete(product: ProductList) {
  deletingProduct.value = product
  deleteOpen.value = true
}

onMounted(() => {
  fetchCategories({ page: 1, pageSize: 100, includeDeleted: false })
  loadProducts()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Products</h1>
        <p class="text-sm text-muted-foreground">Manage your products.</p>
      </div>
      <CreateProductDialog @success="loadProducts" />
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2 max-w-sm flex-1 min-w-60">
        <Input v-model="keyword" placeholder="Search by name..." @keyup.enter="onSearch" />
        <Button variant="outline" @click="onSearch">Search</Button>
      </div>

      <Select
        :model-value="categoryId !== undefined ? String(categoryId) : 'All'"
        @update:model-value="onCategoryChange"
      >
        <SelectTrigger class="w-44">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All categories</SelectItem>
          <SelectItem v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
            {{ cat.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        :model-value="status ?? 'All'"
        @update:model-value="(v) => onStatusChange(v as ProductStatus | 'All')"
      >
        <SelectTrigger class="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All statuses</SelectItem>
          <SelectItem v-for="s in STATUS_OPTIONS" :key="s" :value="s">
            {{ PRODUCT_STATUS_LABELS[s] }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        v-if="keyword || categoryId !== undefined || status !== undefined"
        variant="ghost"
        size="sm"
        @click="onResetFilters"
      >
        <X class="mr-1 size-4" />
        Clear filters
      </Button>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead class="w-35 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <!-- Loading -->
          <template v-if="isLoading">
            <TableRow v-for="i in 5" :key="`sk-${i}`">
              <TableCell v-for="j in 8" :key="`sk-${i}-${j}`">
                <Skeleton class="h-4 w-full" />
              </TableCell>
            </TableRow>
          </template>

          <!-- Data -->
          <template v-else-if="products.length">
            <TableRow
              v-for="product in products"
              :key="product.id"
              class="hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                <div
                  class="relative size-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0 shadow-xs"
                >
                  <img
                    v-if="product.thumbnailUrl"
                    :src="product.thumbnailUrl"
                    :alt="product.name"
                    class="size-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <ImageIcon v-else class="size-5 text-muted-foreground/50" />
                </div>
              </TableCell>

              <TableCell class="font-medium text-foreground">{{ product.name }}</TableCell>
              <TableCell class="text-muted-foreground">{{ product.categoryName || '-' }}</TableCell>

              <TableCell>
                <Badge variant="secondary">
                  {{ PRODUCT_STATUS_LABELS[product.status] }}
                </Badge>
              </TableCell>

              <TableCell
                class="max-w-50 text-muted-foreground truncate"
                :title="product.description"
              >
                {{ product.description || '-' }}
              </TableCell>

              <TableCell class="font-semibold text-foreground">
                {{ formatCurrency(product.minPrice) }}
              </TableCell>

              <TableCell class="text-xs text-muted-foreground">
                {{ formatDate(product.createdAt) }}
              </TableCell>

              <TableCell class="text-right">
                <div class="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="View details"
                    @click="openDetail(product)"
                  >
                    <Info class="size-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Edit product"
                    @click="openEdit(product)"
                  >
                    <Pencil class="size-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Delete product"
                    @click="openDelete(product)"
                  >
                    <Trash2 class="size-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- Empty -->
          <template v-else>
            <TableRow>
              <TableCell colspan="8" class="h-24 text-center text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-muted-foreground">
        Page {{ pagination.page }} of {{ pagination.totalPages }} —
        {{ pagination.totalCount }} items
      </span>

      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1 || isLoading"
          @click="goToPage(pagination.page - 1)"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page >= pagination.totalPages || isLoading"
          @click="goToPage(pagination.page + 1)"
        >
          Next
        </Button>
      </div>
    </div>

    <!-- Dialogs -->
    <DetailProductDialog v-model:open="detailOpen" :product-id="productDetailId" />
    <EditProductDialog
      v-model:open="editOpen"
      :product-id="editingProductId"
      @success="loadProducts"
    />
    <DeleteProductDialog
      v-model:open="deleteOpen"
      :product="deletingProduct"
      @success="loadProducts"
    />
  </div>
</template>
