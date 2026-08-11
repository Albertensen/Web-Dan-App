# 🚀 Panduan Setup TeknoHub & Obsidian di PC Baru

> **Repo**: `https://github.com/Albertensen/Web-Dan-App` — project root = `teknohub/` di dalam repo.
> Dokumen ini disiapkan 2026-08-11 sebagai persiapan pindah PC. Backup lengkap vault Obsidian tersedia di `docs/obsidian-vault/`.

---

## 1. Install Software Wajib di PC Baru

### Node.js (v18+)
- Download & install dari https://nodejs.org (LTS version)
- Cek installer: `node -v && npm -v`

### Git
- Download & install dari https://git-scm.com
- Identity setup:
  ```
  git config --global user.name "Nama Kamu"
  git config --global user.email "email@kamu.com"
  ```

### Ollama (AI Agent Lokal)
- Download & install dari https://ollama.com
- Pull model yang digunakan:
  ```
  ollama pull gemma4:e4b
  ```
- Jalankan service: `ollama serve` (berjalan di localhost:11434)
- Catatan: jika GPU VRAM < 8GB, model bisa dijalankan dengan offload CPU.

### Obsidian (Second Brain Notes)
- Download & install gratis dari https://obsidian.md

---

## 2. Clone Project & Install Dependencies

```
git clone https://github.com/Albertensen/Web-Dan-App.git
cd Web-Dan-App/teknohub/apps/web
npm install
```

---

## 3. Setup Environment Variables (.env.local)

Buat file `apps/web/.env.local` dan isi nilainya (sesuai Supabase Dashboard & Google Cloud Console):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=isi-dengan-string-random-32-karakter
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:e4b
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TeknoZone
```

Generate NEXTAUTH_SECRET baru di terminal:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ `.env.local` TIDAK di-commit ke git (ada di .gitignore). Isi manual di PC baru dari Supabase Dashboard & Google Cloud Console. Jangan pernah commit file ini.

---

## 4. Open Obsidian Vault di PC Baru

1. Buka aplikasi Obsidian.
2. Klik **"Open folder as vault"**.
3. Pilih folder yang di-clone tadi: `Web-Dan-App/teknohub/docs/obsidian-vault/`.
4. Seluruh catatan arsitektur, DESIGN-RULES.md, dan pilar prompt Hermes/Gemma/Ruflo langsung aktif dan siap dibaca!

---

## 5. Setup Database (Supabase) di PC Baru

DB schema & seed tersimpan di `supabase/migrations/` (001–010b). Jika project Supabase baru:

1. Buat project baru di https://supabase.com
2. Jalankan semua migration berurutan di SQL Editor:
   - `001_initial_schema.sql` → `010b_seed_reviews.sql`
3. **Auth user TIDAK boleh di-insert via SQL langsung** — GoTrue tidak mengenalinya. Buat user via admin client (service role): `supabase.auth.admin.createUser(...)` (lihat catatan sesi / seed script).
4. RLS diaktifkan di migration — pastikan tidak ada error saat jalan.

Jika pakai project Supabase lama: cukup isi URL + key di `.env.local`, schema sudah ada.

---

## 6. Jalankan Development Server

```
cd Web-Dan-App/teknohub/apps/web
npm run dev
```

Buka di browser: http://localhost:3000

Checklist Verifikasi:
- [ ] http://localhost:3000 → Homepage tampil (marketplace grid + slide tabs)
- [ ] http://localhost:3000/login → Login page tampil
- [ ] http://localhost:3000/products → Catalog & detail produk jalan (no 404)
- [ ] http://localhost:3000/builder → PC Builder 3D & AI Chat sync jalan
- [ ] http://localhost:3000/forum → Forum komunitas tampil

> Route aktual di repo: `/shop/products`, `/builder` (lihat `apps/web/src/app/(main)/`). Jika `/products` 404, gunakan `/shop/products`.

---

## 7. Build Production (Verifikasi Zero Error)

```
cd Web-Dan-App/teknohub/apps/web
npm run build
```

Harus selesai tanpa error sebelum deploy.

---

## 8. Lanjutkan Pekerjaan dengan Hermes Agent di PC Baru

Setelah dev server berjalan di PC baru, buka Hermes Agent dan kirim prompt ini:

```
Hermes, saya sudah sukses pindah ke PC baru. Project TeknoHub & Obsidian
Vault sudah berjalan di localhost:3000.
GitHub repo: https://github.com/Albertensen/Web-Dan-App
Status terakhir: Fase 6D In Progress (sebagian) + Fase 7 Security 🟡 Sebagian.
Lanjutkan ke FASE 7 Security Hardening (rate limiting, DOMPurify, API auth helper).
```

> Urutan kerja per ROADMAP.md: Fase 6 (responsive) → 7 (security) → 8 (testing) → 9 (mobile) → 10 (launch).

---

## Status Project Terakhir (saat backup 2026-08-11, commit `f09484f`)

| Fase | Status |
|------|--------|
| FASE 1 — Foundation | ✅ Tuntas |
| FASE 2 — Autentikasi & Akun | ✅ Tuntas |
| FASE 3 — E-Commerce | 🟡 Sebagian (15/18) |
| FASE 4 — Forum Tech & AI | ✅ Tuntas |
| FASE 5 — PC Builder AI ⭐ | ✅ Tuntas (23/23) |
| FASE 6 — Responsive Design | ✅ Tuntas (23/23) |
| FASE 6D — UI Overhaul & Polish | 🔵 In Progress (16/20) |
| FASE 7 — Security Hardening | 🟡 Sebagian |
| FASE 8 — Testing & QA | ⏳ Belum dimulai |
| FASE 9 — Mobile App | ⏳ Belum dimulai (setelah 6/7/8) |
| FASE 10 — Launch | ⏳ Belum dimulai |

---

## Konten Backup (docs/obsidian-vault/)

```
docs/obsidian-vault/
├── 00-SISTEM/
│   ├── AGENT-ROSTER.md
│   ├── DESIGN-RULES.md
│   ├── GEMMA-RULES.md
│   ├── HERMES-RULES.md
│   ├── PATHS.md
│   └── SESSION-TEMPLATE.md
├── KNOWLEDGE/
│   ├── LESSONS-LEARNED.md
│   ├── PROMPT-PATTERNS.md
│   └── TOKEN-SAVING-RULES.md
└── PROJECTS/
    ├── _INDEX.md
    └── TeknoHub.md
```

File `mainbrain.md` & `PROJECT_ROADMAP.md` versi monorepo: `ROADMAP.md`, `TeknoHub.md`, `CHANGELOG.md` di root `teknohub/`.
