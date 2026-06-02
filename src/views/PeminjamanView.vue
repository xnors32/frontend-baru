<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { peminjamanApi } from '@/api/peminjaman'
import { barangApi } from '@/api/barang'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { useRealtimeRefresh } from '@/composables/useRealtimeRefresh'
import Modal from '@/components/ui/Modal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { formatDate, formatRupiah, capitalize } from '@/utils/format'
import type { Barang, DetailPeminjamanPayload, Peminjaman, PeminjamanPayload } from '@/types/api'
import { ClipboardList, Plus, Filter, Trash2 } from '@lucide/vue'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const list = ref<Peminjaman[]>([])
const barangList = ref<Barang[]>([])
const filterStatus = ref<string>('all')
const modalOpen = ref(false)
const saving = ref(false)

const form = ref({
  tglPinjam: '',
  tglKembali: '',
  catatan: '',
  details: [] as { idBarang: number; jumlah: number }[],
})

const filtered = computed(() => {
  if (filterStatus.value === 'all') return list.value
  return list.value.filter((p) => p.status === filterStatus.value)
})

async function load(silent = false) {
  if (!silent) loading.value = true
  try {
    list.value = auth.isStaff ? await peminjamanApi.getAll() : await peminjamanApi.getMy()
    if (auth.isPeminjam) {
      barangList.value = await barangApi.getAll()
    }
  } catch (e) {
    if (!silent) toast.show(e instanceof Error ? e.message : 'Gagal memuat peminjaman', 'error')
  } finally {
    if (!silent) loading.value = false
  }
}

function openCreate() {
  const today = new Date().toISOString().slice(0, 10)
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  form.value = {
    tglPinjam: today,
    tglKembali: nextWeek,
    catatan: '',
    details: [{ idBarang: barangList.value[0]?.idBarang ?? 0, jumlah: 1 }],
  }
  modalOpen.value = true
}

function addDetailRow() {
  form.value.details.push({
    idBarang: barangList.value[0]?.idBarang ?? 0,
    jumlah: 1,
  })
}

function removeDetailRow(i: number) {
  form.value.details.splice(i, 1)
}

async function submitCreate() {
  saving.value = true
  const payload: PeminjamanPayload = {
    tglPinjam: form.value.tglPinjam,
    tglKembali: form.value.tglKembali,
    catatan: form.value.catatan || undefined,
    details: form.value.details.filter((d) => d.idBarang && d.jumlah) as DetailPeminjamanPayload[],
  }
  try {
    const created = await peminjamanApi.create(payload)
    toast.show('Pengajuan peminjaman berhasil', 'success')
    modalOpen.value = false
    router.push(`/peminjaman/${created.idPeminjaman}`)
  } catch (e) {
    toast.show(e instanceof Error ? e.message : 'Gagal mengajukan', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(load)
useAutoRefresh(() => load(true))
const { refreshKey } = useRealtimeRefresh()
watch(refreshKey, () => load(true))
</script>

<template>
  <div>
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold dark:text-white">Peminjaman</h1>
        <p class="text-slate-500 text-sm mt-1">
          {{ auth.isStaff ? 'Kelola semua pengajuan' : 'Riwayat & pengajuan Anda' }}
        </p>
      </div>
      <button
        v-if="auth.isPeminjam"
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-lab-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
        @click="openCreate"
      >
        <Plus class="h-4 w-4" />
        Ajukan Peminjaman
      </button>
    </div>

    <div class="mb-6 flex items-center gap-2">
      <Filter class="h-4 w-4 text-slate-400" />
      <select
        v-model="filterStatus"
        class="rounded-xl border border-slate-200 py-2 px-3 text-sm glass dark:border-slate-700"
      >
        <option value="all">Semua status</option>
        <option value="MENUNGGU">Menunggu</option>
        <option value="DISETUJUI">Disetujui</option>
        <option value="DIPINJAM">Dipinjam</option>
        <option value="DIKEMBALIKAN">Dikembalikan</option>
        <option value="DITOLAK">Ditolak</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="!filtered.length"
      title="Belum ada peminjaman"
      :description="auth.isPeminjam ? 'Ajukan peminjaman barang laboratorium' : undefined"
      :icon="ClipboardList"
    >
      <button
        v-if="auth.isPeminjam"
        type="button"
        class="rounded-xl bg-lab-600 px-4 py-2 text-sm font-semibold text-white"
        @click="openCreate"
      >
        Ajukan sekarang
      </button>
    </EmptyState>

    <div v-else class="space-y-3 stagger">
      <button
        v-for="p in filtered"
        :key="p.idPeminjaman"
        type="button"
        class="glass card-hover flex w-full flex-col gap-3 rounded-2xl p-5 text-left sm:flex-row sm:items-center sm:justify-between"
        @click="router.push(`/peminjaman/${p.idPeminjaman}`)"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lab-500/20 to-accent-500/20 font-display font-bold text-lab-700 dark:text-lab-300"
          >
            #{{ p.idPeminjaman }}
          </div>
          <div>
            <p class="font-semibold">{{ capitalize(p.peminjam.nama) }}</p>
            <p class="text-xs text-slate-500 mt-1">
              {{ formatDate(p.tglPinjam) }} — {{ formatDate(p.tglKembali) }}
              · {{ p.details?.length ?? 0 }} item
            </p>
            <p v-if="p.catatan" class="text-xs text-slate-400 mt-1 line-clamp-1">{{ p.catatan }}</p>
          </div>
        </div>
        <StatusBadge :status="p.status" />
      </button>
    </div>

    <Modal v-model:open="modalOpen" title="Ajukan Peminjaman" size="lg">
      <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold uppercase text-slate-500">Tgl Pinjam</label>
            <input v-model="form.tglPinjam" type="date" required class="mt-1 w-full rounded-xl border py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50" />
          </div>
          <div>
            <label class="text-xs font-semibold uppercase text-slate-500">Tgl Kembali</label>
            <input v-model="form.tglKembali" type="date" required class="mt-1 w-full rounded-xl border py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50" />
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold uppercase text-slate-500">Catatan</label>
          <textarea v-model="form.catatan" rows="2" class="mt-1 w-full rounded-xl border py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50" />
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Barang</label>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-lg bg-lab-500/10 px-3 py-1.5 text-xs font-semibold text-lab-700 hover:bg-lab-500/20 dark:text-lab-300 transition-colors"
              @click="addDetailRow"
            >
              <Plus class="h-3.5 w-3.5" />
              Baris
            </button>
          </div>
          <div
            v-for="(d, i) in form.details"
            :key="i"
            class="flex items-start gap-2 mb-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
          >
            <div class="flex-1 min-w-0">
              <select v-model.number="d.idBarang" class="w-full rounded-lg border py-2 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50">
                <option v-for="b in barangList" :key="b.idBarang" :value="b.idBarang" class="py-1">
                  {{ b.namaBarang }}
                </option>
              </select>
              <p v-if="d.idBarang" class="text-[10px] text-slate-400 mt-1 ml-1">
                Stok: {{ barangList.find(b => b.idBarang === d.idBarang)?.jumlahTersedia ?? '—' }}
                · {{ formatRupiah(barangList.find(b => b.idBarang === d.idBarang)?.harga ?? 0) }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <div>
                <label class="text-[10px] text-slate-400 block mb-0.5">Jml</label>
                <input v-model.number="d.jumlah" type="number" min="1" class="w-16 rounded-lg border py-2 px-2 text-sm text-center dark:border-slate-700 dark:bg-slate-900/50" />
              </div>
              <button
                v-if="form.details.length > 1"
                type="button"
                class="mt-5 rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                @click="removeDetailRow(i)"
                title="Hapus"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          :disabled="saving"
          class="w-full rounded-xl bg-gradient-to-r from-lab-600 to-accent-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
          @click="submitCreate"
        >
          {{ saving ? 'Mengirim...' : 'Kirim Pengajuan' }}
        </button>
      </div>
    </Modal>
  </div>
</template>
