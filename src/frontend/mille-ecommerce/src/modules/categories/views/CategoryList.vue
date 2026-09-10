<template>
  <div class="p-6">
    <!-- Header + Search -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <div class="flex items-center gap-2">
        <Button label="Add Category" @click="showCreateModal = true" />
      </div>
    </div>

    <DataTable
      :value="categories"
      :loading="isLoading"
      paginator
      lazy
      :rows="pageSize"
      :totalRecords="pagination.totalCount"
      :first="(pagination.page - 1) * pageSize"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      currentPageReportTemplate="Hiển thị {first} - {last} trong tổng số {totalRecords} kết quả"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      class="w-full"
      @page="onPageChange"
    >
      <Column field="id" header="ID" sortable />
      <Column field="name" header="Name" sortable />
      <Column field="description" header="Description" />
      <Column field="createdAt" header="Created At" sortable>
        <template #body="{ data }">
          {{ new Date(data.createdAt).toLocaleDateString() }}
        </template>
      </Column>
      <Column header="Actions" style="width: 120px">
        <template #body="{ data }">
          <Button
            class="p-button-rounded"
            size="small"
            variant="text"
            @click="openEditModal(data.id)"
          >
            <PenToSquare />
          </Button>
          <Button
            class="p-button-rounded p-button-text p-button-sm p-button-danger"
            @click="openDeleteModal(data.id)"
          >
            <Trash />
          </Button>
        </template>
      </Column>
    </DataTable>

    <CreateCategoryModal v-model:visible="showCreateModal" @success="refreshList" />
    <EditCategoryModal
      v-model:visible="showEditModal"
      :category-id="selectedCategoryId"
      @success="refreshList"
    />
    <DeleteCategoryModal
      v-model:visible="showDeleteModal"
      :category-id="selectedCategoryId"
      @success="refreshList"
    />
  </div>
</template>

<script setup lang="ts">
// Icon
import Trash from '@primeicons/vue/trash'
import PenToSquare from '@primeicons/vue/pen-to-square'
import Search from '@primeicons/vue/search'

import { ref, onMounted } from 'vue'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useGetCategories } from '../composables/useGetCategories'
import CreateCategoryModal from '../components/CreateCategoryModal.vue'
import EditCategoryModal from '../components/EditCategoryModal.vue'
import DeleteCategoryModal from '../components/DeleteCategoryModal.vue'
import type { PaginationMetaRequest } from '@/shared/types/pagination.ts'

const { categories, pagination, isLoading, fetchCategories } = useGetCategories()

const searchKeyword = ref('')
const pageSize = ref(10)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedCategoryId = ref<number | null>(null)

const fetchData = (page = 1, size = pageSize.value) => {
  const params: PaginationMetaRequest = {
    page,
    pageSize: size,
    includeDeleted: false,
    keyword: searchKeyword.value.trim() || undefined,
  }
  fetchCategories(params)
}

const onPageChange = (event: DataTablePageEvent) => {
  const newPage = event.page + 1
  const newSize = event.rows
  pageSize.value = newSize
  fetchData(newPage, newSize)
}

const refreshList = () => {
  fetchData(pagination.value.page, pageSize.value)
}

const openEditModal = (id: number) => {
  selectedCategoryId.value = id
  showEditModal.value = true
}

const openDeleteModal = (id: number) => {
  selectedCategoryId.value = id
  showDeleteModal.value = true
}

onMounted(() => {
  fetchData()
})
</script>
