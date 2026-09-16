<template>
  <div class="flex flex-col gap-6 lg:flex-row">
    <aside class="shrink-0 lg:w-56">
      <h2 class="mb-3 text-sm font-semibold">Category</h2>
      <div class="flex flex-col gap-1">
        <button
          type="button"
          class="rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
          :class="!categoryId ? 'bg-accent font-medium' : 'text-muted-foreground'"
          @click="selectCategory(undefined)"
        >
          All products
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
          :class="categoryId === category.id ? 'bg-accent font-medium' : 'text-muted-foreground'"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </aside>

    <div class="flex-1">
      <!-- Search -->
      <div class="mb-4 flex items-center gap-2 max-w-sm">
        <Input v-model="keyword" placeholder="Search by name..." @keyup.enter="onSearch" />
        <Button variant="outline" @click="onSearch">Search</Button>
      </div>

      <!-- Error -->
      <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <ProductCardSkeleton v-for="n in 8" :key="n" />
      </div>

      <!-- Empty -->
      <div
        v-else-if="products.length === 0"
        class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-20 text-center"
      >
        <PackageSearch class="h-10 w-10 text-muted-foreground" />
        <p class="font-medium">No matching products found</p>
        <p class="text-sm text-muted-foreground">Try a different keyword or category</p>
      </div>

      <!-- Data -->
      <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" :disabled="page <= 1" @click="goToPage(page - 1)">
          Previous
        </Button>
        <span class="text-sm text-muted-foreground">
          Page {{ pagination.page }} / {{ pagination.totalPages }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="page >= pagination.totalPages"
          @click="goToPage(page + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PackageSearch } from 'lucide-vue-next'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useGetProducts } from '../composables/useGetProducts.ts'
import { useGetCategories } from '@/modules/categories/composables/useGetCategories'
import ProductCard from '../components/ProductCard.vue'
import ProductCardSkeleton from '../components/ProductCardSkeleton.vue'

const { products, pagination, isLoading, errorMessage, fetchProducts } = useGetProducts()
const { categories, fetchCategories } = useGetCategories()

// Pagination state
const page = ref(1)
const pageSize = ref(12)
const keyword = ref<string | undefined>(undefined)
const categoryId = ref<number | undefined>(undefined)

async function loadProducts() {
  await fetchProducts({
    page: page.value,
    pageSize: pageSize.value,
    includeDeleted: false,
    keyword: keyword.value,
    categoryId: categoryId.value,
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

async function selectCategory(id: number | undefined) {
  categoryId.value = id
  page.value = 1
  await loadProducts()
}

onMounted(() => {
  fetchCategories({ page: 1, pageSize: 100, includeDeleted: false })
  loadProducts()
})
</script>
