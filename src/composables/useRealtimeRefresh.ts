import { ref } from 'vue'

const refreshKey = ref(0)

export function useRealtimeRefresh() {
  function trigger() {
    refreshKey.value++
  }

  return { refreshKey, trigger }
}
