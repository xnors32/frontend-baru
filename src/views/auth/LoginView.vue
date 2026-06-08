<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { FlaskConical, Mail, Lock, ArrowRight, Loader2 } from '@lucide/vue'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  // Validation
  if (!email.value) {
    toast.show('Email harus diisi', 'error')
    return
  }
  if (!password.value) {
    toast.show('Password harus diisi', 'error')
    return
  }

  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    toast.show('Login berhasil!', 'success')
    router.push('/dashboard')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login gagal'
    toast.show(message, 'error')
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !loading.value) {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-lab-50 via-white to-lab-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-lab-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 dark:bg-lab-900/20"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 dark:bg-blue-900/20"></div>

    <!-- Theme Toggle -->
    <div class="absolute top-6 right-6 z-50">
      <ThemeToggle />
    </div>

    <!-- Main Container -->
    <div class="w-full max-w-md relative z-10">
      <!-- Header -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-lab-600 to-lab-700 shadow-lg mb-4">
          <FlaskConical class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Inventori Lab</h1>
        <p class="text-slate-600 dark:text-slate-400">Sistem Manajemen Inventaris Laboratorium</p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 animate-slide-up">
        <!-- Title -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Login</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Masuk dengan akun Anda</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div class="relative">
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="nama@example.com"
                required
                @keypress="handleKeyPress"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lab-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="relative">
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                @keypress="handleKeyPress"
                class="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lab-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-lab-600 to-lab-700 hover:from-lab-700 hover:to-lab-800 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 font-semibold text-white shadow-lg shadow-lab-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span v-if="!loading">Login</span>
            <span v-else class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" />
              Loading...
            </span>
            <ArrowRight v-if="!loading" class="w-4 h-4" />
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">atau</span>
          </div>
        </div>

        <!-- Register Link -->
        <button
          type="button"
          @click="goToRegister"
          class="w-full py-3 px-4 rounded-lg border-2 border-lab-200 dark:border-lab-900 text-lab-700 dark:text-lab-300 font-semibold hover:bg-lab-50 dark:hover:bg-slate-700 transition-all"
        >
          Daftar Akun Baru
        </button>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Sistem Informasi Laboratorium © 2024
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}
</style>
