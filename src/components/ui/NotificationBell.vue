<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notifikasiApi } from '@/api/notifikasi'
import { Bell, CheckCheck, ExternalLink, X } from '@lucide/vue'
import type { Notifikasi } from '@/types/api'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { formatDateTime } from '@/utils/format'

const router = useRouter()
const open = ref(false)
const unreadCount = ref(0)
const notifications = ref<Notifikasi[]>([])

async function loadCount() {
  try {
    unreadCount.value = await notifikasiApi.getUnreadCount()
  } catch {
    // ignore
  }
}

async function loadNotifications() {
  try {
    notifications.value = await notifikasiApi.getMy()
    await loadCount()
  } catch {
    // ignore
  }
}

async function markAsRead(n: Notifikasi) {
  try {
    await notifikasiApi.markAsRead(n.id)
    n.dibaca = true
    await loadCount()
  } catch {
    // ignore
  }
}

async function markAllAsRead() {
  try {
    await notifikasiApi.markAllAsRead()
    notifications.value.forEach((n) => (n.dibaca = true))
    unreadCount.value = 0
  } catch {
    // ignore
  }
}

function goToPeminjaman(id: number) {
  open.value = false
  router.push(`/peminjaman/${id}`)
}

function toggle() {
  open.value = !open.value
  if (open.value) loadNotifications()
}

onMounted(loadCount)
useAutoRefresh(() => loadCount(), 30000)

const unreadNotifications = computed(() => notifications.value.filter((n) => !n.dibaca))
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      @click="toggle"
    >
      <Bell class="h-5 w-5 text-slate-600 dark:text-slate-400" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <Teleport to="body">
      <Transition name="notif">
        <div
          v-if="open"
          class="fixed inset-0 z-[200]"
          @click="open = false"
        >
          <div
            class="absolute top-16 right-4 z-[201] w-80 sm:w-96 max-h-[70vh] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden flex flex-col"
            @click.stop
          >
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 class="font-semibold text-sm">Notifikasi</h3>
              <div class="flex items-center gap-1">
                <button
                  v-if="unreadNotifications.length > 0"
                  type="button"
                  class="rounded-lg px-2 py-1 text-xs font-medium text-lab-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  @click="markAllAsRead"
                >
                  <CheckCheck class="h-3.5 w-3.5 inline mr-1" />
                  Baca semua
                </button>
                <button
                  type="button"
                  class="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  @click="open = false"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="overflow-y-auto flex-1">
              <div
                v-if="notifications.length === 0"
                class="flex flex-col items-center justify-center py-10 text-slate-400"
              >
                <Bell class="h-8 w-8 mb-2" />
                <p class="text-sm">Tidak ada notifikasi</p>
              </div>

              <div
                v-for="n in notifications"
                :key="n.id"
                class="px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                @click="markAsRead(n)"
              >
                <div class="flex gap-3">
                  <div
                    class="mt-1 h-2 w-2 shrink-0 rounded-full"
                    :class="n.dibaca ? 'bg-transparent' : 'bg-lab-500'"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-slate-400 mb-1">
                      {{ formatDateTime(n.createdAt) }}
                    </p>
                    <p class="text-sm whitespace-pre-line leading-relaxed">{{ n.pesan }}</p>
                    <div class="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 text-xs font-medium text-lab-600 hover:text-lab-500 transition-colors"
                        @click.stop="goToPeminjaman(n.idPeminjaman)"
                      >
                        <ExternalLink class="h-3 w-3" />
                        Lihat peminjaman
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.notif-enter-active,
.notif-leave-active {
  transition: opacity 0.15s;
}
.notif-enter-from,
.notif-leave-to {
  opacity: 0;
}
</style>
