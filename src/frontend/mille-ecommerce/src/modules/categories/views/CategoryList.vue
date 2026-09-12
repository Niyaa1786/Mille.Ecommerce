<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import CreateCategoryDialog from '@/modules/categories/components/CreateCategoryDialog.vue'
import EditCategoryDialog from '@/modules/categories/components/EditCategoryDialog.vue'
import DeleteCategoryDialog from '@/modules/categories/components/DeleteCategoryDialog.vue'

import { useGetCategories } from '@/modules/categories/composables/useGetCategories'
import type { Category } from '@/modules/categories/types/category'

const { categories, pagination, isLoading, errorMessage, fetchCategories } = useGetCategories()

const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')

function refreshTable() {
  fetchCategories({
    page: page.value,
    pageSize: pageSize.value,
    includeDeleted: false,
    keyword: keyword.value || undefined,
  })
}

function goToPage(next: number) {
  if (next < 1 || next > pagination.value.totalPages) return
  page.value = next
  refreshTable()
}

function onSearch() {
  refreshTable()
}

function formatDate(value: string) {
  if (!value) return ''
  return new Date(value).toLocaleString('vi-VN')
}

const editOpen = ref(false)
const editingCategory = ref<Category | null>(null)

function openEdit(category: Category) {
  editingCategory.value = category
  editOpen.value = true
}

const deleteOpen = ref(false)
const deletingCategory = ref<Category | null>(null)

function openDelete(category: Category) {
  deletingCategory.value = category
  deleteOpen.value = true
}
onMounted(refreshTable)
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Categories</h1>
        <p class="text-sm text-muted-foreground">Manage your product categories.</p>
      </div>

      <CreateCategoryDialog @success="refreshTable">
        <template #trigger>
          <Button>
            <Plus class="mr-2 size-4" />
            Create Category
          </Button>
        </template>
      </CreateCategoryDialog>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-2 max-w-sm">
      <Input v-model="keyword" placeholder="Search by name..." @keyup.enter="onSearch" />
      <Button variant="outline" @click="onSearch">Search</Button>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead class="max-w-90">Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead class="w-35 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <!-- Loading -->
          <template v-if="isLoading">
            <TableRow v-for="i in 5" :key="`sk-${i}`">
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
            </TableRow>
          </template>

          <!-- Data -->
          <template v-else-if="categories.length">
            <TableRow v-for="category in categories" :key="category.id">
              <TableCell class="font-medium">{{ category.name }}</TableCell>
              <TableCell class="max-w-90 truncate text-muted-foreground">
                {{ category.description || '—' }}
              </TableCell>
              <TableCell>{{ formatDate(category.createdAt) }}</TableCell>
              <TableCell>{{ formatDate(category.updatedAt) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button variant="outline" size="icon-sm" @click="openEdit(category)">
                    <Pencil class="size-3.5" />
                  </Button>
                  <Button variant="destructive" size="icon-sm" @click="openDelete(category)">
                    <Trash2 class="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- Empty -->
          <template v-else>
            <TableRow>
              <TableCell colspan="5" class="h-24 text-center text-muted-foreground">
                No categories found.
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

    <!-- Edit / Delete Dialogs -->
    <EditCategoryDialog
      v-model:open="editOpen"
      :category="editingCategory"
      @success="refreshTable"
    />
    <DeleteCategoryDialog
      v-model:open="deleteOpen"
      :category="deletingCategory"
      @success="refreshTable"
    />
  </div>
</template>
