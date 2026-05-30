import { onMounted, onUnmounted } from 'vue'

/**
 * Secara otomatis memanggil ulang `fn` ketika:
 * - Tab browser menjadi aktif kembali (visibilitychange)
 * - Interval periodik (default 30 detik)
 *
 * `fn` dipanggil secara diam-diam (silent) sehingga tidak memunculkan
 * spinner loading yang mengganggu. Load awal tetap dihandle oleh
 * onMounted di masing-masing view.
 */
export function useAutoRefresh(fn: () => unknown, intervalMs = 30000) {
  let timer: ReturnType<typeof setInterval> | null = null

  function onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      fn()
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)
    timer = setInterval(fn, intervalMs)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (timer !== null) clearInterval(timer)
  })
}
