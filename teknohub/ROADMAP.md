# TeknoHub — Roadmap & Checklist

Platform: E-Commerce Elektronik + Forum Tech/AI + Jasa Rakit PC dengan AI Agent
Repo: https://github.com/Albertensen/Web-Dan-App
Vercel: https://vercel.com/rebahan
Stack: Next.js 14 + Expo + Supabase + Midtrans + Hermes AI + Playwright

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

## FASE 1B — Autentikasi & Akun Pengguna
Status: 🔵 In Progress

### Halaman Login
- [ ] Halaman /login — dark premium design sesuai DESIGN.md
- [ ] Form email + password dengan validasi Zod
- [ ] Tombol "Lanjutkan dengan Google" (OAuth)
- [ ] Toggle show/hide password
- [ ] Link "Lupa password?" → /forgot-password
- [ ] Link "Belum punya akun? Daftar" → /register
- [ ] Error state (email tidak terdaftar, password salah)
- [ ] Loading state saat submit
- [ ] Redirect ke halaman sebelumnya setelah login berhasil

### Halaman Daftar (Register)
- [ ] Halaman /register — konsisten dengan halaman login
- [ ] Form: username, email, password, konfirmasi password
- [ ] Validasi Zod (email valid, password min 8 char, username min 3 char)
- [ ] Tombol "Daftar dengan Google" (OAuth — auto-fill profil)
- [ ] Checkbox persetujuan syarat & ketentuan
- [ ] Error state (email sudah terdaftar, username sudah dipakai)
- [ ] Loading state saat submit
- [ ] Redirect ke halaman onboarding / homepage setelah daftar berhasil

### Halaman Lupa Password
- [ ] Halaman /forgot-password — form input email
- [ ] Kirim magic link reset password via Supabase Auth
- [ ] Halaman /reset-password — form password baru + konfirmasi
- [ ] Validasi token reset (expired / invalid)
- [ ] Success state setelah reset berhasil

### Halaman Profil Pengguna
- [ ] Halaman /profile — tampilkan info user (avatar, username, email, reputasi forum)
- [ ] Edit profil: upload avatar ke Supabase Storage, ubah username, bio
- [ ] Tab: Pesanan Saya, Build Tersimpan, Thread Forum, Pengaturan
- [ ] Halaman /profile/settings — ubah password, notifikasi, hapus akun

### Protected Routes & UX Auth
- [ ] Middleware proteksi route (cart, checkout, builder saved, forum post, profile)
- [ ] Redirect ke /login dengan pesan "Silakan login untuk melanjutkan"
- [ ] Persistent login session (NextAuth JWT strategy)
- [ ] Logout dari semua device
- [ ] User avatar + dropdown menu di Navbar setelah login

---

## FASE 2 — E-Commerce
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

## FASE 3 — Forum Tech & AI
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

## FASE 4 — PC Builder AI ⭐ (Fitur Utama)
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

## FASE 5 — Mobile App
Status: ⏳ Belum dimulai

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

## FASE 6 — Launch
Status: ⏳ Belum dimulai

- [ ] Beta testing 20-50 user
- [ ] Load testing
- [ ] Core Web Vitals optimization
- [ ] Redis caching untuk harga komponen
- [ ] Monitoring: Sentry + Vercel Analytics
- [ ] Seed konten: 20 produk, 10 thread forum, 5 build showcase
- [ ] Public launch

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

## Catatan

- `next.config.ts` di checklist asli → diganti `.mjs`: Next.js 14 tidak mendukung config TypeScript (fitur Next 15)
- schema.sql saat ini 6 tabel inti (profiles, products, forum_categories, forum_threads, forum_replies, pc_builds) — akan di-expand ke 12 tabel sesuai kebutuhan Fase 2-4 (orders, order_items, addresses, component_prices, price_history, quotes, notifications, dll)
