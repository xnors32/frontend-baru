<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usersApi } from '@/api/users'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import RoleBadge from '@/components/ui/RoleBadge.vue'
import Modal from '@/components/ui/Modal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { useRealtimeRefresh } from '@/composables/useRealtimeRefresh'
import { capitalize } from '@/utils/format'
import type { User } from '@/types/api'
import { Trash2 } from '@lucide/vue'

const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const users = ref<User[]>([])
const deleteModalOpen = ref(false)
const userToDelete = ref<User | null>(null)

const columns = [
  { key: 'no', label: 'No', class: 'w-16 text-center' },
  { key: 'nama', label: 'Nama Pengguna' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Hak Akses Role' },
  { key: 'aksi', label: 'Aksi', class: 'w-20 text-center' },
]

async function load(silent = false) {
  if (!silent) loading.value = true
  try {
    users.value = await usersApi.getAll()
  } catch (e) {
    if (!silent) toast.show(e instanceof Error ? e.message : 'Gagal memuat pengguna', 'error')
  } finally {
    if (!silent) loading.value = false
  }
}

function remove(user: User) {
  if (user.idUser === auth.user?.idUser) {
    toast.show('Tidak dapat menghapus akun sendiri', 'error')
    return
  }

  userToDelete.value = user
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!userToDelete.value) return

  try {
    await usersApi.remove(userToDelete.value.idUser)
    toast.show('Pengguna dihapus', 'success')
    await load()
    deleteModalOpen.value = false
  } catch (e) {
    toast.show(e instanceof Error ? e.message : 'Gagal menghapus', 'error')
  } finally {
    userToDelete.value = null
  }
}

onMounted(load)
useAutoRefresh(() => load(true))
const { refreshKey } = useRealtimeRefresh()
watch(refreshKey, () => load(true))
</script>

<template>
  <div class="animate-fade-in">
    <PageHeader
      title="Manajemen Pengguna (User Access)"
      :breadcrumbs="[
        { label: 'Application', to: '/' },
        { label: 'Users' },
      ]"
    />

    <LoadingSpinner v-if="loading" />

    <DataTable v-else :columns="columns" empty="Belum ada pengguna">
      <tr
        v-for="(u, index) in users"
        :key="u.idUser"
        class="border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40"
      >
        <td class="px-4 sm:px-5 py-3 sm:py-4 text-center text-slate-600 dark:text-slate-400">{{ index + 1 }}</td>
        <td class="px-4 sm:px-5 py-3 sm:py-4 font-medium text-slate-900 dark:text-white">{{ capitalize(u.nama) }}</td>
        <td class="px-4 sm:px-5 py-3 sm:py-4 text-slate-600 dark:text-slate-300">{{ u.email }}</td>
        <td class="px-4 sm:px-5 py-3 sm:py-4">
          <RoleBadge :role="u.role" />
        </td>
        <td class="px-4 sm:px-5 py-3 sm:py-4 text-center">
          <button
            type="button"
            class="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            title="Hapus"
            :disabled="u.idUser === auth.user?.idUser"
            @click="remove(u)"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </td>
      </tr>
    </DataTable>

    <Modal v-model:open="deleteModalOpen" title="Hapus Pengguna" size="xs">
      <div class="space-y-4">
        <p class="text-sm text-slate-500">
          Anda yakin ingin menghapus pengguna "{{ userToDelete?.nama }}"? Tindakan ini tidak dapat dibatalkan.
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
  </div>
</template>
