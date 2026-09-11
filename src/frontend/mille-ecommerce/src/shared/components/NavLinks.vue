<script setup lang="ts">
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { RouterLink } from 'vue-router'

export interface NavItems {
  label: string
  to: string
}

defineProps<{
  title?: string
  items: NavItems[]
}>()
</script>

<template>
  <SidebarGroupContent>
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.to">
          <SidebarMenuButton class="font-semibold text-md" as-child>
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  </SidebarGroupContent>
</template>
