# 🐛 Promise Error Handling Guide

Panduan untuk mengatasi promise errors saat mengirim data dari frontend ke backend.

## 🎯 Common Promise Errors

### 1. **CORS Error**
```
❌ Access to XMLHttpRequest blocked by CORS policy
```
**Cause:** Backend tidak allow frontend origin  
**Solution:** ✅ Sudah fixed di backend SecurityConfig!

---

### 2. **Network Error**
```
❌ Tidak dapat terhubung ke server. Pastikan backend running di http://localhost:4000
```
**Causes:**
- Backend tidak running
- Port 4000 tidak accessible
- Firewall block

**Solution:**
```bash
# Terminal 1 - Check backend running
lsof -i :4000  # Should show Java process

# Terminal 2 - Start backend if not running
cd BE-Java-mvn-spring-boot
mvn spring-boot:run
```

---

### 3. **API Base URL Wrong**
```
❌ Network error (ERR_INVALID_URL atau similar)
```
**Cause:** Client API base URL tidak cocok dengan backend

**Solution:**  
File: `src/api/client.ts`
```typescript
// CORRECT (sudah di-set)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

// Check di browser console
console.log('API Base URL:', baseURL)
// Should print: http://localhost:4000/api
```

---

### 4. **401 Unauthorized / Token Expired**
```
❌ 401 - Unauthorized atau "Sesi Anda telah berakhir"
```
**Cause:** JWT token tidak valid atau sudah expired

**Solution:**
```typescript
// src/api/client.ts sudah handle ini
// Token akan di-send otomatis dari localStorage

// Jika token expired, user akan auto logout
// Lihat auth store untuk logic
```

---

### 5. **400 Bad Request / Validation Error**
```
❌ Validation error: "Barang dengan kode X sudah ada"
```
**Cause:** Data tidak valid atau duplicate

**Solution:**  
Check form sebelum submit:
```typescript
// Ensure all required fields filled
if (!form.value.namaBarang) {
  toast.show('Nama barang harus diisi', 'error')
  return
}
```

---

### 6. **500 Internal Server Error**
```
❌ 500 - Internal Server Error
```
**Cause:** Backend error (code bug, database error, etc)

**Solution:**
1. Check backend logs (di terminal where mvn spring-boot:run running)
2. Check database connection
3. Restart backend

---

## 🔍 How to Debug Promise Errors

### Check 1: Browser Console
```bash
# Open browser DevTools
F12 or Ctrl+Shift+I

# Go to Console tab
# Look for errors with 🔴 red icon

# Example error:
❌ Error: Tidak dapat terhubung ke server. Pastikan backend running di http://localhost:4000
```

### Check 2: Network Tab
```bash
# Open DevTools → Network tab
# Perform API call (login, create barang, etc)
# Check request/response:

# Green 200 = Success ✅
# Red 4xx = Client error ❌
# Red 5xx = Server error ❌
```

### Check 3: Backend Logs
```bash
# Terminal running backend (mvn spring-boot:run)
# Look for [ERROR] messages

Example:
2024-05-31 15:10:00 ERROR [...] Barang dengan kode MKS-001 sudah ada
```

### Check 4: API Response
```javascript
// In browser console
// Add this before API call:

const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('API Call:', args[0], args[1]);
  return originalFetch.apply(this, args)
    .then(res => {
      console.log('Response:', res.status, res.statusText);
      return res;
    });
};

// Or use Network tab (easier)
```

---

## 📝 Error Handling Best Practices

### In Components (Vue)
```vue
<script setup>
import { ref } from 'vue'
import { barangApi } from '@/api/barang'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const loading = ref(false)

async function save() {
  loading.value = true
  try {
    // Try API call
    await barangApi.create(form.value)
    toast.show('Barang ditambahkan', 'success')
  } catch (error) {
    // Catch error and show to user
    const message = error instanceof Error ? error.message : 'Gagal menyimpan'
    toast.show(message, 'error')
    
    // Log for debugging
    console.error('Save error:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

### Using API Helper
```typescript
import { formatErrorMessage, parseErrorForDisplay } from '@/utils/api-helper'

try {
  await barangApi.create(data)
} catch (error) {
  // Format error for better display
  const { title, message, type } = parseErrorForDisplay(error)
  toast.show(message, type)
  
  // Or just format message
  const errorMsg = formatErrorMessage(error)
}
```

---

## ✅ Checklist untuk Troubleshooting

- [ ] Backend running (`mvn spring-boot:run` in Terminal)
- [ ] Backend listening on `http://localhost:4000`
- [ ] Frontend base URL set to `http://localhost:4000/api`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Browser console shows no CORS errors
- [ ] Check Network tab for response code
- [ ] Check backend logs for detailed error
- [ ] JWT token valid (not expired)
- [ ] Form data valid (required fields filled)
- [ ] Database reachable

---

## 🚀 Quick Test

### Test API Connection
```javascript
// In browser console (http://localhost:5173)

// Test 1: Simple fetch
fetch('http://localhost:4000/api/auth/register')
  .then(r => r.json())
  .then(d => console.log('✅ API OK:', d))
  .catch(e => console.error('❌ API Error:', e))

// Test 2: With auth
const token = localStorage.getItem('labvault-token')
fetch('http://localhost:4000/api/barang', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ Auth OK:', d))
  .catch(e => console.error('❌ Auth Error:', e))
```

---

## 📋 Files Updated

### Files yang sudah diupdate untuk better error handling:

1. **src/api/client.ts** ✅
   - Better error messages
   - Handle different error types
   - Console logging

2. **src/types/api.ts** ✅
   - Added ErrorResponse type
   - Better documented interfaces

3. **src/utils/api-helper.ts** ✅ (NEW)
   - Logging utilities
   - Error formatting functions
   - Error type detection

---

## 📞 Still Having Issues?

1. **Check CORS Guide:** [Backend CORS_QUICK_START.md](../BE-Java-mvn-spring-boot/CORS_QUICK_START.md)

2. **Check API Response Format:** [Backend README](../BE-Java-mvn-spring-boot/README.md)

3. **Check Terminal Logs:**
   ```bash
   # Backend logs
   cd BE-Java-mvn-spring-boot
   mvn spring-boot:run | grep -E "ERROR|Exception"
   ```

4. **Clear Cache & Restart:**
   ```bash
   # Frontend
   rm -rf node_modules/.vite
   npm run dev
   
   # Backend
   mvn clean spring-boot:run
   ```

---

**Status:** ✅ Error handling improved  
**Last Updated:** 31 Mei 2024
