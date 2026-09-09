<script setup lang="ts">
import { computed } from 'vue'
import AuthLayout from './shared/layouts/AuthLayout.vue'
import { useRoute } from 'vue-router'
import AdminLayout from './shared/layouts/AdminLayout.vue'

const route = useRoute()

const layouts = {
  auth: AuthLayout,
  admin: AdminLayout,
}

const layout = computed(() => layouts[route.meta.layout])
console.log(layout)
</script>

<template>
  <RouterView v-if="!route.meta.layout"></RouterView>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<style scoped></style>
