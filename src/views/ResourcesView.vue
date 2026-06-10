<template>
  <div class="animate-fade-in">
    <PageHeader title="Jurnal & Tutorial" :breadcrumbs="[{ label: 'Application', to: '/' }, { label: 'Resources' }]" />
    <div class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 px-6 text-center dark:border-slate-700">
      <BookOpen class="h-12 w-12 text-slate-400 mb-4" />
      <h3 class="font-semibold text-slate-800 dark:text-slate-100">Coming Soon</h3>
      <p class="mt-2 text-sm text-slate-500">Halaman jurnal dan tutorial sedang dalam pengembangan</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'
</script>
