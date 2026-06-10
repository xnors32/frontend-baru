<template>
  <div class="min-h-screen bg-gray-50">
    <div class="border-b border-gray-200 bg-white px-6 py-4">
      <div class="max-w-7xl mx-auto">
        <p class="text-sm text-gray-600 mb-2">Shop / Tambah Produk Baru</p>
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">Upload Produk Shop</h1>
          <div class="flex gap-3">
            <button
              @click="resetForm"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              @click="handleSave"
              :disabled="saving"
              class="px-6 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
              Simpan Produk
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <section class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Informasi Produk
            </h2>
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Produk <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.namaProduk"
                  type="text"
                  placeholder="Contoh: Larutan NaCl 0.9%"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Produk
                </label>
                <textarea
                  v-model="form.deskripsi"
                  placeholder="Jelaskan detail produk bahan lab di sini..."
                  rows="5"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Media Produk
            </h2>

            <div
              @drop="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              :class="[
                'border-2 border-dashed rounded-lg p-8 text-center transition mb-6',
                isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50'
              ]"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Upload class="text-teal-600" :size="24" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Tarik & Lepas Gambar</p>
                  <p class="text-sm text-gray-600">Format: JPG, PNG (Maks. 5MB)</p>
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
                class="mt-4 px-6 py-2 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition"
              >
                Pilih Berkas
              </button>
            </div>

            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="(file, idx) in uploadedImages"
                :key="idx"
                class="relative bg-gray-100 rounded-lg overflow-hidden aspect-square group"
              >
                <img
                  :src="file.preview"
                  :alt="`Preview ${idx}`"
                  class="w-full h-full object-cover"
                />
                <button
                  @click="removeImage(idx)"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X :size="16" />
                </button>
              </div>

              <div
                @click="fileInput?.click()"
                class="bg-gray-100 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-300"
              >
                <Plus class="text-gray-400" :size="32" />
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-8">
          <section class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Harga & Stok
            </h2>
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Harga Jual (IDR) <span class="text-red-500">*</span>
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-gray-600 font-medium">Rp</span>
                  <input
                    v-model="form.harga"
                    type="number"
                    placeholder="0"
                    min="0"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Stok Barang <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.stok"
                  type="number"
                  placeholder="0"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </section>

          <section class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Kategori & Label
            </h2>
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  v-model="form.kategori"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white cursor-pointer"
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
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Label Produk (Tags)
                </label>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="(tag, idx) in form.tags"
                    :key="idx"
                    class="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                  >
                    {{ tag }}
                    <button @click="removeTag(idx)" class="hover:text-teal-900 font-semibold">&times;</button>
                  </span>
                </div>
                <input
                  v-model="tagInput"
                  @keydown.enter="addTag"
                  type="text"
                  placeholder="Ketik label dan tekan Enter"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          @click="resetForm"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Batal
        </button>
        <button
          @click="handleSave"
          :disabled="saving"
          class="px-6 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Check v-if="!saving" :size="18" />
          <Loader2 v-else class="h-4 w-4 animate-spin" />
          {{ saving ? 'Menyimpan...' : 'Simpan & Terbitkan' }}
        </button>
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
