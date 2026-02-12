# 🚀 PANDUAN DEPLOY VERCEL SERVERLESS

## 📁 Struktur File Baru

Setelah konversi, struktur project Anda akan jadi:

```
backend/                     ← ROOT project di Vercel
├── api/                     ← FOLDER BARU
│   ├── admin/
│   │   ├── index.js        ← Handle semua /api/admin/* endpoints
│   │   └── login.js        ← Handle /api/admin/login
│   └── index.js            ← Handle public API (home, kegiatan, dll)
├── lib/                     ← FOLDER BARU
│   └── firebase.js         ← Helper Firebase & Auth
├── public/                  ← Frontend (sudah ada, jangan diubah)
│   └── admin/
│       ├── index.html      ← Login page
│       └── dashboard.html  ← Admin dashboard
├── vercel.json             ← REPLACE yang lama!
├── package.json            ← Update dependencies
└── encode-firebase-key.js  ← Script helper (optional)
```

**PENTING:** Folder `backend/` adalah root project Anda di Vercel!

---

## 🔐 LANGKAH 0: ENCODE FIREBASE KEY (PENTING!)

Sebelum deploy, Anda harus encode Firebase private key ke base64.

### Option A: Pakai Script yang Saya Sediakan

```bash
# Di folder backend/
node encode-firebase-key.js
```

Script akan output semua environment variables yang perlu di-copy. **SIMPAN OUTPUT INI!**

### Option B: Manual

```bash
# Baca private key dari firebase-key.json, lalu encode
node -e "console.log(Buffer.from(require('./firebase-key.json').private_key).toString('base64'))"
```

---

## 🔧 LANGKAH 1: UPDATE FILE PROJECT

### 1️⃣ Hapus/Rename File Lama

**Di folder `backend/` Anda:**

```bash
# Backup server.js lama (optional)
rename server.js → server-express-backup.js

# Hapus vercel.json lama di root
delete vercel.json
```

### 2️⃣ Copy File Baru

**Copy semua file yang saya buatkan:**

```
backend/
├── api/                    ← FOLDER BARU (copy dari saya)
│   ├── admin/
│   │   ├── index.js
│   │   └── login.js
│   └── index.js
├── lib/                    ← FOLDER BARU (copy dari saya)
│   └── firebase.js
├── public/                 ← SUDAH ADA (jangan diubah)
└── vercel.json            ← FILE BARU (replace yang lama)
```

### 3️⃣ Update package.json

**Edit file `backend/package.json`:**

```json
{
  "name": "hima-akuntansi-backend",
  "version": "2.0.0",
  "description": "Backend API for HIMA AKUNTANSI UT BANDUNG",
  "main": "api/index.js",
  "scripts": {
    "encode-key": "node encode-firebase-key.js"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Yang DIHAPUS (tidak perlu lagi):**
- ❌ `express` (diganti serverless functions)
- ❌ `cors` (sudah handle manual)
- ❌ `dotenv` (pakai Vercel env vars)

**Yang TETAP ADA:**
- ✅ `firebase-admin` (masih dipakai)

---

## 🚀 LANGKAH 2: DEPLOY KE VERCEL

### Option A: Deploy via Website (RECOMMENDED - Paling Mudah!)

1. **Pastikan semua file sudah di GitHub:**
   ```bash
   cd backend/
   git add .
   git commit -m "Convert to Vercel serverless"
   git push origin main
   ```

2. **Login ke Vercel:**
   - Buka https://vercel.com
   - Login with GitHub

3. **Import Project:**
   - Klik **"Add New"** → **"Project"**
   - Pilih repository **Hima-Akuntansi-UT-Bandung**
   
4. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend` ← PENTING! Pilih folder backend
   - **Build Command:** (kosongkan)
   - **Output Directory:** (kosongkan)
   - **Install Command:** `npm install`
   
5. **Deploy!**
   - Klik **"Deploy"**
   - Tunggu build selesai (~2 menit)
   - ⚠️ **Build akan GAGAL dulu** karena belum ada env vars - ini NORMAL!

### Option B: Deploy via CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy dari folder backend/
cd backend/
vercel

# 4. Jawab pertanyaan:
# - Link to existing project? N
# - Project name? [enter]
# - Directory? ./ [enter]
# - Override settings? N

# 5. Deploy production
vercel --prod
```

---

## ⚙️ LANGKAH 3: SET ENVIRONMENT VARIABLES

**Di Vercel Dashboard:**

1. Buka project → **Settings** → **Environment Variables**
2. Tambahkan **SATU PER SATU** variable berikut:

### Dari Output `encode-firebase-key.js`:

```bash
# 1. PROJECT ID
FIREBASE_PROJECT_ID
hima-akuntansi-ut-bandung

# 2. PRIVATE KEY (BASE64) - Output dari script encode-firebase-key.js
FIREBASE_PRIVATE_KEY_BASE64
LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...  ← COPY dari output script

# 3. PRIVATE KEY ID
FIREBASE_PRIVATE_KEY_ID
72c2631409d00e2bdd993b9955edea3c2569a3d5

# 4. CLIENT EMAIL
FIREBASE_CLIENT_EMAIL
firebase-adminsdk-fbsvc@hima-akuntansi-ut-bandung.iam.gserviceaccount.com

# 5. CLIENT ID
FIREBASE_CLIENT_ID
100609655137016268502

# 6. CERT URL
FIREBASE_CERT_URL
https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40hima-akuntansi-ut-bandung.iam.gserviceaccount.com
```

### Cara Input di Vercel:

1. Klik **"Add New"**
2. **Name:** `FIREBASE_PROJECT_ID`
3. **Value:** `hima-akuntansi-ut-bandung`
4. **Environment:** Centang **Production**, **Preview**, **Development**
5. Klik **Save**
6. Ulangi untuk semua 6 variables

### ⚠️ PENTING:

- **JANGAN copy-paste langsung** nilai `FIREBASE_PRIVATE_KEY_BASE64` dari sini!
- **HARUS pakai output** dari script `encode-firebase-key.js` Anda
- Setiap env var harus dicentang untuk **Production** agar berfungsi

---

## 🔄 LANGKAH 4: REDEPLOY

Setelah semua env vars ditambahkan:

1. Klik tab **"Deployments"**
2. Klik **titik tiga (...)** di deployment terakhir
3. Klik **"Redeploy"**
4. Tunggu ~2 menit
5. ✅ **BUILD SHOULD SUCCESS!**

---

## 🧪 LANGKAH 5: TESTING

Setelah deploy selesai, Vercel kasih URL Production (misal: `https://hima-akuntansi-ut-bandung.vercel.app`)

### Test di Browser:

1. **Buka Homepage:**
   ```
   https://hima-akuntansi-ut-bandung.vercel.app
   ```
   Seharusnya tampil frontend dari folder `public/`

2. **Test Admin Login:**
   ```
   https://hima-akuntansi-ut-bandung.vercel.app/admin/index.html
   ```
   - Username: `admin`
   - Password: `admin123`
   - Klik Login
   - ✅ Seharusnya redirect ke dashboard!

3. **Test Public API:**
   Buka di browser atau Postman:
   ```
   GET https://hima-akuntansi-ut-bandung.vercel.app/api/home
   GET https://hima-akuntansi-ut-bandung.vercel.app/api/kegiatan
   GET https://hima-akuntansi-ut-bandung.vercel.app/api/struktur
   GET https://hima-akuntansi-ut-bandung.vercel.app/api/kontak
   ```

### Test Manual API (Postman/Thunder Client):

```bash
# Login
POST https://hima-akuntansi-ut-bandung.vercel.app/api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Response:
{
  "status": "success",
  "token": "YWRtaW46YWRtaW4xMjM=",
  "user": {
    "name": "Administrator",
    "role": "super_admin"
  }
}
```

### ✅ Jika Semua Test Berhasil:

**SELAMAT! Deploy berhasil!** 🎉

Frontend Anda sudah auto-detect API URL dari `window.location.origin`, jadi tidak perlu update URL lagi!

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module 'firebase-admin'"

**Solusi:**
```bash
cd backend/
npm install firebase-admin --save
vercel --prod
```

### Error: "FIREBASE_PRIVATE_KEY not found"

**Solusi:**
- Cek Environment Variables di Vercel dashboard
- Pastikan semua Firebase credentials sudah ditambahkan
- Redeploy setelah tambah env vars

### Error: 404 Not Found pada /api/admin/login

**Solusi:**
- Cek `vercel.json` sudah di-upload
- Pastikan struktur folder `api/` sudah benar
- Redeploy ulang

### Error: Cold Start Lambat (30-60 detik)

**Ini NORMAL** untuk Vercel serverless free tier!
- Request pertama setelah idle akan lambat
- Request berikutnya akan cepat
- Tidak ada solusi untuk free tier

---

## 📝 CATATAN PENTING

### Perbedaan dengan Express Server:

| Feature | Express (server.js) | Vercel Serverless |
|---------|-------------------|------------------|
| Always Running | ✅ Ya | ❌ Tidak (on-demand) |
| Cold Start | ❌ Tidak ada | ✅ Ada (~30 detik) |
| Cost | Butuh hosting berbayar | ✅ Gratis |
| Credit Card | Butuh di platform lain | ❌ Tidak perlu |
| File Upload | ✅ Support | ⚠️ Terbatas (10MB max) |

### Limitasi Vercel Free Tier:

- ⚠️ Cold start setelah tidak ada traffic
- ⚠️ 10 second timeout per function
- ⚠️ 100GB bandwidth/bulan
- ⚠️ 100 deployments/hari
- ✅ Unlimited requests (dengan cold start)

---

## ✅ CHECKLIST DEPLOY

- [ ] Copy folder `api/` ke project
- [ ] Copy folder `lib/` ke project
- [ ] Replace `vercel.json`
- [ ] Install dependencies (`npm install firebase-admin`)
- [ ] Push ke GitHub / Deploy via CLI
- [ ] Set Environment Variables di Vercel
- [ ] Redeploy setelah set env vars
- [ ] Test endpoint `/api/home`
- [ ] Test endpoint `/api/admin/login`
- [ ] Test admin panel di browser
- [ ] ✅ **DONE!**

---

## 🎉 SELAMAT!

Project Anda sekarang running di Vercel serverless!

**URL Production:** `https://hima-akuntansi-ut-bandung.vercel.app`

**Catatan:**
- Frontend otomatis ter-serve dari folder `public/`
- API endpoints available di `/api/*`
- Gratis selamanya (no credit card!)
- Auto-deploy setiap kali push ke GitHub

**Ada masalah? Chat saya lagi!** 😊
