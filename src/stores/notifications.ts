import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AppNotification {
  id: number
  message: string
  timestamp: number
  read: boolean
  type: 'peminjaman-new' | 'peminjaman-updated'
  peminjamanId: number
}

let counter = 0

export const useNotificationStore = defineStore('notifications', () => {
  const items = ref<AppNotification[]>([])

  function add(n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    items.value.unshift({
      ...n,
      id: ++counter,
      timestamp: Date.now(),
      read: false,
    })
  }

  function markAllRead() {
    items.value.forEach((n) => (n.read = true))
  }

  const unreadCount = computed(() => items.value.filter((n) => !n.read).length)

  return { items, add, markAllRead, unreadCount }
})
