<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string; class?: string }[]
  empty?: string
}>()
</script>

<template>
  <div class="glass rounded-xl sm:rounded-2xl overflow-hidden animate-fade-in">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs sm:text-sm">
        <thead>
          <tr class="border-b border-slate-200/80 dark:border-slate-700/80">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 sm:px-5 py-3 sm:py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
              :class="col.class"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <slot />
        </tbody>
      </table>
    </div>
    <p
      v-if="empty && !$slots.default"
      class="px-5 py-12 text-center text-sm text-slate-500"
    >
      {{ empty }}
    </p>
  </div>
</template>
