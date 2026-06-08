# 🎨 Sistem Inventaris Laboratorium - Frontend Web

UI/UX web application untuk sistem manajemen inventaris laboratorium. Dibangun dengan Vue 3, TypeScript, dan Tailwind CSS.

## 📋 Daftar Isi
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Struktur Project](#struktur-project)
- [Pages & Routes](#pages--routes)
- [Komponenten Utama](#komponenten-utama)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

---

## ✨ Fitur

### 🔐 Authentication
- ✅ Login dengan email & password
- ✅ Register user baru
- ✅ JWT token management
- ✅ Auto logout saat token expired
- ✅ Persistent login state

### 📚 Dashboard
- 📊 Statistik barang & peminjaman
- 📈 Overview inventaris
- 🔄 Status peminjaman real-time

### 📦 Manajemen Barang
- ➕ Tambah barang dengan form validation
- 📝 Edit informasi barang
- 🗑️ Hapus barang (dengan konfirmasi)
- 🔍 Cari & filter barang
- 📊 Lihat stok tersedia
- 📂 Filter berdasarkan kategori

### 📋 Manajemen Kategori
- ➕ Tambah kategori baru
- 📝 Edit kategori
- 🗑️ Hapus kategori
- 📊 Daftar kategori

### 📌 Manajemen Peminjaman
- 📋 Buat request peminjaman
- ✅ View daftar peminjaman
- 📖 Detail peminjaman lengkap
- ✅ Persetujuan peminjaman (Petugas/Admin)
- ❌ Penolakan peminjaman
- 📦 Pengembalian barang dengan tracking kondisi

### 👥 Manajemen User (Admin)
- 👤 Daftar user
- 📊 View user details
- 🗑️ Hapus user

### 🎨 User Experience
- 🌓 Dark/Light theme toggle
- 📱 Responsive design (mobile, tablet, desktop)
- ⚡ Fast loading dengan code splitting
- 🔔 Toast notifications
- 💫 Smooth animations

---

## 🛠️ Teknologi

| Komponen | Versi | Deskripsi |
|----------|-------|----------|
| **Vue** | 3.5.34 | Progressive framework |
| **TypeScript** | 6.0 | Type safety |
| **Vite** | 8.0 | Build tool & dev server |
| **Vue Router** | 5.0 | Client-side routing |
| **Pinia** | 3.0 | State management |
| **Axios** | 1.16 | HTTP client |
| **Tailwind CSS** | 4.3 | Utility-first CSS |
| **Lucide Vue** | 1.16 | Icon library |
| **VueUse** | 14.3 | Composable utilities |
| **Node.js** | 18+ | Runtime |
| **npm** | 10+ | Package manager |

---

## 📦 Prasyarat

Pastikan sudah install:

- **Node.js 18+**
  ```bash
  node --version
  # Output: v18.x.x atau lebih tinggi
  ```

- **npm 10+**
  ```bash
  npm --version
  # Output: 10.x.x atau lebih tinggi
  ```

- **Backend API Running**
  - URL: `http://localhost:4000`
  - Sudah setup sesuai README backend

---

## 🚀 Instalasi

### 1. Clone Repository
```bash
cd /home/youtta/Projects/01
ls -la
# Anda sudah memiliki folder: frontend-baru
```

### 2. Install Dependencies
```bash
cd frontend-baru
npm install
```

Expected output:
```
added 144 packages, and audited 145 packages
found 0 vulnerabilities
```

### 3. Setup Environment (Optional)

Buat file `.env.local` (jika perlu override konfigurasi):
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=Inventori Lab
```

---

## 👨‍💻 Development

### Start Dev Server
```bash
npm run dev
```

Output:
```
  VITE v8.0.12  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Buka `http://localhost:5173/` di browser

### Features saat Development
- ✅ Hot Module Replacement (HMR) - auto refresh
- ✅ Type checking dengan TypeScript
- ✅ Tailwind CSS development
- ✅ Vue DevTools support

### Testing (Optional)
```bash
# Jika ada test file (.test.ts / .spec.ts)
npm run test

# With coverage
npm run test:coverage
```

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

Output:
```
✓ 1234 modules transformed.
dist/index.html                    0.48 kB │ gzip:   0.32 kB
dist/assets/index-D944lot0.js    159.48 kB │ gzip:  61.38 kB
dist/assets/style-ABC123.css      15.25 kB │ gzip:   3.28 kB

✓ built in 617ms
```

### Preview Production Build
```bash
npm run preview
```

Buka `http://localhost:4173/` untuk preview

### Deploy ke Production

**Option 1: Serve dengan Node.js/Express**
```bash
# Build terlebih dahulu
npm run build

# Copy dist folder ke server
scp -r dist/* user@server:/var/www/html/
```

**Option 2: Docker**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Option 3: Vercel/Netlify (Recommended)**
- Push ke GitHub
- Connect dengan Vercel/Netlify
- Auto deploy setiap push

---

## 📂 Struktur Project

```
frontend-baru/
├── src/
│   ├── assets/                  # Static assets
│   │   └── styles/
│   │       └── globals.css      # Global styles
│   │
│   ├── components/              # Reusable Vue components
│   │   ├── common/
│   │   │   ├── DataTable.vue    # Generic table component
│   │   │   ├── Modal.vue        # Modal dialog
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── EmptyState.vue
│   │   │   └── PageHeader.vue
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.vue    # Main layout wrapper
│   │   │
│   │   └── features/            # Feature-specific components
│   │       ├── ThemeToggle.vue
│   │       └── StatusBadge.vue
│   │
│   ├── views/                   # Page components (routes)
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── DashboardView.vue
│   │   ├── BarangView.vue
│   │   ├── KategoriView.vue
│   │   ├── PeminjamanView.vue
│   │   ├── PeminjamanDetailView.vue
│   │   ├── DetailPeminjamanView.vue
│   │   └── UsersView.vue
│   │
│   ├── router/
│   │   └── index.ts             # Route configuration
│   │
│   ├── stores/                  # Pinia stores (state management)
│   │   ├── auth.ts              # Auth state
│   │   └── general.ts           # General app state
│   │
│   ├── services/                # API services
│   │   ├── api.ts               # Axios instance
│   │   ├── auth.ts              # Auth API calls
│   │   ├── barang.ts            # Barang API calls
│   │   ├── kategori.ts          # Kategori API calls
│   │   ├── peminjaman.ts        # Peminjaman API calls
│   │   ├── laporan.ts           # Laporan API calls
│   │   └── users.ts             # Users API calls
│   │
│   ├── utils/                   # Utility functions
│   │   ├── constants.ts         # App constants
│   │   ├── format.ts            # Format utilities
│   │   └── helpers.ts           # Helper functions
│   │
│   ├── types/                   # TypeScript types
│   │   ├── index.ts
│   │   └── api.ts
│   │
│   ├── composables/             # Vue composables
│   │   ├── useAutoRefresh.ts
│   │   └── useForm.ts
│   │
│   ├── App.vue                  # Root component
│   └── main.ts                  # Entry point
│
├── public/                      # Static files (favicon, etc)
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tsconfig.app.json           # App-specific TS config
├── tailwind.config.ts          # Tailwind CSS config
├── package.json                # Dependencies
├── package-lock.json           # Locked versions
└── README.md                   # This file
```

---

## 🛣️ Pages & Routes

| Path | Component | Role | Deskripsi |
|------|-----------|------|-----------|
| `/login` | LoginView | Public | Login page |
| `/register` | RegisterView | Public | Register page |
| `/dashboard` | DashboardView | Auth | Dashboard overview |
| `/barang` | BarangView | Auth | Manajemen barang |
| `/kategori` | KategoriView | Auth | Manajemen kategori |
| `/peminjaman` | PeminjamanView | Auth | Daftar peminjaman |
| `/peminjaman/:id` | PeminjamanDetailView | Auth | Detail peminjaman |
| `/detail-peminjaman/:id` | DetailPeminjamanView | Auth | Return items page |
| `/users` | UsersView | Admin | Manajemen user |
| `*` | 404 | Public | Not found |

---

## 🧩 Komponenten Utama

### DataTable Component
```vue
<DataTable 
  :columns="columns"
  :data="items"
  :loading="loading"
  @row-click="onRowClick"
  @delete="onDelete"
/>
```

### Modal Component
```vue
<Modal 
  :open="isOpen"
  title="Edit Barang"
  @close="isOpen = false"
>
  <!-- Form content -->
</Modal>
```

### PageHeader Component
```vue
<PageHeader 
  title="Manajemen Barang"
  subtitle="Kelola inventaris barang laboratorium"
  :show-create-btn="true"
  @create-new="openModal"
/>
```

---

## 🏪 State Management

### Auth Store (Pinia)
```typescript
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  }),
  
  actions: {
    async login(email: string, password: string) { },
    async register(userData: RegisterData) { },
    logout() { },
  },
});
```

**Penggunaan:**
```vue
<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// In template
{{ authStore.user?.nama }}
</script>
```

---

## 🔌 API Integration

### Axios Instance
File: `src/services/api.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Auto add token to requests
api.interceptors.request.use(config => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});
```

### API Service Example
```typescript
// src/services/barang.ts
export const barangService = {
  async getAll(page = 1, size = 10) {
    const response = await api.get('/barang', {
      params: { page, size }
    });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/barang/${id}`);
    return response.data;
  },

  async create(data: BarangRequest) {
    const response = await api.post('/barang', data);
    return response.data;
  },
};
```

### Menggunakan API Service
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { barangService } from '@/services/barang';

const barangList = ref([]);
const loading = ref(false);

const fetchBarang = async () => {
  loading.value = true;
  try {
    const data = await barangService.getAll();
    barangList.value = data.content;
  } catch (error) {
    console.error('Gagal fetch barang:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchBarang());
</script>
```

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot find module '@/...'"
**Solusi:**
- Pastikan `tsconfig.json` memiliki path alias
- Restart dev server: `npm run dev`

### ❌ Port 5173 sudah digunakan
**Solusi:**
```bash
# Kill process di port 5173
lsof -i :5173
kill -9 <PID>

# Atau jalankan di port lain
npm run dev -- --port 5174
```

### ❌ API request gagal / CORS error
**Solusi:**
- Pastikan backend running di `http://localhost:4000`
- Cek `.env.local` untuk VITE_API_BASE_URL
- Backend harus enable CORS

### ❌ Styling tidak muncul (Tailwind)
**Solusi:**
```bash
# Rebuild Tailwind
npm run build

# Atau restart dev server
npm run dev
```

### ❌ Token expired tapi tidak auto logout
**Solusi:**
- Cek interceptor di `src/services/api.ts`
- Pastikan handler 401 trigger logout
- Clear localStorage: `localStorage.clear()`

---

## 📖 Development Guide

### Membuat Page Baru

1. **Buat Component**
   ```vue
   <!-- src/views/NewFeatureView.vue -->
   <template>
     <div class="page">
       <PageHeader title="New Feature" />
       <!-- Content -->
     </div>
   </template>

   <script setup lang="ts">
   // Logic here
   </script>
   ```

2. **Add Route**
   ```typescript
   // src/router/index.ts
   {
     path: '/new-feature',
     component: () => import('@/views/NewFeatureView.vue'),
     meta: { requiresAuth: true }
   }
   ```

3. **Create API Service**
   ```typescript
   // src/services/newFeature.ts
   export const newFeatureService = {
     async getAll() { },
     async create(data) { },
   };
   ```

### Styling dengan Tailwind

```vue
<template>
  <!-- Utility classes -->
  <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
    <h1 class="text-2xl font-bold text-gray-900">Title</h1>
    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Action
    </button>
  </div>
</template>
```

### Type Safety

```typescript
// src/types/api.ts
export interface Barang {
  id: number;
  namaBarang: string;
  kodeBarang: string;
  jumlahTotal: number;
  jumlahTersedia: number;
  harga: number;
  kategori: Kategori;
}

// Using types in components
const barang = ref<Barang | null>(null);
```

---

## 📊 Performance Tips

- ✅ Use code splitting dengan dynamic imports: `() => import('@/views/...')`
- ✅ Lazy load images: `<img loading="lazy" />`
- ✅ Use composables untuk share logic
- ✅ Minimize re-renders dengan proper reactivity
- ✅ Use Lighthouse untuk audit: `npm run build && npm run preview`

---

## 📝 License

Proprietary - Sistem Inventaris Laboratorium

---

## 👥 Support

Untuk pertanyaan atau issue, hubungi tim development.

---

**Last Updated:** 31 Mei 2024  
**Status:** ✅ Production Ready  
**Node Version:** 18+  
**Package Manager:** npm 10+
