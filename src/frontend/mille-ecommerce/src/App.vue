<script setup lang="ts">
import { computed } from 'vue'
import AuthLayout from './shared/layouts/AuthLayout.vue'
import { useRoute } from 'vue-router'
import AdminLayout from './shared/layouts/AdminLayout.vue'
import StorefrontLayout from './shared/layouts/StorefrontLayout.vue'
import { Toaster } from './components/ui/sonner'

const route = useRoute()

const layouts = {
  auth: AuthLayout,
  admin: AdminLayout,
  storefront: StorefrontLayout,
}

const layout = computed(() => layouts[route.meta.layout])
</script>

<template>
  <RouterView v-if="!route.meta.layout"></RouterView>
  <component v-else :is="layout">
    <RouterView />
  </component>
  <Toaster position="bottom-right" rich-colors />
</template>

<style scoped></style>
