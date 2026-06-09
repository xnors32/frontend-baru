<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { capitalize } from '@/utils/format'
import { usePusher } from '@/composables/usePusher'
import { useNotificationStore } from '@/stores/notifications'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ClipboardList,
  LogOut,
  Menu,
  X,
  FlaskConical,
  ChevronRight,
  Tags,
  Users,
  Bell,
  Atom,
  BookOpen,
} from '@lucide/vue'
import { computed } from 'vue'

const auth = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)
const notifOpen = ref(false)

const notif = useNotificationStore()

function formatTime(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'baru saja'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm lalu'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'j lalu'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const allNavItems = [
  { to: '/', name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: null as string[] | null },
  { to: '/kategori', name: 'kategori', label: 'Kategori', icon: Tags, roles: ['ADMIN', 'PETUGAS'] },
  { to: '/barang', name: 'barang', label: 'Barang', icon: Package, roles: null },
  { to: '/shop', name: 'shop', label: 'Shop', icon: ShoppingBag, roles: null },
  { to: '/peminjaman', name: 'peminjaman', label: 'Peminjaman', icon: ClipboardList, roles: null },
  { to: '/shop-manage', name: 'shop-manage', label: 'Shop & DB', icon: ShoppingBag, roles: ['ADMIN'] },
  { to: '/users', name: 'users', label: 'Pengguna', icon: Users, roles: ['ADMIN'] },
  { to: '/periodic-table', name: 'periodic-table', label: 'Periodic Table', icon: Atom, roles: null },
  { to: '/resources', name: 'resources', label: 'Jurnal & Tutorial', icon: BookOpen, roles: null },
]

const navItems = computed(() =>
  allNavItems.filter(
    (item) => !item.roles || (auth.user && item.roles.includes(auth.user.role)),
  ),
)

usePusher()

function isActive(name: string) {
  if (name === 'dashboard') return route.name === 'dashboard'
  return route.name?.toString().startsWith(name) ?? false
}

function logout() {
  auth.logout()
  window.location.href = '/login'
}
</script>

<template>
  <div class="flex min-h-dvh">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col glass-strong border-r transition-transform duration-300 sm:w-72 lg:static lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="flex items-center gap-3 border-b border-slate-200/60 px-6 py-5 dark:border-slate-700/50">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lab-500 to-accent-500 text-white shadow-lg shadow-lab-500/30"
        >
          <FlaskConical class="h-5 w-5" />
        </div>
        <div>
          <h1 class="font-display text-lg font-bold tracking-tight">LabVault</h1>
          <p class="text-[10px] uppercase tracking-widest text-slate-500">Inventaris Lab</p>
        </div>
        <button
          class="ml-auto lg:hidden rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          @click="sidebarOpen = false"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto space-y-1 px-4 py-6">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
          :class="
            isActive(item.name)
              ? 'bg-gradient-to-r from-lab-500/15 to-accent-500/10 text-lab-700 dark:text-lab-300 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80'
          "
          @click="sidebarOpen = false"
        >
          <component
            :is="item.icon"
            class="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
            :class="isActive(item.name) ? 'text-lab-600 dark:text-lab-400' : ''"
          />
          {{ item.label }}
          <ChevronRight
            v-if="isActive(item.name)"
            class="ml-auto h-4 w-4 text-lab-500 opacity-60"
          />
        </RouterLink>
      </nav>

      <div class="border-t border-slate-200/60 p-4 dark:border-slate-700/50">
        <div class="mb-3 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
          <p class="text-xs text-slate-500">Masuk sebagai</p>
          <p class="font-semibold text-sm truncate">{{ capitalize(auth.user?.nama) }}</p>
          <span
            class="mt-1 inline-block rounded-md bg-lab-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lab-700 dark:text-lab-300"
          >
            {{ auth.user?.role }}
          </span>
        </div>
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/40"
          @click="logout"
        >
          <LogOut class="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex flex-1 flex-col min-w-0">
      <header
        class="sticky top-0 z-30 flex items-center gap-3 sm:gap-4 border-b border-slate-200/60 glass px-3 sm:px-4 py-3 lg:px-8 dark:border-slate-700/50"
      >
        <button
          class="rounded-xl p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          @click="sidebarOpen = true"
        >
          <Menu class="h-5 w-5" />
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-slate-500 hidden sm:block">Selamat datang kembali</p>
          <p class="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">
            {{ capitalize(auth.user?.nama) }}
          </p>
        </div>
        <div class="relative">
          <button
            type="button"
            class="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            @click="notifOpen = !notifOpen"
          >
            <Bell class="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span
              v-if="notif.unreadCount > 0"
              class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
            >
              {{ notif.unreadCount }}
            </span>
          </button>

          <div
            v-if="notifOpen"
            class="absolute right-0 top-full mt-2 w-80 sm:w-96 origin-top-right z-50"
          >
            <div class="glass-strong rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Notifikasi</p>
                <button
                  v-if="notif.unreadCount > 0"
                  type="button"
                  class="text-xs font-medium text-lab-600 hover:text-lab-500"
                  @click="notif.markAllRead()"
                >
                  Tandai dibaca
                </button>
              </div>
              <div class="max-h-72 overflow-y-auto">
                <div
                  v-for="n in notif.items"
                  :key="n.id"
                  class="flex gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40 transition-colors"
                  :class="!n.read ? 'bg-lab-50/50 dark:bg-lab-900/10' : ''"
                >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-slate-800 dark:text-slate-200">{{ n.message }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">{{ formatTime(n.timestamp) }}</p>
                  </div>
                  <div
                    v-if="!n.read"
                    class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-lab-500"
                  />
                </div>
                <div v-if="!notif.items.length" class="px-4 py-8 text-center text-sm text-slate-400">
                  Belum ada notifikasi
                </div>
              </div>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div
        v-if="notifOpen"
        class="fixed inset-0 z-40"
        @click="notifOpen = false"
      />

      <main class="flex-1 overflow-auto p-3 sm:p-4 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
