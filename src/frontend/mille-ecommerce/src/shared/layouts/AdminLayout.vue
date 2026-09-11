<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader class="border-b border-sidebar-border">
        <div class="flex h-12 items-center justify-center px-2">
          <span class="truncate font-bold text-sidebar-foreground">Mille Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavLinks :items="navItems" />
      </SidebarContent>

      <SidebarFooter class="border-t border-sidebar-border">
        <Button
          variant="outline"
          class="w-full hover:text-destructive hover:border-destructive"
          @click="handleLogout"
        >
          <LogOut class="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { useLogout } from '@/modules/auth/composables/useLogout'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import NavLinks, { type NavItems } from '../components/NavLinks.vue'

const { handleLogout } = useLogout()

const navItems: NavItems[] = [
  { label: 'Home', to: '/' },
  { label: 'Category', to: '/category' },
  { label: 'Product', to: '/products' },
  { label: 'Orders', to: '/orders' },
]
</script>
