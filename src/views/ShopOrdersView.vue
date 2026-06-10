<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { shopOrderApi } from '@/api/shopOrder'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { ShopOrder } from '@/types/api'
import { Package, ShoppingBag, Check, X, ChevronRight } from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'

const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const orders = ref<ShopOrder[]>([])

function formatPrice(price: number) {
  return price.toLocaleString('id-ID')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const statusColors: Record<string, string> = {
  MENUNGGU: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  DISIAPKAN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  SELESAI: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  DIBATALKAN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const statusLabels: Record<string, string> = {
  MENUNGGU: 'Menunggu',
  DISIAPKAN: 'Disiapkan',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
}

async function load() {
  loading.value = true
  try {
    orders.value = await shopOrderApi.getAll()
  } catch (e) {
    toast.show('Gagal memuat pesanan', 'error')
  } finally {
    loading.value = false
  }
}

async function updateStatus(order: ShopOrder, status: string) {
  try {
    await shopOrderApi.updateStatus(order.id, status)
    toast.show(`Pesanan ${statusLabels[status] || status}`, 'success')
    await load()
  } catch (e) {
    toast.show(e instanceof Error ? e.message : 'Gagal update status', 'error')
  }
}

onMounted(load)
</script>

<template>
  <div class="animate-fade-in">
    <PageHeader
      title="Pesanan Shop"
      :breadcrumbs="[
        { label: 'Application', to: '/' },
        { label: 'Pesanan Shop' },
      ]"
    />

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="!orders.length"
      title="Belum ada pesanan"
      description="Belum ada mahasiswa yang memesan produk"
      :icon="Package"
    />

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                v-if="order.productImage"
                :src="order.productImage"
                :alt="order.productName"
                class="w-full h-full object-cover"
              />
              <ShoppingBag v-else class="h-6 w-6 text-slate-400" />
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-slate-900 dark:text-white truncate">{{ order.productName }}</h3>
              <p class="text-sm text-slate-500 mt-0.5">
                {{ order.orderBy }} &middot; {{ formatDate(order.createdAt) }}
              </p>
              <p class="text-sm text-slate-500">
                {{ order.quantity }} x Rp {{ formatPrice(order.totalHarga / order.quantity) }}
                <span class="font-semibold text-lab-700 dark:text-lab-400">
                  = Rp {{ formatPrice(order.totalHarga) }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-shrink-0">
            <span
              class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusColors[order.status] || 'bg-slate-100 text-slate-600'"
            >
              {{ statusLabels[order.status] || order.status }}
            </span>

            <div v-if="order.status === 'MENUNGGU'" class="flex gap-2">
              <button
                @click="updateStatus(order, 'DISIAPKAN')"
                class="rounded-lg bg-lab-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-lab-500 transition-colors inline-flex items-center gap-1"
              >
                <Check :size="14" />
                Siapkan
              </button>
              <button
                @click="updateStatus(order, 'DIBATALKAN')"
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
              >
                <X :size="14" />
                Tolak
              </button>
            </div>

            <button
              v-else-if="order.status === 'DISIAPKAN'"
              @click="updateStatus(order, 'SELESAI')"
              class="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 transition-colors inline-flex items-center gap-1"
            >
              <Check :size="14" />
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
