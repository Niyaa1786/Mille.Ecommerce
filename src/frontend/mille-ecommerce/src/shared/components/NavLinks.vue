<script setup lang="ts">
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import SidebarGroupLabel from '@/components/ui/sidebar/SidebarGroupLabel.vue'
import { RouterLink } from 'vue-router'

export interface NavItem {
  label: string
  to: string
  icon?: string
}

defineProps<{
  title?: string
  items: NavItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ title }}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items">
          <SidebarMenuButton as-child>
            <RouterLink :to="item.to"></RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
