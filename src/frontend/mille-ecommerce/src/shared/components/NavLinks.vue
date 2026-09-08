<script setup lang="ts">
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
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items">
          <SidebarMenuButton>
            <RouterLink :to="item.to" class="font-medium">{{ item.label }}</RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
