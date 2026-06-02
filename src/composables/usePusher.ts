import { onMounted, onUnmounted } from 'vue'
import Pusher from 'pusher-js'
import { useToast } from './useToast'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

export function usePusher() {
  const toast = useToast()
  const auth = useAuthStore()
  const notif = useNotificationStore()

  let pusher: Pusher | null = null
  let channel: ReturnType<typeof pusher.subscribe> | null = null

  function connect() {
    if (pusher) return

    pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    })

    channel = pusher.subscribe('notifications')

    channel.bind('peminjaman-new', (data: { message: string; peminjamanId: number }) => {
      if (auth.user && ['ADMIN', 'PETUGAS'].includes(auth.user.role)) {
        toast.show(data.message, 'info')
        notif.add({ message: data.message, type: 'peminjaman-new', peminjamanId: data.peminjamanId })
      }
    })

    channel.bind('peminjaman-updated', (data: { message: string; userId: number; peminjamanId: number }) => {
      if (data.userId === auth.user?.idUser) {
        toast.show(data.message, 'info')
        notif.add({ message: data.message, type: 'peminjaman-updated', peminjamanId: data.peminjamanId })
      }
    })
  }

  function disconnect() {
    if (channel) {
      channel.unbind_all()
      channel.unsubscribe()
    }
    if (pusher) {
      pusher.disconnect()
      pusher = null
    }
  }

  onMounted(() => {
    if (auth.user) connect()
  })

  onUnmounted(disconnect)

  return { connect, disconnect }
}
