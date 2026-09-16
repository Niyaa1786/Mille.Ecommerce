<template>
  <div class="-mx-4 -mt-6 bg-background text-foreground">
    <section class="border-b border-border">
      <div class="container mx-auto grid grid-cols-1 items-stretch lg:grid-cols-12">
        <div class="flex flex-col justify-center gap-6 px-4 py-16 lg:col-span-6 lg:py-24 lg:pr-12">
          <p class="font-serif text-base italic text-muted-foreground">Mille Store</p>
          <h1
            class="max-w-[14ch] font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Clothes you'll actually reach for.
          </h1>
          <p class="max-w-md text-base leading-relaxed text-muted-foreground">
            A small, considered edit of basics and easy layers — pieces built to repeat, not to sit
            at the back of the closet.
          </p>
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <RouterLink to="/products">
              <Button size="lg" class="rounded-none px-7">Shop new arrivals</Button>
            </RouterLink>
            <a href="#collections" class="text-sm font-medium underline underline-offset-4">
              Browse by category
            </a>
          </div>
        </div>

        <div class="relative min-h-80 overflow-hidden bg-primary lg:col-span-6">
          <img
            v-if="heroImage"
            :src="heroImage"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <span class="font-serif text-3xl italic text-primary-foreground">Mille</span>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-border bg-card">
      <div
        class="container mx-auto flex flex-col divide-y divide-border text-sm text-muted-foreground sm:flex-row sm:divide-x sm:divide-y-0"
      >
        <div class="flex-1 px-4 py-4 text-center sm:text-left">Free shipping over 500,000₫</div>
        <div class="flex-1 px-4 py-4 text-center sm:text-left">Easy 7-day returns</div>
        <div class="flex-1 px-4 py-4 text-center sm:text-left">Pieces made to layer together</div>
      </div>
    </section>

    <section id="collections" class="container mx-auto px-4 py-16">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="font-serif text-2xl font-medium sm:text-3xl">Shop by category</h2>
        <RouterLink
          to="/products"
          class="shrink-0 text-sm font-medium underline underline-offset-4"
        >
          View all products
        </RouterLink>
      </div>

      <div v-if="isLoadingCategories" class="flex gap-4 overflow-hidden">
        <Skeleton v-for="n in 4" :key="n" class="h-72 w-52 shrink-0 rounded-none" />
      </div>

      <div v-else class="flex gap-4 overflow-x-auto pb-2">
        <RouterLink
          v-for="cat in categoryTiles"
          :key="cat.id"
          :to="`/products?categoryId=${cat.id}`"
          class="relative block h-72 w-52 shrink-0 overflow-hidden border border-border bg-primary"
        >
          <img
            v-if="cat.image"
            :src="cat.image"
            :alt="cat.name"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full w-full items-center justify-center">
            <span class="text-sm text-primary-foreground">{{ cat.name }}</span>
          </div>
          <span
            class="absolute bottom-3 left-3 font-serif text-base italic text-primary-foreground [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]"
          >
            {{ cat.name }}
          </span>
        </RouterLink>
      </div>
    </section>

    <section class="border-y border-border bg-primary text-primary-foreground">
      <div
        class="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 lg:grid-cols-12 lg:items-center"
      >
        <div class="lg:col-span-7">
          <p class="font-serif text-2xl italic leading-snug sm:text-3xl lg:text-4xl">
            "We're not chasing trends. Mille is the handful of pieces you rebuild every outfit
            around."
          </p>
          <p class="mt-6 text-sm text-primary-foreground/60">— Mille Store, on staying simple</p>
        </div>
        <div class="lg:col-span-5">
          <div class="aspect-4/5 w-full overflow-hidden bg-muted">
            <img
              v-if="editorialImage"
              :src="editorialImage"
              alt="Mille Store editorial"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-4 py-16">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="font-serif text-2xl font-medium sm:text-3xl">New arrivals</h2>
        <RouterLink
          to="/products"
          class="shrink-0 text-sm font-medium underline underline-offset-4"
        >
          View all products
        </RouterLink>
      </div>

      <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

      <div v-if="isLoadingProducts" class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <ProductCardSkeleton v-for="n in 8" :key="n" />
      </div>

      <div v-else-if="newArrivals.length === 0" class="py-16 text-center text-muted-foreground">
        No products yet — check back soon.
      </div>

      <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in newArrivals" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetProducts } from '@/modules/products/composables/useGetProducts'
import ProductCard from '@/modules/products/components/ProductCard.vue'
import ProductCardSkeleton from '@/modules/products/components/ProductCardSkeleton.vue'
import { useGetCategories } from '@/modules/categories/composables/useGetCategories'

const { products, isLoading: isLoadingProducts, errorMessage, fetchProducts } = useGetProducts()
const { categories, isLoading: isLoadingCategories, fetchCategories } = useGetCategories()

const newArrivals = computed(() => products.value.slice(0, 8))

const heroImage = computed(() => products.value.find((p) => p.thumbnailUrl)?.thumbnailUrl ?? null)

const editorialImage = computed(() => {
  const withImage = products.value.filter((p) => p.thumbnailUrl)
  return withImage[Math.min(4)]?.thumbnailUrl ?? withImage[0]?.thumbnailUrl ?? null
})

const categoryTiles = computed(() =>
  categories.value.slice(0, 6).map((cat) => ({
    id: cat.id,
    name: cat.name,
    image: products.value.find((p) => p.categoryName === cat.name)?.thumbnailUrl ?? null,
  })),
)

onMounted(() => {
  fetchProducts({ page: 1, pageSize: 20, includeDeleted: false })
  fetchCategories({ page: 1, pageSize: 6, includeDeleted: false })
})
</script>
