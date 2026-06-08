# Deploy Frontend ke Vercel

## Prerequisites
- Akun [Vercel](https://vercel.com)
- GitHub repository frontend sudah di-push

## Langkah Deployment

### 1. Push Frontend ke GitHub
```bash
cd frontend-baru
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/frontend-repo.git
git push -u origin main
```

### 2. Deploy di Vercel
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **Add New** → **Project**
3. Import repository frontend dari GitHub
4. Framework akan auto-detect: **Vite**
5. Set **Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://<backend>.railway.app/api` |
| `VITE_FIREBASE_API_KEY` | (opsional, jika pakai Firebase) |

6. Klik **Deploy**

### 3. Build Settings (auto-detect)
Vercel akan otomatis menggunakan konfigurasi dari `vercel.json`:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `vite build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 4. SPA Routing
File `vercel.json` sudah termasuk rewrite rules untuk SPA:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Ini memastikan Vue Router bisa handle routing langsung (tidak 404).

---

## Struktur File untuk Vercel

| File | Fungsi |
|------|--------|
| `vercel.json` | Konfigurasi build & routing SPA |
| `.env` | Environment variables (tidak di-commit) |

> **Catatan:** `.env` ada di `.gitignore`, jadi harus di-set manual di Vercel dashboard.

---

## Environment Variables

| Variable | Required | Keterangan |
|----------|----------|------------|
| `VITE_API_BASE_URL` | **Ya** | URL backend Railway + `/api` |
| `VITE_FIREBASE_API_KEY` | Opsional | Untuk fitur Google/Phone auth |

---

## Update CORS Backend

Setelah deploy, update CORS di backend (`SecurityConfig.java`):
```java
config.setAllowedOrigins(Arrays.asList(
    "https://<frontend>.vercel.app",
    "http://localhost:5173"
));
```

---

## Testing

```bash
# Buka URL Vercel
open https://<project>.vercel.app

# Login dengan akun test
Email: test@test.com
Password: password123
```

---

## Troubleshooting

### Error: 404 on page refresh
Pastikan `vercel.json` punya rewrite rules untuk SPA routing.

### Error: CORS
Update allowed origins di backend `SecurityConfig.java` dengan URL Vercel.

### Error: API not responding
Check `VITE_API_BASE_URL` di Vercel environment variables — pastikan指向 URL Railway yang benar.
