<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string | number
  sub?: string
  icon: Component
  accent?: 'cyan' | 'violet' | 'emerald' | 'amber'
}>()

const accents = {
  cyan: 'from-lab-500/20 to-lab-600/5 text-lab-600 dark:text-lab-400',
  violet: 'from-accent-500/20 to-accent-600/5 text-accent-600 dark:text-accent-400',
  emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-600 dark:text-emerald-400',
  amber: 'from-amber-500/20 to-amber-600/5 text-amber-600 dark:text-amber-400',
}
</script>

<template>
  <div
    class="card-hover glass rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden group"
  >
    <div
      class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-transform duration-500 group-hover:scale-125"
      :class="accents[accent ?? 'cyan']"
    />
    <div class="relative flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ label }}
        </p>
        <p class="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {{ value }}
        </p>
        <p v-if="sub" class="mt-1 text-xs text-slate-500">{{ sub }}</p>
      </div>
      <div
        class="flex h-10 sm:h-11 w-10 sm:w-11 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br"
        :class="accents[accent ?? 'cyan']"
      >
        <component :is="icon" class="h-5 w-5" />
      </div>
    </div>
  </div>
</template>
