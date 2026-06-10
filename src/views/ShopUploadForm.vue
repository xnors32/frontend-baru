<template>
  <div class="animate-fade-in">
    <PageHeader
      title="Upload Produk Shop"
      :breadcrumbs="[
        { label: 'Shop', to: '/shop' },
        { label: 'Upload Produk' },
      ]"
    >
      <template #actions>
        <div class="flex gap-3">
          <button
            @click="resetForm"
            class="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            @click="handleSave"
            :disabled="saving"
            class="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-lab-600 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-lab-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
            <Check v-else :size="18" />
            {{ saving ? 'Menyimpan...' : 'Simpan & Terbitkan' }}
          </button>
        </div>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-6 pb-4 border-b border-slate-200 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
            Informasi Produk
          </h2>
          <div class="space-y-5">
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">
                Nama Produk <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.namaProduk"
                type="text"
                placeholder="Contoh: Larutan NaCl 0.9%"
                class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>

            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">
                Deskripsi Produk
              </label>
              <textarea
                v-model="form.deskripsi"
                placeholder="Jelaskan detail produk bahan lab di sini..."
                rows="5"
                class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50 resize-none"
              ></textarea>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-6 pb-4 border-b border-slate-200 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
            Media Produk
          </h2>

          <div
            @drop="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center transition mb-6',
              isDragging ? 'border-lab-500 bg-lab-50 dark:bg-lab-900/20' : 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900/30'
            ]"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 bg-lab-100 dark:bg-lab-900/30 rounded-full flex items-center justify-center">
                <Upload class="text-lab-600 dark:text-lab-400" :size="24" />
              </div>
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">Tarik & Lepas Gambar</p>
                <p class="text-sm text-slate-500">Format: JPG, PNG (Maks. 5MB)</p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleFileInput"
              class="hidden"
              ref="fileInput"
            />
            <button
              @click="fileInput?.click()"
              class="mt-4 px-6 py-2 border border-lab-600 text-lab-600 dark:text-lab-400 dark:border-lab-400 rounded-lg font-medium hover:bg-lab-50 dark:hover:bg-lab-900/20 transition"
            >
              Pilih Berkas
            </button>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="(file, idx) in uploadedImages"
              :key="idx"
              class="relative bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden aspect-square group"
            >
              <img
                :src="file.preview"
                :alt="`Preview ${idx}`"
                class="w-full h-full object-cover"
              />
              <button
                @click="removeImage(idx)"
                class="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X :size="16" />
              </button>
            </div>

            <div
              @click="fileInput?.click()"
              class="bg-slate-100 dark:bg-slate-700 rounded-xl aspect-square flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition border-2 border-dashed border-slate-300 dark:border-slate-600"
            >
              <Plus class="text-slate-400" :size="32" />
            </div>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-6 pb-4 border-b border-slate-200 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
            Harga & Stok
          </h2>
          <div class="space-y-5">
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">
                Harga Jual (IDR) <span class="text-rose-500">*</span>
              </label>
              <div class="mt-1 flex items-center gap-2">
                <span class="text-slate-500 font-medium">Rp</span>
                <input
                  v-model="form.harga"
                  type="number"
                  placeholder="0"
                  min="0"
                  class="flex-1 rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
                />
              </div>
            </div>

            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">
                Stok Barang <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.stok"
                type="number"
                placeholder="0"
                min="0"
                class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-6 pb-4 border-b border-slate-200 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
            Kategori & Label
          </h2>
          <div class="space-y-5">
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">
                Kategori
              </label>
              <select
                v-model="form.kategori"
                class="mt-1 w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50 cursor-pointer"
              >
                <option value="">Pilih Kategori</option>
                <option value="cairan">Cairan Kimia</option>
                <option value="padatan">Padatan Kimia</option>
                <option value="alat">Alat Lab Sekali Pakai</option>
                <option value="gas">Gas</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">
                Label Produk (Tags)
              </label>
              <div class="flex flex-wrap gap-2 mb-3 mt-1">
                <span
                  v-for="(tag, idx) in form.tags"
                  :key="idx"
                  class="inline-flex items-center gap-2 bg-lab-100 dark:bg-lab-900/30 text-lab-800 dark:text-lab-300 px-3 py-1 rounded-full text-sm"
                >
                  {{ tag }}
                  <button @click="removeTag(idx)" class="hover:text-lab-900 dark:hover:text-lab-200 font-semibold">&times;</button>
                </span>
              </div>
              <input
                v-model="tagInput"
                @keydown.enter="addTag"
                type="text"
                placeholder="Ketik label dan tekan Enter"
                class="w-full rounded-lg sm:rounded-xl border border-slate-200 py-2 sm:py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { shopApi } from '@/api/shop'
import { useAuthStore } from '@/stores/auth'
import { Upload, X, Plus, Loader2, Check } from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'

interface ImageFile {
  preview: string
  file: File
}

interface ShopForm {
  namaProduk: string
  deskripsi: string
  harga: number | null
  stok: number | null
  kategori: string
  tags: string[]
}

const router = useRouter()
const auth = useAuthStore()
const saving = ref(false)
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const tagInput = ref('')
const uploadedImages = ref<ImageFile[]>([])

const form = ref<ShopForm>({
  namaProduk: '',
  deskripsi: '',
  harga: null,
  stok: null,
  kategori: '',
  tags: ['Baru'],
})

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'shop_unsigned')
  const res = await fetch('https://api.cloudinary.com/v1_1/dkdtd1om1/image/upload', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Gagal upload gambar ke Cloudinary')
  const data = await res.json()
  return data.secure_url
}

async function handleSave() {
  if (!form.value.namaProduk || form.value.harga === null || form.value.stok === null) {
    alert('Mohon isi nama produk, harga, dan stok')
    return
  }

  if (form.value.harga <= 0) {
    alert('Harga harus lebih dari 0')
    return
  }

  saving.value = true
  try {
    let gambarUrl: string | undefined
    if (uploadedImages.value.length > 0) {
      gambarUrl = await uploadToCloudinary(uploadedImages.value[0].file)
    }

    const payload = {
      namaProduk: form.value.namaProduk,
      deskripsi: form.value.deskripsi || undefined,
      harga: form.value.harga,
      stok: form.value.stok,
      gambarUrl,
      kategori: form.value.kategori || undefined,
      tags: form.value.tags.length > 0 ? form.value.tags.join(',') : undefined,
    }

    await shopApi.create(payload)
    alert('Produk shop berhasil dipublikasikan!')
    router.push('/shop')
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Gagal menyimpan produk')
  } finally {
    saving.value = false
  }
}

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) processFiles(Array.from(files))
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) processFiles(Array.from(files))
}

const processFiles = (files: File[]) => {
  files.forEach((file) => {
    if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedImages.value.push({
          preview: e.target?.result as string,
          file,
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const addTag = () => {
  if (tagInput.value.trim() && !form.value.tags.includes(tagInput.value.trim())) {
    form.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

const resetForm = () => {
  form.value = {
    namaProduk: '',
    deskripsi: '',
    harga: null,
    stok: null,
    kategori: '',
    tags: ['Baru'],
  }
  uploadedImages.value = []
  tagInput.value = ''
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
