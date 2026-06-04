import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system' | 'schedule'

const STORAGE_KEY = 'labvault-theme'

function isScheduleDark(): boolean {
  const hour = new Date().getHours()
  return hour < 6 || hour >= 18
}

function resolveDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  if (mode === 'schedule') return isScheduleDark()
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(
    (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system',
  )
  const isDark = ref(resolveDark(mode.value))

  let media: MediaQueryList | null = null

  function sync() {
    isDark.value = resolveDark(mode.value)
    applyDark(isDark.value)
    localStorage.setItem(STORAGE_KEY, mode.value)
  }

  function setMode(next: ThemeMode) {
    mode.value = next
    sync()
  }

  function cycle() {
    const order: ThemeMode[] = ['light', 'dark', 'system', 'schedule']
    const idx = order.indexOf(mode.value)
    setMode(order[(idx + 1) % order.length]!)
  }

  function init() {
    sync()
    media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', () => {
      if (mode.value === 'system') sync()
    })
    setInterval(() => {
      if (mode.value === 'schedule') sync()
    }, 60_000)
  }

  watch(mode, sync)

  return { mode, isDark, setMode, cycle, init }
})
