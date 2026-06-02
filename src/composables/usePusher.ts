import { onMounted, onUnmounted } from 'vue'
import Pusher from 'pusher-js'
import { useToast } from './useToast'
import { useAuthStore } from '@/stores/auth'

export function usePusher() {
  const toast = useToast()
  const auth = useAuthStore()

  let pusher: Pusher | null = null
  let channel: ReturnType<typeof pusher.subscribe> | null = null

  function connect() {
    if (pusher) return

    pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    })

    channel = pusher.subscribe('notifications')

    channel.bind('peminjaman-updated', (data: { message: string; userId: number }) => {
      if (data.userId === auth.user?.idUser) {
        toast.show(data.message, 'info')
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
