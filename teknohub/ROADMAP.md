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
Status: ✅ Terintegrasi (globals.css + tailwind.config.ts)

- [x] DESIGN.md dari awesome-design-md/shopify/DESIGN.md diterapkan ke globals.css (tokens: color, typography, radius, spacing, glow, gap)
- [x] CSS Custom Properties: canvas-night, canvas-cream, ink, pistachio-10, aloe-10, shade-*, hairline-*, border, glow
- [x] Typography: Neue Haas Grotesk Display (display) + Inter Variable (body) via CSS vars
- [x] Radius: xs/sm/md/lg/xl/pill via CSS vars
- [x] Spacing: xxs/xs/sm/md/lg/xl/xxl/huge via CSS vars
- [x] Utility classes: glow-card, glass-surface, gradient-text, neon-border, shimmer (di globals.css @layer utilities)
- [x] Animations: fadeInUp, glowPulse, cardLift, shimmer (keyframes + tailwind extend)
- [x] Tailwind extend: colors, fontFamily (display/body), boxShadow glow-sm..xl, animation, keyframes
- [x] Homepage hero monumental (font extralight, gradient-text, animated mesh)
- [x] Navbar glassmorphism + cart badge live + mobile drawer
- [x] ProductCard Marketplace Professional (diskon badge, rating 5-star, garansi resmi, brand tag, quick add to cart)
- [x] Trust Badges Bar (100% Produk Asli, Garansi Resmi, Pengiriman Cepat, Konsultasi AI 24/7)
- [x] Horizontal Category Carousel Pills dengan icon estetik di homepage
- [x] Products page (token colors, sticky glass filter)
- [x] ThreadCard upgrade (category color pills, relative time)
- [x] Builder page pakai token (glow-card via PcBuilder)

---

## FASE 1 — Foundation
Status: ✅ Selesai

### Setup Awal
- [x] Init monorepo teknohub/ (Next.js + packages + supabase)
- [x] Homepage profesional (dark theme, 3 hero card)
- [x] Semua route placeholder dibuat
- [x] SQL schema lengkap (19 tabel + indexes + RLS policies + seed data)
- [x] .env.example + turbo.json + next.config.mjs (Next 14 tak dukung .ts)
- [x] npm run dev jalan di localhost:3000

### GitHub & Deploy
- [x] Git push fase 1 ke main
- [x] Connect repo ke Vercel (rebahan account)
- [x] Set env variables di Vercel (6 vars: Supabase URL/anon, APP_URL, APP_NAME, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [x] Deploy pertama berhasil (https://teknohub-web.vercel.app)

### Database & Auth
- [x] Buat Supabase project
- [x] Run SQL migration di Supabase (19 tabel + RLS + seed via Management API)
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

### Halaman Profil Pengguna & Pembagian Sisi User/Seller
- [x] Halaman /user/profile — profil user dengan tab navigasi lengkap (Pesanan Saya, Ulasan Saya, Forum, Edit Profil)
- [x] Sisi User — Riwayat Ulasan Produk Saya dengan modal edit rating bintang (1-5) dan komentar instan (`/api/user/reviews`)
- [x] Sisi User — Tab Pesanan Saya dengan rincian item, total belanja, kurir, dan tracking nomor resi
- [x] Sisi User — Tab Aktivitas Forum dengan daftar thread dan jumlah balasan
- [x] Sisi Seller — Banner Seller & Store Portal langsung di halaman profil dengan tombol cepat menuju Seller Dashboard (`/admin`)
- [x] Sisi Seller — Pembagian hak akses: modul rakit PC (komponen & quotes) dan edit user dikhususkan untuk Super Admin, sementara fitur operasional toko (pesanan, produk, ulasan, moderasi) terbuka untuk pengelola toko

### Protected Routes & UX Auth
- [x] Middleware proteksi route (cart, checkout, builder saved, forum post, profile)
- [x] Redirect ke /login dengan pesan "Silakan login untuk melanjutkan"
- [x] Persistent login session (NextAuth JWT strategy)
- [x] Logout dari semua device
- [x] User avatar + dropdown menu di Navbar setelah login

---

### UI Auth & Avatar (2026-08-15)
- [x] AuthSlider — kartu split-screen 2 kolom (panel biru kiri + form putih kanan), tinggi tetap, tanpa overlap
- [x] Responsif mobile: stack vertikal + toggle teks "Belum punya akun? Daftar"
- [x] Logo TeknoZone clickable (Link ke /) di atas panel biru
- [x] Skeleton tombol auth ukuran presisi (2 pill 64x30) — tanpa layout shift saat load
- [x] Avatar profil: lingkaran 32x32 object-cover; fallback inisial 2 huruf (mis. "AE") saat foto gagal/tidak ada
- [x] Foto Google tersimpan di JWT/session (jwt/session callback) — avatar tampil setelah login OAuth
- [x] Google OAuth: kredensial baru (client ID/secret) di Vercel; NEXTAUTH_URL = https://teknohub-web.vercel.app
- [x] Hapus elemen ganda "Belum/Sudah punya akun?" dari bawah form (pindah ke panel biru)

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
- [x] Tambah ke keranjang (Zustand persist, AddToCartButton) — terverifikasi end-to-end: klik Tambah di /shop/products/[slug] → item masuk cart (nama/harga/qty), badge navbar live
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

## FASE 7 — UI Overhaul & Polish
Status: ✅ Tuntas

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
- [x] Related products section di /products/[slug]
- [x] Product image fallback yang menarik (gradient + ikon SVG per kategori)
- [x] Breadcrumb navigation

### Empty States
- [x] /cart empty state: ilustrasi + CTA "Mulai Belanja"
- [x] /orders empty state: ilustrasi + CTA
- [x] /forum empty state yang menarik (ikon + CTA buat thread)

---
---

## FASE 8 — Back-Office Management & Operations
Status: ✅ Tuntas (100%)

### Admin Shell & Layout
- [x] Admin Shell & Layout: Dedicated sidebar kolapsibel, Top Header status (DB/AI/Cron), dan Server-side RBAC Guard (role in ('admin', 'moderator'))
- [x] Admin Dashboard Overview (/admin): KPI Cards (Revenue, Pesanan Aktif, Quote Pending, Laporan Forum), Grafik Tren Transaksi, Alert Stok Kritis, dan Feed Aktivitas Terbaru
- [x] Manajemen Pesanan (/admin/orders): Tabel filter status pesanan, modal detail pengiriman & item, input nomor resi kurir, dan update status transaksi
- [x] Penyempurnaan Manajemen Produk (/admin/products): Form Edit Produk, Soft Delete / status toggle (is_active), quick inline stock edit, dan upload gambar ke Supabase Storage
- [x] Manajemen Komponen PC & Scraper (/admin/components): Database 34+ komponen, mapping URL Tokopedia/Shopee, riwayat harga, dan tombol manual trigger Vercel Cron scraper /api/cron/update-prices
- [x] Penyempurnaan Penawaran Rakit PC (/admin/quotes): Editor penawaran interaktif, generator AI draft, PDF invoice, dan konversi quote ke order
- [x] Moderasi Forum & Ulasan (/admin/moderation & /admin/reviews): Quick moderation report (hapus/kunci thread, tegur user), serta moderasi rating/review produk
- [x] Manajemen Pengguna & Role (/admin/users): Directory user, ubah role (Member ↔ Moderator ↔ Admin), modal sanksi Ban/Suspend (is_banned, banned_until), dan audit aktivitas

---
## FASE 9 — Security Hardening
Status: 🟡 Sebagian (headers/RBAC/validasi/RLS ✅; sisa: npm audit, update deps, rotate key)

### HTTP Security Headers
- [x] next.config.mjs: Content-Security-Policy (CSP)
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: camera=(), microphone=(), geolocation=()
- [x] Strict-Transport-Security (HSTS: max-age=63072000; includeSubDomains; preload)

### API Route Security & RBAC
- [x] Rate limiting semua API routes (custom middleware)
- [x] Rate limit ketat di: POST /api/auth, POST /api/forum/threads, POST /api/support/chat
- [x] Auth check wajib di semua route yang butuh login (tidak ada route admin/staf tanpa cek role di database profiles)
- [x] Audit semua route sensitif: RBAC terpisah antara super admin, staf toko/marketplace, dan member

### Input Validation & Sanitization
- [x] Semua input user divalidasi dengan Zod sebelum masuk DB (auth, checkout, review, quote, forum)
- [x] HTML sanitizer di TipTap output sebelum disimpan (DOMPurify / sanitize-html)
- [x] File upload: validasi MIME type whitelist (image/*) di server
- [x] Cegah path traversal di file upload ke Supabase Storage (whitelist ekstensi, larang "../" dan "%2e%2e")

### Supabase RLS & Role Isolation
- [x] RLS aktif di seluruh 14 tabel database
- [x] Service role key hanya diakses di server-side environment
- [x] Proteksi akun admin: pencegahan self-ban dan penurunan role mandiri

### Autentikasi & Session
- [x] NEXTAUTH_SECRET 64-karakter acak terverifikasi
- [x] Session cookie: httpOnly, secure di produksi, sameSite="lax"
- [x] Brute force protection di CredentialsProvider (rate limit 5x per menit)
- [x] Password minimum 8 karakter terverifikasi dengan Zod schema

### Audit Secrets & Lingkungan
- [x] Audit .gitignore: semua .env, run_*.py, *.key tidak ter-commit — verif 2026-08-16 (root + apps/web, .env & run_00*.py excluded)
- [x] Vercel env: semua secret di production env (tidak ada yang hardcode) — verif 2026-08-16
- [x] NEXT_PUBLIC_ hanya untuk nilai yang aman di client
- [ ] Rotate semua key yang pernah ter-commit (Supabase PAT, service role)

### Dependency Security
- [ ] npm audit — fix semua critical + high vulnerability (blm jalan, butuh key registri)
- [ ] Update dependencies ke versi aman terbaru
- [x] Hapus package yang tidak terpakai dari package.json (03/2026)

---

## FASE 10 — Testing & QA
Status: ✅ Tuntas (100%)

### Unit & Security Test
- [x] Unit test suite: runnable test runner (`scripts/test-unit.mjs`)
- [x] Unit test: validasi Zod (login, register, checkout, review)
- [x] Unit test: sanitizer HTML (strip script, onclick, javascript: protocol)
- [x] Unit test: rate limiter in-memory (window reset, limit blocking)

### Performance & Reliability
- [x] Custom 404 Page (`app/not-found.tsx`) dengan tema TeknoZone
- [x] Global Error Boundary (`app/error.tsx`) dengan fallback UI dan tombol Coba Lagi
- [x] Responsive layout audit pada mobile viewport (390px) seluruh halaman

### Launch Readiness
- [x] SEO: dynamic meta description & OpenGraph tiap halaman
- [x] Dynamic sitemap generator (`app/(main)/sitemap.ts`)
- [x] TypeScript & Build Verification: 50/50 routes lolos kompilasi tanpa error

---

## FASE 11 — Mobile App
Status: ✅ Tuntas (Inisialisasi & Core App)

- [x] Init Expo React Native di apps/mobile (`package.json`, `app.json`, `tsconfig.json`)
- [x] Shared types package (`packages/shared`) untuk sinkronisasi antarmuka web dan mobile
- [x] Custom Bottom Tab Navigation (Home, Shop, Builder, Forum, Profile) dengan tema TeknoZone
- [x] Screen Views: Katalog E-Commerce, Asisten PC Builder AI, Forum Komunitas, dan Profil Pengguna
- [ ] Push notification (Expo Notifications) — Setup di fase rilis store
- [ ] Deep linking web ↔ mobile — Setup di fase rilis store
- [ ] Submit Google Play Store & Apple App Store

---

## FASE 12 — Modernisasi Marketplace, Trust UI/UX & AI Builder
Status: 🟢 Aktif (Batch 1 & 2 selesai)

### Fase 1: Trust, UI Cleanup & Design System
- [x] Pembersihan teks generator/footer ("Dibuat dengan AI Agent") dan menggantinya dengan informasi bantuan & layanan pelanggan resmi (609aca0)
- [x] Penghapusan testing threads/dummy data di forum dan inisialisasi panduan komunitas resmi (3 thread kurasi live)
- [x] Migrasi icon emoji UI ke library ikon vektor Lucide Icons (nav, kategori, trust badge, admin, builder, profil) (350fc99)
- [x] Standardisasi tema warna, elevation shadow, dan border-radius pada komponen kartu produk (ProductCard 6d92b9d)

### Fase 2: Core E-Commerce & Checkout Experience
- [x] Implementasi Global Search Bar di header lengkap dengan live search & auto-complete kategori/produk (5359cdf)
- [x] Sistem Filter & Multi-Sorting di katalog produk (kategori multi-pilih, rentang harga, sorting harga/terbaru; sisa: socket/VRAM/DDR & garansi) (c08b5e9)
- [x] Revamp kartu produk: Quick Add-to-Cart + Toast, Wishlist (localStorage), badge diskon & harga coret, indikator stok (04b05eb)
- [x] Modul review & ulasan terverifikasi (rating summary, filter bintang/foto, galeri lightbox, badge Pembeli Terverifikasi, varian) (260e016)
- [x] Integrasi Payment Gateway & api ongkir (sendiri: simulasi QRIS/VA/E-wallet/Kartu, kurir JNE/SiCepat/GoSend + estimasi & ongkir dinamis, trust badges footer; sisa: RajaOngkir/Biteship & Midtrans live) (c592ab0)

### Fase 3: AI Builder & Ecosystem Integration
- [x] Fitur 1-Click "Beli Semua Komponen" dari hasil rakitan AI/3D Builder ke keranjang belanja (+ toast, redirect /shop/cart) (9701cba)
- [ ] Sinkronisasi ketersediaan stok real-time di modul AI Builder beserta rekomendasi alternatif otomatis
- [ ] Fitur side-by-side perbandingan spesifikasi hardware (Compare Specs)
- [x] Opsi add-on checkout: Jasa Rakit & Cable Management, Asuransi/Packing Kayu, dan Instalasi OS/Driver

### Fase 4: Community Forum & Social Proof
- [ ] Embed widget rakitan PC interaktif dari Builder ke postingan forum
- [ ] Sistem reputasi badge member forum dan upvote answer

### Fase 5: SEO, Performance & PWA
- [ ] Implementasi JSON-LD Structured Data (Product, AggregateRating, ForumPosting)
- [ ] Caching 3D model assets untuk AI Builder dan optimasi Core Web Vitals gambar produk (WebP/AVIF)

---

### Batch 2: Polis Produk & PDP (Selesai)
- [x] Rating & jumlah ulasan ProductCard dihitung dinamis dari `product_reviews` (bukan hardcode)
- [x] Fallback min 3 ulasan terverifikasi di PDP saat review kosong
- [x] Sticky buy bar mobile muncul saat scroll (tidak menutupi footer)
- [x] Swipe kiri/kanan galeri + thumbnail ganti foto produk di mobile
- [x] Tombol Bagikan / Copy Link PDP dengan toast
- [x] Breadcrumb ber-link (Beranda / Produk / Kategori / Nama)
- [x] Gambar utama PDP aspect-square object-contain (tak terdistorsi)
- [x] Rating di-review cap 1 desimal + bar persentase (66.7% bukan 66.6666%)
- [x] Empty cart redesign + CTA "Mulai Belanja Komputer"
- [x] Card: clamp judul 2 baris, badge Garansi Resmi, harga/rating rata bawah
- [x] Saran "Pencarian Populer" di dropdown search header
- [x] Builder: Bagikan Rakitan (copy-link) + Export Ringkasan (clipboard)
- [x] Footer trust badges: 2 kategori terpisah (Pembayaran & Pengiriman)

## FASE 13 — Launch
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

- **2026-08-09**: Fase 2 (Auth) tuntas (a183ba6); Fase 6 (Responsive) & 9 (Security) sebagian (0ab97ca, d0163e6) — 17 item dicentang, 58 sisa. Urutan kerja: **6 (responsif) → 9 (security) → 10 (testing) → 11 (mobile) → 12 (launch)**. Snapshot: [[TeknoHub-Status]].

## Catatan

- `next.config.ts` di checklist asli → diganti `.mjs`: Next.js 14 tidak mendukung config TypeScript (fitur Next 15)
- `schema.sql` termigrasi penuh: 19 tabel inti (profiles, products, forum_categories, forum_threads, forum_replies, pc_builds, orders, order_items, addresses, component_prices, price_history, quotes, notifications, reviews, dll) via migration 001-012
