<template>
  <div class="flex flex-col overflow-hidden rounded-lg border bg-card">
    <Skeleton class="aspect-square w-full rounded-none" />
    <div class="flex flex-col gap-2 p-3">
      <Skeleton class="h-3 w-16" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>
