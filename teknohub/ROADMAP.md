# TeknoHub — Roadmap & Checklist

Platform: E-Commerce Elektronik + Forum Tech/AI + Jasa Rakit PC dengan AI Agent  
Repo: https://github.com/Albertensen/Web-Dan-App  
Vercel: https://teknohub-web.vercel.app  
Stack: Next.js 14 + Expo + Supabase + Midtrans + Hermes AI + Playwright  

---

## Keputusan Teknis yang Sudah Diputuskan

| Keputusan | Pilihan | Alasan |
|---|---|---|
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
- [x] .env.example + turbo.json + next.config.mjs
- [x] npm run dev jalan di localhost:3000

### GitHub & Deploy
- [x] Git push fase 1 ke main
- [x] Connect repo ke Vercel
- [x] Set env variables di Vercel (Supabase URL/anon, APP_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [x] Deploy pertama berhasil (https://teknohub-web.vercel.app)

### Database & Auth
- [x] Buat Supabase project
- [x] Run SQL migration di Supabase (19 tabel + RLS + seed)
- [x] Setup NextAuth + Google OAuth
- [x] Login/register flow berfungsi (provider google live, callback verified)
- [x] RLS policies aktif dan ditest (6/6 PASS)

---

## FASE 2 — Autentikasi & Akun Pengguna
Status: ✅ Tuntas

### Halaman Login & Register
- [x] Halaman /login — dark premium design sesuai DESIGN.md
- [x] Form email + password dengan validasi Zod
- [x] Tombol "Lanjutkan dengan Google" (OAuth)
- [x] Toggle show/hide password
- [x] Link "Lupa password?" → /forgot-password
- [x] Halaman /register dengan validasi Zod
- [x] Halaman /forgot-password & /reset-password
- [x] AuthSlider responsif 2 kolom + Logo clickable

### Halaman Profil Pengguna & Portal Seller
- [x] Halaman /user/profile dengan tab navigasi (Pesanan, Ulasan, Forum, Edit Profil)
- [x] Tab Pesanan Saya dengan rincian item, total belanja, kurir, dan no resi
- [x] Tab Ulasan Saya dengan modal edit rating bintang (1-5)
- [x] Banner Seller & Store Portal menuju Dashboard Admin (/admin)
- [x] Protected routes middleware (cart, checkout, builder saved, profile)

---

## FASE 3 — E-Commerce Marketplace
Status: 🟡 Dalam Penyempurnaan (Katalog, Media, Search & Payment)

### 3.1. Media & Katalog Produk
- [x] Seed 15 produk + types (migration 003, 6 kategori)
- [x] Halaman listing produk + filter kategori
- [x] Halaman detail produk (PDP)
- [x] Admin panel: CRUD produk (admin/products + API admin)
- [x] Upload gambar ke Supabase Storage (bucket `product-images`)
- [x] **Fix Data Media Produk**: Isi URL gambar asli beresolusi tinggi di database (`image_url`) agar kartu produk & PDP tidak lagi menampilkan icon placeholder SVG
- [x] **Fix Search Backend**: Perbaiki `/api/products?search=` agar melakukan pencarian case-insensitive pada kolom `name`, `brand`, `category`, dan `description` (agar keyword seperti "ASUS" atau "Laptop" memunculkan produk yang relevan)
- [x] **Filter Lanjutan**: Tambahkan filter Rentang Harga (Min-Max slider), Filter Brand (ASUS, Lenovo, Acer, Apple, Samsung, dll.), dan Filter Status Stok
- [x] **Sorting Produk**: Opsi pengurutan (Harga Terendah, Harga Tertinggi, Rating Tertinggi, Terpopuler, Produk Terbaru)

### 3.2. Product Detail Page (PDP) Upgrade
- [x] Tampilan spesifikasi teknis produk & badge garansi
- [x] Breadcrumb navigasi & rekomendasi produk terkait
- [x] **Quantity Selector**: Tambahkan kontrol `[ - ] [ 1 ] [ + ]` di PDP sebelum tombol Tambah ke Keranjang
- [x] **Varian Produk**: Selector varian RAM/Storage/Warna untuk Laptop dan Smartphone
- [x] **Kalkulator Estimasi Ongkir Instan**: Widget input kecamatan/kota pembeli untuk cek biaya kirim JNE/SiCepat langsung di PDP
- [ ] **Tab Diskusi Terkait**: Link otomatis ke thread forum yang membahas produk terkait

### 3.3. Cart, Kurir & Checkout
- [x] Tambah ke keranjang (Zustand persist, AddToCartButton)
- [x] Halaman /shop/cart (qty stepper, subtotal)
- [x] Form checkout (/shop/checkout)
- [x] **Selective Cart Items**: Checkbox pilih item tertentu di keranjang yang ingin di-checkout
- [x] **Kupon & Voucher Promo**: Input voucher diskon belanja dan gratis ongkir di Cart & Checkout
- [x] **Integrasi API Kurir Realtime (Biteship / RajaOngkir)**: Perhitungan ongkir otomatis berdasarkan berat aktual + opsi Asuransi & Packing Kayu
- [ ] **Integrasi Midtrans Live**: Setup Server/Client Key production/sandbox, inject Snap popup payment (QRIS, VA BCA/Mandiri/BRI, GoPay), dan webhook handler status `PAID`
- [x] **Halaman Konfirmasi & Invoice**: Tampilan invoice resmi pesanan setelah pembayaran berhasil + link tracking resi pengiriman

---

## FASE 4 — Forum Komunitas Tech & AI
Status: 🟡 Core Live, Pengayaan Fitur Komunitas

### 4.1. Forum Core & Diskusi
- [x] Kategori forum: Hardware, AI, Mobile, Gaming, DIY, Jual Beli
- [x] Listing thread + filter kategori + sort (latest/popular)
- [x] Halaman thread detail + form balasan (ReplySection)
- [x] Upvote / Downvote control + trigger reputasi
- [x] Tag system (tags text[] + GIN index, filter tag)
- [x] **Rich Text & Markdown Editor**: Upgrade editor di `/forum/new` dengan dukungan upload screenshot hardware, tabel, dan code block syntax highlighting
- [x] **Nested / Quote Replies**: Fitur membalas komentar spesifik atau mention kutipan user lain
- [x] **Accepted Solution**: Tombol bagi pembuat thread untuk menandai balasan terbaik (Solusi Terverifikasi) pada topik troubleshooting

### 4.2. Gamifikasi & Sinergi Marketplace
- [x] User Badges (Member, Contributor, Expert)
- [x] Follow user & thread + Realtime Notification bell
- [x] Sistem report & moderasi konten (/admin/moderation)
- [x] **Marketplace Product Tagging**: Kemampuan mention `@product:[slug]` di postingan forum yang otomatis merender kartu mini produk interaktif yang bisa langsung dibeli
- [x] **Widget "Discussed in Forum"**: Menampilkan ulasan dan diskusi user forum pada halaman produk marketplace terkait

---

## FASE 5 — PC Builder AI ⭐ (Fitur Unggulan)
Status: 🟡 Core AI & Picker Live, Upgrade Kalkulator & Simulasi

### 5.1. AI Recommendation & Data Pipeline
- [x] Scraper Tokopedia + Shopee via Camofox browser
- [x] Database komponen dengan normalized specs (34 komponen)
- [x] Price history tracking & daily update cron
- [x] AI Chat Stream (POST /api/pc-builder/recommend SSE)
- [x] Algoritma deteksi bottleneck (CPU tier vs GPU tier)
- [x] Alokasi budget per use case (Gaming, Rendering AI, Office, Content Creation)

### 5.2. Kalkulator Spesifikasi & Dimensi Fisik
- [x] Compatibility checker (Socket CPU ↔ Motherboard, RAM DDR4/DDR5 ↔ Mobo)
- [x] Build comparison view (/builder/compare)
- [x] Saved builds per user (/builder/saved)
- [x] **Kalkulator Konsumsi Daya (Wattage Estimator)**: Kalkulasi otomatis total estimasi TDP komponen (CPU + GPU + Storage + Fans) dan rekomendasi kapasitas minimal PSU
- [x] **Physical Clearance Checker**: Peringatan kompatibilitas dimensi fisik (Panjang GPU vs Max Case Length, Tinggi CPU Cooler vs Max Case Height, Ukuran Radiator AIO)
- [x] **One-Click "Beli Semua Komponen"**: Tombol instan memasukkan seluruh part rakitan yang kompatibel ke `/shop/cart` + opsi jasa rakit teknisi
- [x] **Export BOM (Bill of Materials)**: Fitur cetak/unduh faktur PDF estimasi anggaran rakitan atau share URL publik ke forum
- [ ] **Visualisasi Rakitan (Modular Canvas / Three.js)**: Preview visual interaktif penempatan komponen di dalam casing

---

## FASE 6 — SEO, Branding, Performa & Legalitas 🚀
Status: 🔴 Prioritas Segera (Krusial untuk Google Indexing)

### 6.1. Critical SEO Fixes
- [x] **Fix Sitemap URL Mismatch**: Perbaiki `app/sitemap.ts` agar URL produk mengarah ke `/shop/products/[slug]` (bukan `/products/[slug]` yang menghasilkan 404)
- [x] **Buat app/robots.ts**: Generate file `robots.txt` dinamis yang mengizinkan perayapan dan menunjuk ke sitemap resmi
- [x] **JSON-LD Schema Structured Data**:
  - `schema.org/Product` pada semua halaman PDP
  - `schema.org/DiscussionForumPosting` pada halaman forum
  - `schema.org/BreadcrumbList` pada navigasi
- [x] **Keseragaman Brand**: Sinkronisasi nama platform (**TeknoZone** / **TeknoHub**) pada meta title, header, hero banner, dan footer

### 6.2. Performa & Optimasi Aset
- [ ] Terapkan komponen `next/image` dengan format WebP/AVIF, responsive `sizes`, dan `placeholder="blur"` untuk optimasi LCP
- [ ] Optimasi font loading (Next.js Google Fonts display swap) untuk mencegah CLS (Cumulative Layout Shift)

### 6.3. Informasi Legalitas & Layanan Pelanggan
- [x] Halaman Kebijakan Privasi (/privacy) & Syarat Ketentuan (/terms)
- [ ] **Kebijakan Garansi & Retur Produk**: Halaman rincian prosedur klaim garansi resmi dan pengembalian barang rusak
- [ ] **Informasi CS & Kontak Resmi**: Alamat operasional toko, nomor WhatsApp CS resmi, dan jam layanan

---

## FASE 6F — Marketplace Produk Digital (Software, License & Vouchers) ⚡
Status: 🟢 Selesai

### 1. Database Schema & Seed Data
- [x] Migrasi SQL `016_digital_products.sql`: kolom `is_digital`, `license_type`, `download_url` di `products` & `digital_code` di `order_items`
- [x] Perbarui tipe data TypeScript di `@/types/product.ts` (`is_digital?: boolean`)
- [x] Seed 6 produk digital resmi (Windows 11 Pro, Office 365, Steam Wallet, Xbox Game Pass, Bitdefender, E-Book AI Builder)

### 2. Katalog & Filter Produk Digital
- [x] Tab filter cepat di `/shop/products`: [ Semua ] • [ 🖥️ Hardware Fisik ] • [ ⚡ Produk Digital ]
- [x] Kategori digital baru: Software & OS, Game Voucher, Security, E-Book Tech
- [x] Badge khusus di ProductCard: `⚡ Instant Delivery (0 Detik)` & `🌐 Pengiriman Digital`

### 3. Halaman Detail Produk Digital (PDP)
- [x] Sembunyikan widget ongkir fisik pada produk digital, gantikan dengan widget Pengiriman Instan Otomatis
- [x] Tab Panduan Aktivasi Lisensi & Syarat Redeem di `ProductDetailsTabs.tsx`

### 4. Checkout Bebas Ongkir & Serial Key di Invoice
- [x] Checkout otomatis Rp 0 ongkir jika pesanan adalah produk digital (tanpa kurir fisik)
- [x] Penyerahan Serial Key / Redeem Code otomatis di Invoice & Akun Pengguna dengan tombol `📋 Salin Kode`

---

## FASE 7 — UI/UX Polish Marketplace Tier-1 (Tokopedia, Shopee & Newegg Standard)
Status: ⏳ Siap Dikerjakan

### 1. Header & Top Announcement Bar
- [ ] Top Announcement Ticker Bar di atas navbar (Promo Kupon `TEKNOHUB10`, Info Bebas Ongkir se-Indonesia, dan Link Lacak Pesanan / Bantuan Cepat)
- [ ] Enhanced Navbar Search: Autocomplete dropdown dengan pencarian populer, riwayat pencarian, dan tag kategori terkait

### 2. Homepage High-Converting Sections
- [ ] Section Flash Sale / Promo Terbatas dengan Realtime Countdown Timer (Jam : Menit : Detik) dan Progress Bar Stok Terjual (misal: "🔥 Terjual 85% — Sisa 3 unit!")
- [ ] Carousel Brand Partners Resmi (Official Authorized Store: ASUS ROG, NVIDIA, Intel, AMD, Lenovo Legion, MSI, Corsair, Kingston, Samsung, Acer Predator)
- [ ] Tab Filter Rekomendasi Produk di Homepage ("🔥 Paling Laris", "⚡ Diskon Spesial", "⭐ Rating Tertinggi", "🆕 Baru Rilis")

### 3. Product Card Enhancement (Marketplace Standard)
- [ ] Badge Lokasi Pengiriman Toko (misal: "📍 Jakarta Pusat") di setiap kartu produk
- [ ] Social Proof Transaksi: Tampilan rating bintang + total terjual (misal: "⭐ 4.9 | Terjual 150+ unit")
- [ ] Badge "⚡ Bebas Ongkir" (hijau) dan "🛡️ Official Store" (ungu/emas) pada kartu produk
- [ ] Hover Quick Action "+ Keranjang Cepat" langsung dari kartu katalog tanpa harus membuka PDP

### 4. Product Detail Page (PDP) Sticky Buying Box & Seller Profile
- [ ] Desktop Sticky Buying Box di sisi kanan: Subtotal harga dinamis, pilihan varian ringkas, dan tombol CTA ganda (Tambah Keranjang & Beli Sekarang)
- [ ] Seller / Store Profile Card: "TeknoHub Official Flagship Store" (Rating Toko 4.9/5.0, 100% Pesanan Sukses, Respon Chat < 5 Menit)
- [ ] Estimasi Pengiriman & Simulator Paylater / Cicilan ringkas di PDP

### 5. Trust & Payment Logistics Footer
- [ ] Visual Logo Mitra Pembayaran Resmi (BCA, Mandiri, BNI, BRI, QRIS, GoPay, OVO, ShopeePay, Visa, Mastercard)
- [ ] Visual Logo Mitra Ekspedisi & Logistik (JNE Express, SiCepat, J&T, Anteraja, GoSend, GrabExpress)
- [ ] Badge Keamanan Transaksi (SSL 256-bit Encryption, 100% Garansi Uang Kembali, Jaminan Produk Original)

---

## FASE 8 — Modernisasi Marketplace, Trust UI/UX & AI Builder
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

### Batch 3: Performa, Sticky & Proteksi (Selesai)
- [x] Skeleton loader katalog (`ProductCardSkeleton`) dengan animate-pulse saat filter/fetch
- [x] Sticky purchase bar desktop (hidden mobile): thumbnail, judul, harga, + Keranjang
- [x] Checkout: spinner + nonaktif tombol "Bayar Sekarang" selama proses (anti double-submit)
- [x] Badge stok menipis "Sisa [x] unit!" (amber) di card & PDP saat stock <= 5

## FASE 9 — Back-Office Management & Operations
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
## FASE 10 — Security Hardening
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

## FASE 11 — Testing & QA
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

## FASE 12 — Mobile App (Expo React Native) 📱
Status: 🟡 Sebagian (Inisialisasi & Core App Selesai)

- [x] Init Expo React Native di `apps/mobile` (`package.json`, `app.json`, `tsconfig.json`)
- [x] Shared types package (`packages/shared`) untuk sinkronisasi antarmuka web dan mobile
- [x] Custom Bottom Tab Navigation (Home, Shop, Builder, Forum, Profile) dengan tema TeknoZone
- [x] Screen Views: Katalog E-Commerce, Asisten PC Builder AI, Forum Komunitas, dan Profil Pengguna
- [ ] Sinkronisasi auth token & Supabase client antara Web dan Mobile
- [ ] Halaman Katalog Produk & Keranjang Belanja Mobile
- [ ] Halaman AI PC Builder Mobile Wizard
- [ ] Forum Diskusi & Thread Viewer Mobile
- [ ] Integrasi Expo Push Notifications (Notifikasi Status Pesanan & Balasan Forum)
- [ ] Deep linking web ↔ mobile — Setup di fase rilis store
- [ ] Submit Google Play Store & Apple App Store

---

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
