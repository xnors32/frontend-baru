<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { shopApi } from '@/api/shop'
import { shopOrderApi } from '@/api/shopOrder'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { ShopProduct } from '@/types/api'
import { ShoppingCart, Package, Plus, Minus } from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const items = ref<ShopProduct[]>([])
const buyingProduct = ref<ShopProduct | null>(null)
const quantity = ref(1)

function formatPrice(price: number) {
  return price.toLocaleString('id-ID')
}

function openBuy(product: ShopProduct) {
  buyingProduct.value = product
  quantity.value = 1
}

function closeBuy() {
  buyingProduct.value = null
}

async function confirmBuy() {
  if (!buyingProduct.value) return
  const product = buyingProduct.value
  try {
    await shopOrderApi.create({ productId: product.id, quantity: quantity.value })
    toast.show(`Pesanan "${product.namaProduk}" x${quantity.value} berhasil!`, 'success')
    items.value = await shopApi.getAll()
    closeBuy()
  } catch (e) {
    toast.show(e instanceof Error ? e.message : 'Gagal memesan', 'error')
  }
}

onMounted(async () => {
  try {
    items.value = await shopApi.getAll()
  } catch (e) {
    console.error('Gagal memuat produk shop:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="animate-fade-in">
    <PageHeader
      title="Shop Bahan Lab"
      :breadcrumbs="[
        { label: 'Application', to: '/' },
        { label: 'Shop' },
      ]"
    >
      <template #actions>
        <button
          v-if="auth.isAdmin"
          @click="router.push('/shop/upload')"
          class="inline-flex items-center gap-2 rounded-xl bg-lab-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-lab-700"
        >
          <Plus :size="16" />
          Tambah Produk
        </button>
      </template>
    </PageHeader>

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="!items.length"
      title="Belum ada produk"
      description="Belum ada produk shop yang tersedia"
      :icon="Package"
    />

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="aspect-square mb-4 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          <img
            v-if="item.gambarUrl"
            :src="item.gambarUrl"
            :alt="item.namaProduk"
            class="h-full w-full object-cover"
          />
          <ShoppingCart v-else class="h-12 w-12 text-slate-400" />
        </div>

        <div>
          <h3 class="font-semibold text-slate-900 dark:text-white truncate">{{ item.namaProduk }}</h3>
          <p v-if="item.deskripsi" class="mt-1 text-xs text-slate-500 line-clamp-2">{{ item.deskripsi }}</p>

          <div class="mt-3 flex items-center justify-between">
            <span class="text-lg font-bold text-lab-700 dark:text-lab-400">
              Rp {{ formatPrice(item.harga) }}
            </span>
            <span
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300"
            >
              Stok: {{ item.stok }}
            </span>
          </div>

          <div v-if="item.kategori" class="mt-2">
            <span class="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              {{ item.kategori }}
            </span>
          </div>

          <button
            v-if="item.stok > 0"
            @click="openBuy(item)"
            class="mt-3 w-full rounded-lg bg-lab-600 py-2 text-sm font-semibold text-white hover:bg-lab-500 transition-colors"
          >
            Beli
          </button>
          <button
            v-else
            disabled
            class="mt-3 w-full rounded-lg bg-slate-200 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed dark:bg-slate-700"
          >
            Stok Habis
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="buyingProduct"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeBuy"
        >
          <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-md glass-strong rounded-3xl p-6 shadow-2xl animate-scale-in">
            <h2 class="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
              Pesan {{ buyingProduct.namaProduk }}
            </h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">Harga satuan</span>
                <span class="font-semibold text-slate-900 dark:text-white">Rp {{ formatPrice(buyingProduct.harga) }}</span>
              </div>

              <div>
                <label class="text-xs font-semibold uppercase text-slate-500">Jumlah</label>
                <div class="mt-1 flex items-center gap-3">
                  <button
                    @click="quantity = Math.max(1, quantity - 1)"
                    class="rounded-lg border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Minus :size="16" />
                  </button>
                  <input
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    :max="buyingProduct.stok"
                    class="w-20 text-center rounded-lg border border-slate-200 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/50"
                  />
                  <button
                    @click="quantity = Math.min(buyingProduct.stok, quantity + 1)"
                    class="rounded-lg border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Plus :size="16" />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
                <span class="text-sm font-semibold text-slate-900 dark:text-white">Total</span>
                <span class="text-lg font-bold text-lab-700 dark:text-lab-400">
                  Rp {{ formatPrice(buyingProduct.harga * quantity) }}
                </span>
              </div>

              <div class="flex gap-3">
                <button
                  @click="closeBuy"
                  class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  @click="confirmBuy"
                  class="flex-1 rounded-lg bg-lab-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lab-500 transition-colors"
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
