<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { shopApi } from '@/api/shop'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { ShopProduct } from '@/types/api'
import { ShoppingCart, Package, Plus } from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(true)
const items = ref<ShopProduct[]>([])

function formatPrice(price: number) {
  return price.toLocaleString('id-ID')
}

onMounted(async () => {
  try {
    items.value = await shopApi.getAll()
  } catch (e) {
    console.error('Gagal memuat produk shop:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="animate-fade-in">
    <PageHeader
      title="Shop Bahan Lab"
      :breadcrumbs="[
        { label: 'Application', to: '/' },
        { label: 'Shop' },
      ]"
    >
      <template #actions>
        <button
          v-if="auth.isAdmin"
          @click="router.push('/shop/upload')"
          class="inline-flex items-center gap-2 rounded-xl bg-lab-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-lab-700"
        >
          <Plus :size="16" />
          Tambah Produk
        </button>
      </template>
    </PageHeader>

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="!items.length"
      title="Belum ada produk"
      description="Belum ada produk shop yang tersedia"
      :icon="Package"
    />

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="aspect-square mb-4 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          <img
            v-if="item.gambarUrl"
            :src="item.gambarUrl"
            :alt="item.namaProduk"
            class="h-full w-full object-cover"
          />
          <ShoppingCart v-else class="h-12 w-12 text-slate-400" />
        </div>

        <div>
          <h3 class="font-semibold text-slate-900 dark:text-white truncate">{{ item.namaProduk }}</h3>
          <p v-if="item.deskripsi" class="mt-1 text-xs text-slate-500 line-clamp-2">{{ item.deskripsi }}</p>

          <div class="mt-3 flex items-center justify-between">
            <span class="text-lg font-bold text-lab-700 dark:text-lab-400">
              Rp {{ formatPrice(item.harga) }}
            </span>
            <span
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300"
            >
              Stok: {{ item.stok }}
            </span>
          </div>

          <div v-if="item.kategori" class="mt-2">
            <span class="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              {{ item.kategori }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
