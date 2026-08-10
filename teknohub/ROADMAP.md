# TeknoHub — Roadmap & Checklist

Platform: E-Commerce Elektronik + Forum Tech/AI + Jasa Rakit PC dengan AI Agent
Repo: https://github.com/Albertensen/Web-Dan-App
Vercel: https://vercel.com/rebahan
Stack: Next.js 14 + Expo + Supabase + Midtrans + Hermes AI + Playwright

---

## Keputusan Teknis yang Sudah Diputuskan

| Keputusan | Pilihan | Alasan |
|-----------|---------|--------|
| Frontend web | Next.js 14 App Router | SSR, SEO, file-based routing |
| Mobile | Expo React Native | 1 codebase → Android + iOS |
| Database | Supabase PostgreSQL | Auth + Realtime + Storage built-in |
| Payment | Midtrans | Payment gateway Indonesia terpopuler |
| Scraping | Playwright | Handle SPA/JS-rendered pages |
| AI Agent | Hermes + Gemma 4 E4B | Pintar untuk planning, gratis untuk coding |
| Repo struktur | Monorepo (turborepo) | Share types antara web dan mobile |
| Auth | NextAuth + Supabase | OAuth Google + email |
| Styling | Tailwind + shadcn/ui | Konsisten dan cepat |
| State | Zustand | Ringan, tidak boilerplate |

---

## DESIGN SYSTEM — Shopify (awesome-design-md)
Status: ✅ Terpasang & diterapkan

- [x] DESIGN.md terinstall (npx getdesign add shopify) di apps/web
- [x] Design token: CSS Custom Properties di globals.css (background/surface/accent/text/border/glow)
- [x] Utility classes: glow-card, glass-surface, gradient-text, neon-border, shimmer
- [x] Animations: fadeInUp, glowPulse, cardLift, shimmer (keyframes + tailwind extend)
- [x] Tailwind extend: colors, fontFamily (display/body), boxShadow glow-sm..xl
- [x] Homepage hero monumental (font extralight, gradient-text, animated mesh)
- [x] Navbar glassmorphism + cart badge live + mobile drawer
- [x] ProductCard premium (4:3 image, neon pill, gradient price, add-to-cart)
- [x] Products page (token colors, sticky glass filter)
- [x] ThreadCard upgrade (category color pills, relative time)
- [x] Builder page pakai token (glow-card via PcBuilder)
- [ ] Halaman lain menyusul (detail produk, forum detail, checkout, admin) — inkremental

---

## FASE 1 — Foundation
Status: ✅ Selesai

### Setup Awal
- [x] Init monorepo teknohub/ (Next.js + packages + supabase)
- [x] Homepage profesional (dark theme, 3 hero card)
- [x] Semua route placeholder dibuat
- [x] SQL schema lengkap (13 tabel + indexes + RLS policies + seed data)
- [x] .env.example + turbo.json + next.config.mjs (Next 14 tak dukung .ts)
- [x] npm run dev jalan di localhost:3000

### GitHub & Deploy
- [x] Git push fase 1 ke main
- [x] Connect repo ke Vercel (rebahan account)
- [x] Set env variables di Vercel (6 vars: Supabase URL/anon, APP_URL, APP_NAME, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [x] Deploy pertama berhasil (https://teknohub-omega.vercel.app)

### Database & Auth
- [x] Buat Supabase project
- [x] Run SQL migration di Supabase (14 tabel + RLS + seed via Management API)
- [x] Setup NextAuth + Google OAuth (credentials aktif di Vercel + dev)
- [x] Login/register flow berfungsi (provider google live, callback verified)
- [x] RLS policies aktif dan ditest (6/6 PASS)

---

## FASE 2 — Autentikasi & Akun Pengguna
Status: ✅ Tuntas

### Halaman Login
- [x] Halaman /login — dark premium design sesuai DESIGN.md
- [x] Form email + password dengan validasi Zod
- [x] Tombol "Lanjutkan dengan Google" (OAuth)
- [x] Toggle show/hide password
- [x] Link "Lupa password?" → /forgot-password
- [x] Link "Belum punya akun? Daftar" → /register
- [x] Error state (email tidak terdaftar, password salah)
- [x] Loading state saat submit
- [x] Redirect ke halaman sebelumnya setelah login berhasil

### Halaman Daftar (Register)
- [x] Halaman /register — konsisten dengan halaman login
- [x] Form: username, email, password, konfirmasi password
- [x] Validasi Zod (email valid, password min 8 char, username min 3 char)
- [x] Tombol "Daftar dengan Google" (OAuth — auto-fill profil)
- [x] Checkbox persetujuan syarat & ketentuan
- [x] Error state (email sudah terdaftar, username sudah dipakai)
- [x] Loading state saat submit
- [x] Redirect ke halaman onboarding / homepage setelah daftar berhasil

### Halaman Lupa Password
- [x] Halaman /forgot-password — form input email
- [x] Kirim magic link reset password via Supabase Auth
- [x] Halaman /reset-password — form password baru + konfirmasi
- [x] Validasi token reset (expired / invalid)
- [x] Success state setelah reset berhasil

### Halaman Profil Pengguna
- [x] Halaman /profile — tampilkan info user (avatar, username, email, reputasi forum)
- [x] Edit profil: upload avatar ke Supabase Storage, ubah username, bio
- [x] Tab: Pesanan Saya, Build Tersimpan, Thread Forum, Pengaturan
- [x] Halaman /profile/settings — ubah password, notifikasi, hapus akun

### Protected Routes & UX Auth
- [x] Middleware proteksi route (cart, checkout, builder saved, forum post, profile)
- [x] Redirect ke /login dengan pesan "Silakan login untuk melanjutkan"
- [x] Persistent login session (NextAuth JWT strategy)
- [x] Logout dari semua device
- [x] User avatar + dropdown menu di Navbar setelah login

---

## FASE 3 — E-Commerce
Status: 🟢 Hampir tuntas (sisa opsional: Algolia/OG-image; blokir: Midtrans akun)

### Katalog Produk
- [x] Seed 15 produk + types (migration 003, 6 kategori)
- [x] Halaman listing produk + filter kategori + search
- [x] Halaman detail produk
- [x] Admin panel: CRUD produk (admin/products + API admin)
- [x] Upload gambar ke Supabase Storage (bucket product-images, signed URL)
- [x] UI Sub-kategori expand (nested filter: Komponen PC → 8 chip, API expand parent)
- [x] Search produk instant di navbar (NavbarSearch → /products?search=)
- [x] SEO: dynamic OG meta (products/[slug]) + sitemap.ts (static + 15 produk)
- [ ] Search produk (Algolia/Meilisearch) — basic ilike sudah jalan
- [ ] SEO lanjut: OG image generator — dynamic meta + sitemap sudah live

### Cart & Checkout
- [x] Tambah ke keranjang (Zustand persist, AddToCartButton)
- [x] Halaman cart (qty stepper, total)
- [x] Checkout form (zod alamat, pilih kurir, Midtrans Snap inject)
- [x] API checkout: create order + order_items + kurangi stock + snap token
- [x] API webhook Midtrans: verify signature + update status paid (pending akun — mock token aktif)
- [x] Riwayat pesanan (/orders, status badge, total IDR)
- [x] Order confirmation (snap token flow, mock saat Midtrans pending)
- [ ] Integrasi Midtrans asli (butuh akun + server/client key dari dashboard.sandbox.midtrans.com) — feature pending, user belum punya akun

---

## FASE 4 — Forum Tech & AI
Status: ✅ Tuntas (100%) — Forum Core + Komunitas

### Forum Core
- [x] Kategori: Hardware, AI, Mobile, Gaming, DIY, Jual Beli (seed 001)
- [x] Listing thread + filter kategori + sort (latest/popular)
- [x] Thread detail + reply section UI
- [x] Upvote/downvote UI (VoteControl, reputation trigger +10)
- [x] Reputation/karma system (trigger: +50 solved reply, kunci thread)
- [x] Buat thread (rich text editor TipTap)
- [x] Form buat thread (NewThreadForm, /forum/new)
- [x] Form balasan + list (ReplySection)
- [x] Mark as solution (API owner-only, trigger +50 reputation, lock thread)
- [x] Tag system (tags text[] + GIN index, TagSelector maks 5, filter tag)

### Komunitas
- [x] Reputation/karma system (trigger +10 vote, +50 solved; UserBadge tampil)
- [x] User badges (Member/Active/Contributor/Expert by reputation, UserBadge.tsx)
- [x] Follow user/thread (follows table, FollowButton, trigger notif)
- [x] Notifikasi real-time (notifications table + trigger reply/follow, NotificationBell navbar, Supabase Realtime-ready)
- [x] Moderasi: report, ban (reports table, ReportButton, /admin/moderation, ban 30 hari)
- [x] Search dalam forum (ilike title+content, search box /forum)

---

## FASE 5 — PC Builder AI ⭐ (Fitur Utama)
Status: ✅ Tuntas (100%) — core, saved, compare, SSE, chat AI, CS widget, quote+invoice, Camofox scraper

### Data Pipeline
- [x] Scraper Tokopedia + Shopee via Camofox anti-detect browser (camofoxScraper.js, REST localhost:9377)
- [x] Playwright fallback scraper (componentScraper.js, HTTP fetch)
- [x] Database komponen dengan normalized specs (34 komponen, migration 004)
- [x] Price history tracking (component_prices, 34 harga official seed)
- [x] Vercel Cron update harga (Hobby: daily 06:00 UTC, vercel.json)
- [x] API endpoint GET /api/components (filter type/socket, harga terbaru)

### PC Builder UI
- [x] Wizard: pilih use case + input budget (slider 3jt-50jt)
- [x] Komponen selector real-time dari database (alokasi budget per use case)
- [x] Compatibility checker (socket CPU↔mobo, RAM DDR4/DDR5↔mobo socket)
- [x] Build comparison view (/builder/compare, 3 build side-by-side)
- [x] Saved builds per user (/builder/saved, SaveBuildButton, detail /builder/[slug])

### AI Agent
- [x] Bottleneck algorithm (CPU tier vs GPU tier, warning imbalance)
- [x] Budget allocation formula per use case (gaming/productivity/content-creator/budget)
- [x] System prompt + tools untuk AI agent (chat route: Ollama + rule-based fallback)
- [x] Endpoint POST /api/pc-builder/recommend (streaming SSE ?stream=1)
- [x] Output 3 build recommendation + reasoning bahasa Indonesia
- [x] Link langsung ke Tokopedia/Shopee (marketplace_url terisi 34 komponen, migration 009)
- [x] **Interactive AI PC Builder Chat + Live Summary Sync** (di /builder) — chat konsultasi rakit PC, rekomendasi AI sync ke ringkasan build real-time
- [x] **24/7 Global AI Customer Service (CS) Floating Widget** (seluruh web) — chatbot CS knowledge base toko, floating di pojok kanan bawah

### Quote System
- [x] Form request penawaran resmi (RequestQuoteModal, estimasi jasa rakit 150-300rb)
- [x] AI draft penawaran otomatis (ai_draft: total komponen + jasa rakit + garansi)
- [x] Admin review & kirim penawaran (send/accept/reject + final quote, /admin/quotes)
- [x] Invoice otomatis (PDF download /api/admin/quotes/[id]/pdf, tombol di dashboard)

---

## FASE 6 — Responsive Design (Mobile-First)
Status: ✅ Tuntas (2026-08-10, commit f9a7b2c)

### Layout & Navigation
- [x] Navbar mobile: hamburger menu + drawer slide-in
- [x] Navbar dropdown user: touch-friendly di mobile
- [x] Footer: stack vertical di mobile
- [x] Semua padding/margin dikecilkan di mobile (px-4 → px-3)

### Halaman E-Commerce
- [x] Homepage hero: font size dikecilkan di mobile, CTA stack vertical
- [x] Product grid: 2 kolom mobile, 3 kolom tablet, 4 kolom desktop
- [x] Product detail: image full-width di mobile, info di bawah
- [x] Cart: layout stack vertical di mobile
- [x] Checkout form: single column di mobile

### Forum
- [x] Thread listing: full-width card di mobile
- [x] Thread detail: sidebar disembunyikan di mobile
- [x] Reply form: full-width di mobile
- [x] Tag selector: horizontal scroll di mobile

### PC Builder
- [x] Wizard: step 1 kolom di mobile (bukan side-by-side)
- [x] AI Chat + Build Summary: stack vertical di mobile (chat di atas, summary di bawah)
- [x] Slider budget: touch-friendly, label visible di mobile
- [x] Build comparison: scroll horizontal di mobile

### Admin Panel
- [x] Admin table: horizontal scroll + sticky first column di mobile
- [x] Admin form: single column di mobile

### Assets & Performance
- [x] Semua <img> diganti next/image dengan sizes prop yang benar
- [x] Lazy loading gambar produk
- [x] Font subset: hanya karakter Latin yang diload
- [x] Viewport meta tag benar di layout.tsx

---

## FASE 7 — Security Hardening
Status: 🟡 Sebagian

### HTTP Security Headers
- [x] next.config.ts: tambah Content-Security-Policy (CSP)
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: camera=(), microphone=(), geolocation=()
- [ ] Strict-Transport-Security (HSTS) via Vercel

### API Route Security
- [x] Rate limiting semua API routes (upstash/ratelimit atau custom middleware)
- [x] Rate limit ketat di: POST /api/auth, POST /api/forum/threads, POST /api/support/chat
- [x] Auth check wajib di semua route yang butuh login (tidak boleh ada route admin tanpa cek role)
- [ ] Audit semua route: pastikan tidak ada yang bisa diakses tanpa autentikasi

### Input Validation & Sanitization
- [ ] Semua input user divalidasi dengan Zod sebelum masuk DB
- [x] HTML sanitizer di TipTap output sebelum disimpan (DOMPurify atau sanitize-html)
- [ ] File upload: validasi MIME type + ukuran di server (bukan hanya client)
- [ ] Cegah path traversal di file upload ke Supabase Storage

### Supabase RLS Audit
- [ ] Audit semua tabel: pastikan RLS ON dan policies benar
- [ ] Test: user biasa tidak bisa baca data user lain
- [ ] Test: user biasa tidak bisa update/delete data orang lain
- [ ] Test: admin-only tables tidak bisa diakses user biasa
- [ ] Service role key TIDAK pernah terekspos ke client-side

### Autentikasi & Session
- [ ] NEXTAUTH_SECRET minimal 32 karakter (sudah ada, verify)
- [ ] Session cookie: httpOnly, secure, sameSite=strict
- [ ] JWT expiry: access token 1 jam, refresh token 7 hari
- [ ] Brute force protection di /api/auth/signin (rate limit 5x per menit)
- [ ] Password minimum 8 karakter + 1 angka (validasi Zod sudah ada, verify)

### Environment & Secrets Audit
- [ ] Audit .gitignore: semua .env, run_*.py, *.key tidak ter-commit
- [ ] Vercel env: semua secret di production env (tidak ada yang hardcode)
- [x] NEXT_PUBLIC_ hanya untuk nilai yang aman di client
- [ ] Rotate semua key yang pernah ter-commit (Supabase PAT, service role)

### Dependency Security
- [ ] npm audit — fix semua critical + high vulnerability
- [ ] Update dependencies ke versi aman terbaru
- [ ] Hapus package yang tidak terpakai dari package.json

---

---

## FASE 6D — UI Overhaul & Polish
Status: 🔵 In Progress

### Homepage
- [x] Forum preview: tampilkan 3 thread terbaru dari DB (SSR)
- [x] Stats section: jumlah produk, user terdaftar, thread forum (count dari DB)
- [x] Footer copyright: perbaiki teks jadi proper
- [x] Category filter lengkap: Semua, Laptop, GPU, Processor, Smartphone, Monitor, Storage, Peripherals

### Navbar & Navigation
- [x] Fix link /builder-3d → /builder di mobile drawer dan semua tempat
- [x] Tambah "PC Builder" di desktop nav links
- [x] Konsistensi semua internal link

### PC Builder Page — 3D Visual Experience
- [x] Redesign total halaman /builder dengan visual 3D futuristik
- [x] Animated particle field (canvas/Three.js atau pure CSS)
- [x] Neon grid perspektif sebagai background
- [x] Floating spec bars (CPU%, GPU%, RAM%) animasi masuk dari bawah
- [x] Glassmorphism card untuk form pilih komponen
- [x] AI Chat tetap di sisi kanan dengan design premium
- [x] Build summary card dengan glow effect dan animasi total harga

### Product Pages
- [ ] Related products section di /products/[slug]
- [ ] Product image fallback yang menarik (bukan emoji)
- [ ] Breadcrumb navigation

### Empty States
- [x] /cart empty state: ilustrasi + CTA "Mulai Belanja"
- [x] /orders empty state: ilustrasi + CTA
- [ ] /forum empty state yang menarik

---
## FASE 8 — Testing & QA
Status: ⏳ Belum dimulai

### Unit & Integration Test
- [ ] Setup Vitest + React Testing Library di apps/web
- [ ] Unit test: validasi Zod (login, register, review, thread)
- [ ] Unit test: sanitizer HTML (strip script/onclick/javascript:)
- [ ] Unit test: rate limiter (window reset, limit exact)
- [ ] Integration test: API forum (auth required, validasi konten)
- [ ] Integration test: API user profile (GET/PATCH, auth check)

### E2E & Visual Test
- [ ] Setup Playwright di apps/web
- [ ] E2E: flow login → profile → edit → logout
- [ ] E2E: flow register → auto-login → logout
- [ ] E2E: flow produk → cart → checkout (mock payment)
- [ ] E2E: flow forum buat thread + reply
- [ ] Visual: mobile viewport 390px semua halaman utama
- [ ] Visual: tablet 768px, desktop 1280px

### Performance & Reliability
- [ ] Lighthouse: score >= 90 (mobile + desktop)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Load test dasar: 50 concurrent request API products
- [ ] Error boundary + fallback UI tiap halaman

### Launch Readiness
- [ ] SEO: meta description + OG image tiap halaman
- [ ] Sitemap.xml valid & ter-submit
- [ ] 404 page custom
- [ ] Smoke test semua route utama sebelum deploy prod

---

## FASE 9 — Mobile App
Status: ⏳ Belum dimulai (dikerjakan SETELAH Fase 6/7/8)

- [ ] Init Expo React Native di apps/mobile
- [ ] Shared types dari packages/shared
- [ ] Tab navigation: Home, Shop, Forum, PC Builder, Profile
- [ ] E-commerce di mobile
- [ ] Forum di mobile
- [ ] PC Builder di mobile
- [ ] Push notification (Expo Notifications)
- [ ] Deep linking web ↔ mobile
- [ ] Submit Google Play Store
- [ ] Submit Apple App Store

---

## FASE 10 — Launch
Status: ⏳ Belum dimulai

- [ ] Beta testing 20-50 user
- [ ] Load testing
- [ ] Core Web Vitals optimization
- [ ] Redis caching untuk harga komponen
- [ ] Monitoring: Sentry + Vercel Analytics
- [ ] Seed konten: 20 produk, 10 thread forum, 5 build showcase
- [ ] Public launch

---

## Environment Variables yang Dibutuhkan

| Variable | Deskripsi |
|----------|-----------|
| NEXT_PUBLIC_SUPABASE_URL | URL project Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Anon key publik Supabase |
| SUPABASE_SERVICE_ROLE_KEY | Service role key (server-only, jangan bocor) |
| DATABASE_URL | Connection string PostgreSQL |
| AUTH_SECRET | Secret untuk NextAuth (openssl rand -base64 32) |
| AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET | Credentials Google OAuth |
| MIDTRANS_SERVER_KEY | Server key Midtrans (production) |
| MIDTRANS_CLIENT_KEY | Client key Midtrans (publik) |
| NEXT_PUBLIC_APP_URL | URL app (localhost / production) |

---

## Catatan Sesi

- **2026-08-09**: Fase 2 (Auth) tuntas (a183ba6); Fase 6 (Responsive) & 7 (Security) sebagian (0ab97ca, d0163e6) — 17 item dicentang, 58 sisa. Urutan kerja: **6 (responsif browser) → 7 (security) → 8 (testing) → 9 (mobile) → 10 (launch)**. Snapshot: [[TeknoHub-Status]].

## Catatan

- `next.config.ts` di checklist asli → diganti `.mjs`: Next.js 14 tidak mendukung config TypeScript (fitur Next 15)
- schema.sql saat ini 6 tabel inti (profiles, products, forum_categories, forum_threads, forum_replies, pc_builds) — akan di-expand ke 12 tabel sesuai kebutuhan Fase 3-5 (orders, order_items, addresses, component_prices, price_history, quotes, notifications, dll)
