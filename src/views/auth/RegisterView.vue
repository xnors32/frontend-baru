<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import type { Role } from '@/types/api'
import { FlaskConical, User, Mail, Lock, ArrowRight, Loader2 } from '@lucide/vue'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const nama = ref('')
const email = ref('')
const password = ref('')
const role = ref<Role>('MAHASISWA')
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    await auth.register({
      nama: nama.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })
    toast.show('Registrasi berhasil! Silakan login.', 'success')
    router.push('/login')
  } catch (e) {
    toast.show(e instanceof Error ? e.message : 'Registrasi gagal', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative flex min-h-dvh items-center justify-center overflow-hidden p-4">
    <!-- Decorative blobs -->
    <div
      class="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-lab-400/20 blur-3xl animate-float"
    />
    <div
      class="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl animate-float"
      style="animation-delay: -2s"
    />

    <div class="absolute top-4 right-4 z-10">
      <ThemeToggle />
    </div>

    <div class="relative grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
      <!-- Brand panel -->
      <div class="hidden lg:flex flex-col justify-center animate-slide-right">
        <div
          class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-lab-500 to-accent-500 text-white shadow-xl shadow-lab-500/25 mb-6"
        >
          <FlaskConical class="h-7 w-7" />
        </div>
        <h1 class="font-display text-4xl font-bold leading-tight text-slate-900 dark:text-white">
          Kelola inventaris lab
          <span class="bg-gradient-to-r from-lab-500 to-accent-500 bg-clip-text text-transparent">
            lebih cerdas
          </span>
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-md">
          LabVault menghubungkan stok barang, pengajuan peminjaman, dan persetujuan petugas dalam
          satu antarmuka yang ringan.
        </p>
        <ul class="mt-8 space-y-3 text-sm text-slate-500">
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-lab-500" />
            Real-time stok & ketersediaan
          </li>
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-accent-500" />
            Alur peminjaman terstruktur
          </li>
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Role-based: Admin, Petugas, Mahasiswa
          </li>
        </ul>
      </div>

      <!-- Form -->
      <form
        class="glass-strong rounded-3xl p-8 shadow-2xl animate-fade-up"
        @submit.prevent="submit"
      >
        <div class="mb-8 lg:hidden flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lab-500 to-accent-500 text-white"
          >
            <FlaskConical class="h-5 w-5" />
          </div>
          <span class="font-display text-xl font-bold">LabVault</span>
        </div>

        <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">Daftar</h2>
        <p class="mt-1 text-sm text-slate-500">Buat akun baru di sistem</p>

        <div class="mt-8 space-y-5">
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nama
            </label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="nama"
                required
                placeholder="Nama lengkap"
                class="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="email"
                type="email"
                required
                placeholder="nama@email.com"
                class="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="password"
                type="password"
                required
                minlength="6"
                placeholder="••••••••"
                class="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Peran
            </label>
            <select
              v-model="role"
              class="w-full rounded-xl border border-slate-200 bg-white/80 py-3 px-4 text-sm dark:border-slate-700 dark:bg-slate-900/50"
            >
              <option value="MAHASISWA">Mahasiswa</option>
              <option value="PETUGAS">Petugas</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/30 transition-all hover:shadow-accent-500/50 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
          <template v-else>
            Daftar
            <ArrowRight class="h-4 w-4" />
          </template>
        </button>

        <p class="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?
          <RouterLink
            to="/login"
            class="font-semibold text-lab-600 hover:text-lab-500 dark:text-lab-400"
          >
            Masuk sekarang
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
