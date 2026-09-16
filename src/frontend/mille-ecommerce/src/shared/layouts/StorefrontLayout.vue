<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div class="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Sheet v-model:open="isMobileMenuOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="md:hidden">
              <Menu class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-72">
            <SheetHeader>
              <SheetTitle>Mille Store</SheetTitle>
            </SheetHeader>
            <nav class="mt-4 flex flex-col gap-1 px-4">
              <RouterLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                @click="isMobileMenuOpen = false"
              >
                {{ item.label }}
              </RouterLink>
            </nav>
          </SheetContent>
        </Sheet>

        <RouterLink to="/" class="text-lg font-bold shrink-0"> Mille Store </RouterLink>

        <NavigationMenu class="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem v-for="item in navItems" :key="item.to">
              <NavigationMenuLink as-child>
                <RouterLink :to="item.to">{{ item.label }}</RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div class="hidden flex-1 max-w-sm items-center gap-2 sm:flex">
          <div class="relative w-full">
            <Search
              class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input v-model="searchKeyword" placeholder="Searching product..." class="pl-8" />
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <RouterLink to="/cart">
            <Button variant="ghost" size="icon" class="relative">
              <ShoppingCart class="h-5 w-5" />
              <Badge
                v-if="cartCount > 0"
                class="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1"
              >
                {{ cartCount }}
              </Badge>
            </Button>
          </RouterLink>

          <DropdownMenu v-if="authStore.isAuthenticated">
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <User class="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <div class="px-2 py-1.5 text-sm font-medium truncate">
                {{ authStore.userInfo?.fullName }}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <RouterLink to="/profile">Profile</RouterLink>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <RouterLink to="/orders">My Orders</RouterLink>
              </DropdownMenuItem>
              <template v-if="authStore.isAdmin">
                <DropdownMenuSeparator />
                <DropdownMenuItem as-child>
                  <RouterLink to="/admin/orders">Admin Page</RouterLink>
                </DropdownMenuItem>
              </template>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-destructive" @click="handleLogout">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <RouterLink v-else to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <div class="container mx-auto px-4 py-6">
        <slot />
      </div>
    </main>

    <footer class="border-t py-6">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} Mille Store
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, ShoppingCart, User, Search } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAuthStore } from '@/modules/auth/stores/authStore'
import { useCartStore } from '@/modules/carts/stores/cartStore'
import { useLogout } from '@/modules/auth/composables/useLogout'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { handleLogout } = useLogout()

const isMobileMenuOpen = ref(false)
const searchKeyword = ref('')

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Categories', to: '/products' },
]

const cartCount = computed(() => cartStore.totalItems)
</script>
