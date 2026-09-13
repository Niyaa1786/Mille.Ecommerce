<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Eye, RefreshCcw } from 'lucide-vue-next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import DetailOrderDialog from '../components/DetailOrderDialog.vue'
import UpdateOrderStatusDialog from '../components/UpdateOrderStatusDialog.vue'
import ConfirmPaymentDialog from '../components/ConfirmPaymentDialog.vue'

import { useGetOrders } from '../composables/useGetOrders'
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type OrderSummaryDto,
  type PaymentMethod,
  type PaymentStatus,
} from '../types/order'
import { formatCurrency, formatDate } from '@/shared/utils/format'

const { orders, pagination, isLoading, errorMessage, fetchOrders } = useGetOrders()

// ===== Filter / Pagination state =====
const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const statusFilter = ref<OrderStatus | 'All'>('All')

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled']

async function loadOrders() {
  await fetchOrders({
    page: page.value,
    pageSize: pageSize.value,
    keyword: keyword.value || undefined,
    status: statusFilter.value === 'All' ? undefined : statusFilter.value,
  })
}

function goToPage(next: number) {
  if (next < 1 || next > pagination.value.totalPages) return
  page.value = next
  loadOrders()
}

function onSearch() {
  page.value = 1
  loadOrders()
}

function onStatusChange(value: OrderStatus | 'All') {
  statusFilter.value = value
  page.value = 1
  loadOrders()
}

// ===== Helpers =====
function statusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status
}

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Completed':
      return 'default'
    case 'Cancelled':
      return 'destructive'
    case 'Shipping':
      return 'secondary'
    default:
      return 'outline'
  }
}

function paymentLabel(method: string): string {
  return PAYMENT_METHOD_LABELS[method as PaymentMethod] ?? method
}

function paymentStatusLabel(status: string): string {
  return PAYMENT_STATUS_LABELS[status as PaymentStatus] ?? status
}

function canUpdateStatus(order: OrderSummaryDto): boolean {
  return order.status !== 'Completed' && order.status !== 'Cancelled'
}

function canConfirmPayment(order: OrderSummaryDto): boolean {
  return order.paymentMethod === 'COD' && order.paymentStatus === 'Pending'
}

// ===== Detail dialog =====
const detailOpen = ref(false)
const detailOrderId = ref<string | null>(null)
function openDetail(order: OrderSummaryDto) {
  detailOrderId.value = order.id
  detailOpen.value = true
}

// ===== Update status dialog =====
const updateOpen = ref(false)
const updateTarget = ref<OrderSummaryDto | null>(null)
function openUpdate(order: OrderSummaryDto) {
  updateTarget.value = order
  updateOpen.value = true
}

// ===== Confirm payment dialog =====
const confirmOpen = ref(false)
const confirmTarget = ref<OrderSummaryDto | null>(null)
function openConfirmPayment(order: OrderSummaryDto) {
  confirmTarget.value = order
  confirmOpen.value = true
}

onMounted(loadOrders)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Orders</h1>
        <p class="text-sm text-muted-foreground">Manage customer orders.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 max-w-sm">
        <Input
          v-model="keyword"
          placeholder="Search receiver / phone / address..."
          @keyup.enter="onSearch"
        />
        <Button variant="outline" @click="onSearch">Search</Button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">Status:</span>
        <Select
          :model-value="statusFilter"
          @update:model-value="(v) => onStatusChange(v as OrderStatus | 'All')"
        >
          <SelectTrigger class="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem v-for="s in STATUS_OPTIONS" :key="s" :value="s">
              {{ ORDER_STATUS_LABELS[s] }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Receiver</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead class="w-40 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <!-- Loading -->
          <template v-if="isLoading">
            <TableRow v-for="i in 5" :key="`sk-${i}`">
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
              <TableCell><Skeleton class="h-4 w-full" /></TableCell>
            </TableRow>
          </template>

          <!-- Data -->
          <template v-else-if="orders.length">
            <TableRow v-for="order in orders" :key="order.id">
              <TableCell class="font-mono text-xs">
                {{ order.id.slice(0, 8).toUpperCase() }}
              </TableCell>
              <TableCell class="font-medium">{{ order.receiverName }}</TableCell>
              <TableCell class="text-muted-foreground">{{ order.receiverPhone }}</TableCell>
              <TableCell class="font-semibold">
                {{ formatCurrency(order.totalAmount) }}
              </TableCell>
              <TableCell class="text-muted-foreground">
                {{ paymentLabel(order.paymentMethod) }}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{{ paymentStatusLabel(order.paymentStatus) }}</Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="statusVariant(order.status)">
                  {{ statusLabel(order.status) }}
                </Badge>
              </TableCell>
              <TableCell class="text-xs text-muted-foreground">
                {{ formatDate(order.createdAt) }}
              </TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="View details"
                    @click="openDetail(order)"
                  >
                    <Eye class="size-4 text-blue-500" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Update status"
                    :disabled="!canUpdateStatus(order)"
                    @click="openUpdate(order)"
                  >
                    <RefreshCcw class="size-4 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Confirm COD payment"
                    :disabled="!canConfirmPayment(order)"
                    @click="openConfirmPayment(order)"
                  >
                    <WalletCheck class="size-4 text-green-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- Empty -->
          <template v-else>
            <TableRow>
              <TableCell colspan="9" class="h-24 text-center text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-muted-foreground">
        Page {{ pagination.page }} of {{ pagination.totalPages }} —
        {{ pagination.totalCount }} items
      </span>

      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1 || isLoading"
          @click="goToPage(pagination.page - 1)"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page >= pagination.totalPages || isLoading"
          @click="goToPage(pagination.page + 1)"
        >
          Next
        </Button>
      </div>
    </div>

    <!-- Dialogs -->
    <DetailOrderDialog v-model:open="detailOpen" :order-id="detailOrderId" />
    <UpdateOrderStatusDialog
      v-model:open="updateOpen"
      :order="updateTarget"
      @success="loadOrders"
    />
    <ConfirmPaymentDialog v-model:open="confirmOpen" :order="confirmTarget" @success="loadOrders" />
  </div>
</template>
