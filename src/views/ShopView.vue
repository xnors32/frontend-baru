<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { shopApi } from '@/api/shop'
import { useToast } from '@/composables/useToast'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { useRealtimeRefresh } from '@/composables/useRealtimeRefresh'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { formatRupiah } from '@/utils/format'
import type { ShopItem } from '@/types/api'
import { ShoppingBag, Search, Package, Filter } from '@lucide/vue'

const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const items = ref<ShopItem[]>([])
const search = ref('')
const selectedCategory = ref<string>('')

const categories = computed(() => {
  const cats = new Set(items.value.map(i => i.namaKategori).filter(Boolean) as string[])
  return ['', ...Array.from(cats).sort()]
})

const filtered = computed(() => {
  let result = items.value
  const q = search.value.trim().toLowerCase()
  if (q) {
    result = result.filter(
      i => i.namaBarang.toLowerCase().includes(q) || i.kodeBarang.toLowerCase().includes(q)
    )
  }
  if (selectedCategory.value) {
    result = result.filter(i => i.namaKategori === selectedCategory.value)
  }
  return result
})

async function load(silent = false) {
  if (!silent) loading.value = true
  try {
    items.value = await shopApi.getAll()
  } catch (e) {
    if (!silent) toast.show(e instanceof Error ? e.message : 'Gagal memuat bahan habis pakai', 'error')
  } finally {
    if (!silent) loading.value = false
  }
}

onMounted(load)
useAutoRefresh(() => load(true))
const { refreshKey } = useRealtimeRefresh()
watch(refreshKey, () => load(true))
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="font-display text-xl sm:text-2xl font-bold dark:text-white">Bahan Habis Pakai</h1>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">
          Katalog bahan habis pakai untuk penyewa laboratorium
        </p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="search"
          placeholder="Cari nama atau kode barang..."
          class="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm glass dark:border-slate-700 dark:bg-slate-900/50"
        />
      </div>
      <div v-if="categories.length > 1" class="relative">
        <Filter class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <select
          v-model="selectedCategory"
          class="w-full sm:w-auto rounded-xl border border-slate-200 py-3 pl-10 pr-8 text-sm glass dark:border-slate-700 dark:bg-slate-900/50 appearance-none"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories.slice(1)" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="!filtered.length"
      title="Tidak ada bahan habis pakai"
      description="Belum ada bahan habis pakai yang tersedia saat ini"
      :icon="Package"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="item in filtered"
        :key="item.idBarang"
        class="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-lab-200 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-lab-700"
      >
        <div class="flex items-center justify-center h-32 sm:h-40 rounded-xl bg-gradient-to-br from-lab-50 to-accent-50 mb-4 dark:from-lab-950/50 dark:to-accent-950/50">
          <ShoppingBag class="h-10 w-10 sm:h-12 sm:w-12 text-lab-400 dark:text-lab-600 group-hover:scale-110 transition-transform duration-300" />
        </div>

        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-tight line-clamp-2">
              {{ item.namaBarang }}
            </h3>
          </div>

          <p class="text-[10px] font-mono font-semibold uppercase tracking-wide text-lab-600 dark:text-lab-400">
            {{ item.kodeBarang }}
          </p>

          <div class="flex items-center gap-2 text-xs text-slate-500">
            <span v-if="item.namaKategori" class="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
              {{ item.namaKategori }}
            </span>
            <span v-if="item.lokasi" class="truncate">{{ item.lokasi }}</span>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span class="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {{ formatRupiah(item.harga) }}
            </span>
            <span class="text-xs" :class="item.jumlahTersedia > 0 ? 'text-lab-600 dark:text-lab-400' : 'text-rose-500'">
              {{ item.jumlahTersedia > 0 ? `Stok: ${item.jumlahTersedia}` : 'Habis' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
