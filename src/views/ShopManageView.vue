<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { barangApi } from '@/api/barang'
import { kategoriApi } from '@/api/kategori'
import { useToast } from '@/composables/useToast'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { useRealtimeRefresh } from '@/composables/useRealtimeRefresh'
import Modal from '@/components/ui/Modal.vue'
import DataTable from '@/components/ui/DataTable.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { formatRupiah } from '@/utils/format'
import type { Barang, BarangPayload, Kategori, Kondisi } from '@/types/api'
import { Plus, Search, Pencil, Trash2, Package } from '@lucide/vue'

const toast = useToast()
const loading = ref(true)
const items = ref<Barang[]>([])
const kategoriList = ref<Kategori[]>([])
const search = ref('')
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const itemToDeleteId = ref<number | null>(null)
const editing = ref<Barang | null>(null)
const saving = ref(false)

const form = ref<BarangPayload>({
  namaBarang: '',
  kodeBarang: '',
  jumlahTotal: 1,
  idKategori: 0,
  kondisi: 'BAIK',
  lokasi: '',
  harga: 0,
})

const columns = [
  { key: 'no', label: 'No', class: 'w-14 text-center' },
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama Barang' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'stok', label: 'Stok' },
  { key: 'harga', label: 'Harga' },
  { key: 'lokasi', label: 'Lokasi' },
  { key: 'aksi', label: 'Aksi', class: 'w-24 text-center' },
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(
    (b) =>
      b.namaBarang.toLowerCase().includes(q) ||
      b.kodeBarang.toLowerCase().includes(q) ||
      b.lokasi?.toLowerCase().includes(q),
  )
})

async function load(silent = false) {
  if (!silent) loading.value = true
  try {
    items.value = await barangApi.getAll()
    try { kategoriList.value = await kategoriApi.getAll() } catch { }
  } catch (e) {
    if (!silent) toast.show(e instanceof Error ? e.message : 'Gagal memuat data', 'error')
  } finally {
    if (!silent) loading.value = false
  }
}

function openCreate() {
  editing.value = null
  form.value = {
    namaBarang: '',
    kodeBarang: '',
    jumlahTotal: 1,
    idKategori: kategoriList.value[0]?.idKategori ?? 1,
    kondisi: 'BAIK',
    lokasi: '',
    harga: 0,
  }
  modalOpen.value = true
}

function openEdit(b: Barang) {
  editing.value = b
  form.value = {
    namaBarang: b.namaBarang,
    kodeBarang: b.kodeBarang,
    jumlahTotal: b.jumlahTotal,
    idKategori: b.idKategori ?? 1,
    kondisi: (b.kondisi as Kondisi) || 'BAIK',
    lokasi: b.lokasi ?? '',
    harga: b.harga ?? 0,
  }
  modalOpen.value = true
}

async function save() {
  saving.value = true
  try {
    if (editing.value) {
      await barangApi.update(editing.value.idBarang, form.value)
      toast.show('Item diperbarui', 'success')
    } else {
      await barangApi.create(form.value)
      toast.show('Item ditambahkan', 'success')
    }
    modalOpen.value = false
    await load()
  } catch (e) {
    toast.show(e instanceof Error ? e.message : 'Gagal menyimpan', 'error')
  } finally {
    saving.value = false
  }
}

function remove(id: number) {
  itemToDeleteId.value = id
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (itemToDeleteId.value === null) return
  try {
    await barangApi.remove(itemToDeleteId.value)
    toast.show('Item dihapus', 'success')
    await load()
    deleteModalOpen.value = false
  } catch (e) {
    toast.show(e instanceof Error ? e.message : 'Gagal menghapus', 'error')
  } finally {
    itemToDeleteId.value = null
  }
}

onMounted(load)
useAutoRefresh(() => load(true))
const { refreshKey } = useRealtimeRefresh()
watch(refreshKey, () => load(true))
</script>

<template>
  <div class="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 class="font-display text-xl sm:text-2xl font-bold dark:text-white">Shop &amp; DB Management</h1>
      <p class="text-slate-500 text-xs sm:text-sm mt-1">
        Kelola inventaris barang dan bahan habis pakai
      </p>
    </div>
    <button
      type="button"
      class="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-lab-600 to-lab-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-lab-500/25 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
      @click="openCreate"
    >
      <Plus class="h-4 w-4" />
      Tambah Item
    </button>
  </div>

  <div class="relative mb-6 max-w-full sm:max-w-md">
    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      v-model="search"
      placeholder="Cari nama, kode, lokasi..."
      class="w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-3 pl-10 pr-4 text-sm glass dark:border-slate-700"
    />
  </div>

  <LoadingSpinner v-if="loading" />

  <EmptyState
    v-else-if="!filtered.length"
    title="Tidak ada item"
    description="Mulai dengan menambahkan item baru"
    :icon="Package"
  />

  <DataTable v-else :columns="columns" empty="Tidak ada item">
    <tr
      v-for="(b, index) in filtered"
      :key="b.idBarang"
      class="border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40"
    >
      <td class="px-4 sm:px-5 py-3 sm:py-4 text-center text-slate-600 dark:text-slate-400">{{ index + 1 }}</td>
      <td class="px-4 sm:px-5 py-3 sm:py-4 font-mono text-xs font-semibold text-lab-700 dark:text-lab-400">
        {{ b.kodeBarang }}
      </td>
      <td class="px-4 sm:px-5 py-3 sm:py-4 font-medium text-slate-900 dark:text-white">
        {{ b.namaBarang }}
      </td>
      <td class="px-4 sm:px-5 py-3 sm:py-4 text-slate-600 dark:text-slate-300">
        {{ b.namaKategori ?? '-' }}
      </td>
      <td class="px-4 sm:px-5 py-3 sm:py-4">
        <span class="font-semibold text-lab-600 dark:text-lab-400">{{ b.jumlahTersedia }}</span>
        <span class="text-slate-400 text-xs"> / {{ b.jumlahTotal }}</span>
      </td>
      <td class="px-4 sm:px-5 py-3 sm:py-4 font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
        {{ formatRupiah(b.harga) }}
      </td>
      <td class="px-4 sm:px-5 py-3 sm:py-4 text-slate-600 dark:text-slate-300">
        {{ b.lokasi || '-' }}
      </td>
      <td class="px-4 sm:px-5 py-3 sm:py-4">
        <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <button
            type="button"
            class="w-full sm:w-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-lab-600 dark:hover:bg-slate-800"
            title="Edit"
            @click="openEdit(b)"
          >
            <Pencil class="h-4 w-4 mx-auto" />
          </button>
          <button
            type="button"
            class="w-full sm:w-auto rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
            title="Hapus"
            @click="remove(b.idBarang)"
          >
            <Trash2 class="h-4 w-4 mx-auto" />
          </button>
        </div>
      </td>
    </tr>
  </DataTable>

  <Modal v-model:open="modalOpen" :title="editing ? 'Edit Item' : 'Tambah Item Baru'" size="lg">
    <div class="space-y-4 sm:space-y-5">
      <div class="space-y-3 sm:space-y-4">
        <h3 class="font-display font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Informasi Dasar</h3>
        <div>
          <label class="text-xs font-semibold uppercase text-slate-500">Nama Barang</label>
          <input
            v-model="form.namaBarang"
            required
            placeholder="Contoh: Gelas Kertas 8oz"
            class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
          />
        </div>
        <div>
          <label class="text-xs font-semibold uppercase text-slate-500">Kategori</label>
          <select
            v-if="kategoriList.length"
            v-model.number="form.idKategori"
            class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
          >
            <option v-for="k in kategoriList" :key="k.idKategori" :value="k.idKategori">
              {{ k.namaKategori }}
            </option>
          </select>
          <input
            v-else
            v-model.number="form.idKategori"
            type="number"
            min="1"
            placeholder="ID Kategori"
            class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
          />
        </div>
        <div>
          <label class="text-xs font-semibold uppercase text-slate-500">Deskripsi / Lokasi</label>
          <textarea
            v-model="form.lokasi"
            placeholder="Jelaskan detail atau lokasi barang..."
            rows="3"
            class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50 resize-none"
          ></textarea>
        </div>
      </div>

      <hr class="border-slate-200 dark:border-slate-700">

      <div class="space-y-3 sm:space-y-4">
        <h3 class="font-display font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detail Inventaris</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label class="text-xs font-semibold uppercase text-slate-500">Kode Barang</label>
            <input
              v-model="form.kodeBarang"
              required
              placeholder="SKU-XXX"
              class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
            />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase text-slate-500">Jumlah Total</label>
            <input
              v-model.number="form.jumlahTotal"
              type="number"
              min="0"
              class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
            />
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold uppercase text-slate-500">Harga (Rp)</label>
          <input
            v-model.number="form.harga"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
          />
          <p v-if="form.harga" class="mt-1 text-xs text-slate-500">
            Preview: {{ formatRupiah(form.harga) }}
          </p>
        </div>
        <div>
          <label class="text-xs font-semibold uppercase text-slate-500">Kondisi</label>
          <select
            v-model="form.kondisi"
            class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
          >
            <option value="BAIK">Baik</option>
            <option value="RUSAK_RINGAN">Rusak Ringan</option>
            <option value="RUSAK_BERAT">Rusak Berat</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        :disabled="saving"
        class="w-full rounded-lg sm:rounded-xl bg-lab-600 py-2 sm:py-3 text-sm font-semibold text-white hover:bg-lab-500 disabled:opacity-60 transition-colors"
        @click="save"
      >
        {{ saving ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>
  </Modal>

  <Modal v-model:open="deleteModalOpen" title="Hapus Item" size="xs">
    <div class="space-y-4">
      <p class="text-sm text-slate-500">
        Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          @click="deleteModalOpen = false"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
          @click="confirmDelete"
        >
          Hapus
        </button>
      </div>
    </div>
  </Modal>
</template>
