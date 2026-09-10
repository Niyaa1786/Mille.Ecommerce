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
        <Button variant="destructive" class="w-full" @click="handleLogout">
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
import { ref } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { useLogout } from '@/modules/auth/composables/useLogout'
import NavLinks, { type NavItem } from '@/shared/components/NavLinks.vue'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

const { handleLogout } = useLogout()

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  // { label: 'Category', to: '/category' },
  // { label: 'Product', to: '/products' },
  // { label: 'Order', to: '/orders' },
]
</script>
