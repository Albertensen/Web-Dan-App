# TeknoHub — Roadmap & Checklist

Platform: E-Commerce Elektronik + Forum Tech/AI + Jasa Rakit PC dengan AI Agent
Repo: https://github.com/Albertensen/Web-Dan-App
Vercel: https://vercel.com/rebahan
Stack: Next.js 14 + Expo + Supabase + Midtrans + Hermes AI + Playwright

---

## FASE 1 — Foundation
Status: 🔵 In Progress

### Setup Awal
- [x] Init monorepo teknohub/ (Next.js + packages + supabase)
- [x] Homepage profesional (dark theme, 3 hero card)
- [x] Semua route placeholder dibuat
- [x] SQL schema lengkap (6 tabel inti — perlu expand ke 12)
- [x] .env.example + turbo.json + next.config.mjs (Next 14 tak dukung .ts)
- [x] npm run dev jalan di localhost:3000

### GitHub & Deploy
- [x] Git push fase 1 ke main
- [ ] Connect repo ke Vercel (rebahan account)
- [ ] Set env variables di Vercel
- [ ] Deploy pertama berhasil (URL live)

### Database & Auth
- [ ] Buat Supabase project
- [ ] Run SQL migration di Supabase
- [ ] Setup NextAuth + Google OAuth
- [ ] Login/register flow berfungsi
- [ ] RLS policies aktif dan ditest

---

## FASE 2 — E-Commerce
Status: ⏳ Belum dimulai

### Katalog Produk
- [ ] Halaman listing produk + filter + sort
- [ ] Halaman detail produk
- [ ] Kategori: Laptop, HP, Monitor, Komponen PC, Aksesoris
- [ ] Search produk (Algolia/Meilisearch)
- [ ] Admin panel: CRUD produk
- [ ] Upload gambar ke Supabase Storage
- [ ] SEO: meta tags, OG image, sitemap

### Cart & Checkout
- [ ] Tambah ke keranjang (sync web ↔ mobile)
- [ ] Halaman cart
- [ ] Checkout: alamat → pengiriman → payment
- [ ] Integrasi Midtrans payment gateway
- [ ] Order confirmation
- [ ] Riwayat pesanan

---

## FASE 3 — Forum Tech & AI
Status: ⏳ Belum dimulai

### Forum Core
- [ ] Kategori: Hardware, AI, Mobile, Gaming, DIY, Jual Beli
- [ ] Buat thread (rich text editor TipTap)
- [ ] Reply & nested replies
- [ ] Upvote/downvote
- [ ] Mark as solution
- [ ] Tag system

### Komunitas
- [ ] Reputation/karma system
- [ ] User badges
- [ ] Follow user/thread
- [ ] Notifikasi real-time (Supabase Realtime)
- [ ] Moderasi: report, ban
- [ ] Search dalam forum

---

## FASE 4 — PC Builder AI ⭐ (Fitur Utama)
Status: ⏳ Belum dimulai

### Data Pipeline
- [ ] Playwright scraper Tokopedia (CPU, GPU, RAM, SSD, Mobo, PSU, Case, Cooler)
- [ ] Playwright scraper Shopee
- [ ] Database komponen dengan normalized specs
- [ ] Price history tracking
- [ ] Cron job update harga tiap 6 jam
- [ ] API endpoint GET /api/components

### PC Builder UI
- [ ] Wizard: pilih use case + input budget
- [ ] Komponen selector real-time dari database
- [ ] Compatibility checker (socket, form factor, power)
- [ ] Build comparison view
- [ ] Saved builds per user

### AI Agent
- [ ] Bottleneck algorithm (CPU tier vs GPU tier)
- [ ] Budget allocation formula per use case
- [ ] System prompt + tools untuk AI agent
- [ ] Endpoint POST /api/pc-builder/recommend (streaming SSE)
- [ ] Output 3 build recommendation + reasoning bahasa Indonesia
- [ ] Link langsung ke Tokopedia/Shopee

### Quote System
- [ ] Form request penawaran resmi
- [ ] AI draft penawaran otomatis
- [ ] Admin review & kirim penawaran
- [ ] Invoice otomatis

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
