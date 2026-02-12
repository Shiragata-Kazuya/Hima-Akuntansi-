# ✅ QUICK START CHECKLIST

## 📋 Persiapan (5 menit)

- [ ] Download semua file dari Claude
- [ ] Copy file ke folder `backend/` dengan struktur:
  ```
  backend/
  ├── api/              ← folder baru
  ├── lib/              ← folder baru  
  ├── vercel.json       ← replace yang lama
  ├── package.json      ← replace yang lama
  └── encode-firebase-key.js ← file baru
  ```

## 🔐 Encode Firebase Key (2 menit)

- [ ] Jalankan: `node encode-firebase-key.js`
- [ ] **COPY & SIMPAN** output semua environment variables
- [ ] Terutama value `FIREBASE_PRIVATE_KEY_BASE64` yang panjang

## 🚀 Deploy ke Vercel (5 menit)

- [ ] Push ke GitHub:
  ```bash
  git add .
  git commit -m "Convert to Vercel serverless"
  git push origin main
  ```

- [ ] Buka https://vercel.com
- [ ] Login with GitHub
- [ ] Import Project → Pilih repo Anda
- [ ] **Root Directory:** pilih `backend`
- [ ] Deploy (akan GAGAL dulu - ini normal!)

## ⚙️ Set Environment Variables (3 menit)

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

- [ ] `FIREBASE_PROJECT_ID` = `hima-akuntansi-ut-bandung`
- [ ] `FIREBASE_PRIVATE_KEY_BASE64` = `[value panjang dari encode script]`
- [ ] `FIREBASE_PRIVATE_KEY_ID` = `72c2631409d00e2bdd993b9955edea3c2569a3d5`
- [ ] `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@hima-akuntansi-ut-bandung.iam.gserviceaccount.com`
- [ ] `FIREBASE_CLIENT_ID` = `100609655137016268502`
- [ ] `FIREBASE_CERT_URL` = `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40hima-akuntansi-ut-bandung.iam.gserviceaccount.com`

**Centang Production, Preview, Development untuk semua!**

## 🔄 Redeploy (2 menit)

- [ ] Klik tab "Deployments"
- [ ] Klik titik tiga (...) → "Redeploy"
- [ ] Tunggu build selesai
- [ ] ✅ **BUILD SUCCESS!**

## 🧪 Testing (2 menit)

- [ ] Buka: `https://hima-akuntansi-ut-bandung.vercel.app`
- [ ] Test admin login: `/admin/index.html`
- [ ] Login dengan: `admin` / `admin123`
- [ ] ✅ **REDIRECT KE DASHBOARD = SUCCESS!**

---

## ⏱️ Total Waktu: ~20 menit

## 🆘 Troubleshooting Cepat

**Build gagal?**
→ Cek env vars sudah dicentang "Production"

**Login 404?**
→ Tunggu 1-2 menit, Vercel masih propagate

**Login error "Unauthorized"?**
→ Cek `FIREBASE_PRIVATE_KEY_BASE64` sudah benar

**Masih error?**
→ Baca DEPLOY-GUIDE.md lengkap atau chat Claude lagi!

---

**🎉 SELAMAT! Project Anda sekarang live di Vercel!**
