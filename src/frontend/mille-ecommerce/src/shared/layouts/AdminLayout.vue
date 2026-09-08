<template>
  <SidebarLayout>
    <Sidebar id="nav" collapsible="none">
      <SidebarSpacer />
      <SidebarAside>
        <SidebarPanel>
          <SidebarHeader class="border-b-2 border-surface-200">
            <span class="truncate font-bold text-slate-900 text-center"> Mille Admin </span>
          </SidebarHeader>

          <SidebarContent>
            <NavLinks :items="navItems"></NavLinks>
          </SidebarContent>

          <SidebarFooter class="border-t-2 border-surface-200">
            <Button @click="handleLogout" severity="danger" variant="outlined" fluid>Logout</Button>
          </SidebarFooter>
        </SidebarPanel>
      </SidebarAside>
    </Sidebar>

    <SidebarMain>
      <slot></slot>
    </SidebarMain>
  </SidebarLayout>
</template>

<script setup lang="ts">
import { useLogout } from '@/modules/auth/composables/useLogout'
import NavLinks, { type NavItem } from '../components/NavLinks.vue'

const { handleLogout } = useLogout()
const navItems: NavItem[] = [
  { label: 'Category', to: '/category' },
  { label: 'Product', to: '/inbox' },
  { label: 'Order', to: '/notifications' },
]
</script>

<style scoped></style>
