# Changelog

Semua perubahan penting proyek TeknoHub dicatat di sini.

## [Unreleased]

### Produk & PDP
- Added fallback ulasan terverifikasi (min 3) saat produk belum punya review asli.
- Added swipe kiri/kanan + thumbnail utk ganti foto galeri produk di mobile.
- Added sticky bottom buy bar mobile yang muncul saat scroll (+, Beli Sekarang), tak menutupi footer.
- Added tabel Spesifikasi Teknis (zebra striping) yang render dinamis dari kolom jsonb `specs`.
- Added tombol Bagikan / Copy Link dengan toast konfirmasi.
- Changed breadcrumb menjadi ber-link (Beranda / Produk / Kategori / Nama).
- Changed padding mobile PDP `pb-28 md:pb-12` agar buy bar tak menutupi konten.

### Builder & Keranjang
- Added progress bar estimasi konsumsi daya (Total Wattage vs Rekomendasi PSU) dengan status aman/peringatan.
- Fixed tombol Beli Semua Komponen agar pakai harga real dari rekomendasi AI.
- Added batas stok pada tombol "+" di keranjang (tak melebihi sediaan).

### Checkout
- Added layanan tambahan checkout: Jasa Rakit & Cable Management, Packing Kayu & Asuransi Ekstra (masuk ke grand total).
- Added redirect ke /shop/orders setelah pembayaran sukses (cart dikosongkan).

### Footer
- Redesigned trust badges jadi 2 kategori terpisah: Metode Pembayaran (QRIS, BCA, Mandiri, BNI, GoPay) dan Jasa Pengiriman (JNE, SiCepat, GoSend) dengan kartu seragam.

## [2026-08-16] — Fase 12: Modernisasi Marketplace, Trust UI/UX & AI Builder (Batch 1)

### Trust, UI Cleanup & Design System
- **Footer Resmi**: Ganti teks generator "Dibuat dengan AI Agent" menjadi link bantuan resmi (Syarat & Ketentuan, Kebijakan Privasi) plus status "Sistem Operasional 100% Aktif". (`609aca0`)
- **Forum Seed**: Hapus thread dummy "halo testing dulu" dan inisialisasi 3 thread kurasi resmi (Panduan Komponen Rendering/AI, Tips Hindari Bottleneck, Aturan Komunitas). (`939f038`)
- **Iconography → Lucide**: Refactor seluruh icon emoji UI (nav, kategori, trust badge, footer, admin, builder, profil) menjadi ikon vektor `lucide-react`. (`350fc99`)
- **ProductCard Standarisasi**: Dark-mode border (`slate-200/800`), hover lift, rating bintang `Star` lucide, format Rupiah `id-ID`. (`6d92b9d`)

### Core E-Commerce & Checkout
- **Global Search Bar**: Live search dropdown di header (produk + kategori terkait, loading, empty state, Esc/klik-luar tutup). (`5359cdf`)
- **Filter & Multi-Sorting**: Sidebar filter kategori + rentang harga di katalog, sort dropdown (terpopuler/harga/terbaru), sync ke URL query (`?category&min_price&sort`). (`c08b5e9`)
- **Quick Add-to-Cart & Wishlist**: Tombol "+ Keranjang" + Toast, wishlist icon (localStorage), badge diskon & harga coret, indikator stok. (`04b05eb`)
- **Modul Review Terverifikasi**: Rating summary + bar breakdown per bintang, filter bintang/foto, galeri unboxing lightbox, badge "Pembeli Terverifikasi", varian produk. (`260e016`, `48be331`, `e6a74fc`)
- **Checkout Flow**: Opsi kurir & layanan (JNE/SiCepat/GoSend) dengan estimasi hari + ongkir dinamis, metode bayar tab (QRIS/VA/E-Wallet/Kartu), simulasi QRIS & nomor VA, perhitungan Grand Total otomatis (subtotal+ongkir+biaya layanan), trust badges pembayaran/logistik di footer, dan form alamat terstruktur (penerima/telepon/full/provinsi/kota/kecamatan/kodepos). (`c592ab0`, `9701cba`)
- **AI Builder → Cart**: Tombol "Beli Semua Komponen" masukkan seluruh komponen rakitan aktif ke keranjang + toast + redirect /shop/cart; sticky mobile buy bar (+ Keranjang/Beli Sekarang) di detail produk; galeri thumbnail produk; CS floating button lingkaran jempol dengan ping + tooltip Chat CS. (`9701cba`)

### Infrastructure & Data
- **milestone**: Bucket storage `review-images` (public, image-only) + endpoint signed upload; migration `013` tambah kolom `is_verified`, `bought_variant`, `media` pada `product_reviews` (135 review reseed, 60 verified). (`48be331`, `e6a74fc`)

---

## [2026-08-16] — UI Overhaul Standar Marketplace Modern (Shopify & Google Design System)

### Added
- **Marketplace Product Card (`ProductCard.tsx`)**: Desain kartu produk ala e-commerce terkemuka dengan badge diskon hemat persentase, rating bintang 5-star, penanda produk original/garansi resmi, dan tombol aksi ganda.
- **Trust Badges Bar di Beranda**: Bar penjamin kepuasan belanja mencakup 100% Produk Asli, Pengiriman Cepat, Konsultasi AI Bebas Bottleneck 24/7, dan Komunitas Terpercaya.
- **Horizontal Category Carousel**: Pill filter kategori berikon di beranda untuk navigasi instan antar jenis komponen hardware.


## [2026-08-16] — Fase 9: Inisialisasi Mobile App (Expo React Native & Shared Types)

### Added
- **Monorepo Shared Package (`packages/shared`)**: Tipe TypeScript terpadu (`Product`, `PCComponent`, `UserOrder`, `ForumThread`, `UserProfile`) untuk sinkronisasi web dan mobile.
- **Mobile App (`apps/mobile`)**: Inisialisasi Expo React Native dengan orientasi portrait, tema TeknoZone navy (`#0B1F45`) & slate (`#CBD5E1`), serta custom bottom tab bar (Home, Shop, Builder, Forum, Profile).


## [2026-08-16] — Fase 8: Testing & QA Tuntas

### Added
- **Unit Test Runner (`scripts/test-unit.mjs`)**: Test suite mencakup validasi Zod (auth/checkout), HTML Sanitizer (XSS protection), dan Rate Limiter windowing.
- **Custom 404 Not Found Page (`app/not-found.tsx`)**: Desain bertema TeknoZone dengan tombol navigasi cepat ke beranda dan katalog produk.
- **Global Error Boundary (`app/error.tsx`)**: Fallback error UI yang aman saat terjadi runtime exception pada client component.


## [2026-08-16] — Fase 7: Security Hardening Tuntas

### Security & Hardening
- **HSTS Header (`next.config.mjs`)**: Menambahkan `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`) untuk mewajibkan enkripsi HTTPS.
- **Upload File Hardening (`/api/admin/upload`)**: Validasi whitelist ekstensi (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`), verifikasi MIME type server-side, dan proteksi anti-path-traversal (`..`, `%2e%2e`, slash injection).
- **Zod Input Boundary**: Seluruh endpoint transaksi, review produk, pembuatan akun, dan checkout telah divalidasi ketat dengan schema Zod.
- **Session & Auth Cookies**: Cookie sesi terkonfigurasi `httpOnly: true`, `secure: true` (produksi), dan proteksi brute force login 5 attempt/menit.


## [2026-08-16] — Pembagian Fitur Sisi User & Sisi Seller (Profile Tabs & Seller Portal)

### Added
- **Sisi User (`UserReviewsTab` + `/api/user/reviews`)**: Tab Ulasan Produk Saya di halaman profil dengan fitur edit rating bintang (1-5) dan ubah teks komentar ulasan secara instan.
- **Sisi User (`ProfileTabs`)**: Tab navigasi terpadu di `/user/profile` mencakup Pesanan Saya (rincian item, total belanja, kurir, nomor resi), Ulasan Saya, Aktivitas Forum, dan Edit Profil.
- **Sisi Seller (Seller Portal)**: Banner akses Seller Dashboard terintegrasi di halaman profil pengguna dan UserDropdown navbar.
- **Granular RBAC**: Pembagian hak akses yang rapi antara Super Admin (kelola PC builder, quotes AI, dan hak akses user) dengan pengelola toko/member (operasional pesanan, katalog produk, ulasan, dan moderasi).


## [2026-08-15] — Fase Admin Portal (Back-Office Management & Operations) Tuntas

### Added
- **Admin Shell & RBAC (`lib/admin-auth.ts`, `AdminLayout`, `AdminSidebar`, `AdminHeader`)**: Server-side guard verifikasi role (`admin`/`moderator`), dedicated sidebar kolapsibel, dan top status bar.
- **Admin Dashboard (`/admin`)**: KPI cards (Revenue, Pesanan Aktif, Quote Pending, Laporan Forum), grafik tren transaksi 7 hari, alert stok kritis, dan feed aktivitas terbaru.
- **Manajemen Pesanan (`/admin/orders` + API `/api/admin/orders`)**: Tabel filter status pesanan (pending/paid/processing/shipped/delivered/cancelled), modal detail item & alamat, input kurir/nomor resi pengiriman, dan update status.
- **Penyempurnaan Manajemen Produk (`/admin/products`)**: Modal Edit Produk, toggle status `is_active` (soft delete), quick inline stock edit (+/-), search & kategori filter.
- **Manajemen Komponen PC & Scraper (`/admin/components` + API `/api/admin/components/scrape`)**: Database 34+ komponen, mapping URL Tokopedia/Shopee, update harga manual, dan tombol manual trigger scraper.
- **Moderasi Ulasan Produk (`/admin/reviews` + API `/api/admin/reviews`)**: Filter rating 1-5 bintang, hapus ulasan spam/toxic, link langsung ke halaman produk.
- **Manajemen Pengguna & Role (`/admin/users` + API `/api/admin/users`)**: Directory pengguna, ubah role inline (Member ↔ Moderator ↔ Admin), modal sanksi Ban/Suspend (3, 7, 30 hari, permanen) dan Unban.
- **Penyempurnaan Penawaran Rakit PC (`/admin/quotes`)**: Konversi penawaran yang diterima menjadi pesanan resmi di tabel `orders` & `order_items`, editor harga final, dan download PDF invoice.


## [2026-08-15] — Auth UI Overhaul & Perbaikan OAuth/Avatar

### Added
- AuthSlider split-screen: panel biru ajakan + form putih, tinggi kartu tetap (min-h 840 mobile / 720 desktop), tanpa elemen bertumpuk
- Logo TeknoZone clickable (Link ke `/`) di panel biru halaman login/register
- Skeleton tombol Masuk/Daftar presisi (2 pill 64×30) — cegah layout shift saat session loading
- Avatar fallback inisial 2 huruf (mis. "AE" dari "Albert Ensen") — lingkaran navy rapi saat foto gagal/tidak tersedia

### Changed
- Foto profil Google kini tersimpan di JWT dan direstore ke session (`jwt`/`session` callback) — avatar tampil setelah login OAuth
- Tautan ganda "Belum/Sudah punya akun?" dihapus dari bawah form; aksi pindah form via tombol panel biru
- MobileDrawer: avatar bulat object-cover + fallback inisial

### Fixed
- Google OAuth `redirect_uri_mismatch`: NEXTAUTH_URL Vercel dikoreksi ke `https://teknohub-web.vercel.app` (sebelumnya `http://localhost:3000`)
- Kredensial Google OAuth diperbarui (client ID/secret baru) — client lama tidak ditemukan di Google Cloud
- Avatar desktop & mobile: wrapper square 32×32 `shrink-0 overflow-hidden` + `object-cover`, tanpa distorsi
- Vercel sensitive env: PATCH tidak mengubah value — perlu delete + re-create via CLI


## [2026-08-15] — Fase 6D Tuntas (UI Overhaul & Polish)

### Added
- Related products section di halaman detail produk (4 produk kategori sama)
- Product image fallback premium: gradient + ikon SVG per kategori (laptop, smartphone, monitor, gpu, cpu, ram, storage) — komponen `ProductImage`, dipakai ProductCard + detail
- Forum empty state: ikon ilustrasi + CTA "Buat Thread Pertama"


## [2026-08-15] — UI Kontras, Fix Path Produk & Integrasi Keranjang

### Fixed
- Fix 404 detail produk: link katalog `/products/[slug]` → `/shop/products/[slug]` (regresi sejak refactor route group `(main)/shop`). Diperbaiki di ProductCard, cart page, filter kategori home, NavbarSearch
- Fix marketplace kosong "Produk belum tersedia" di prod: `NEXT_PUBLIC_APP_URL` env Vercel masih menunjuk `teknohub-omega` (sudah dihapus/404) → diganti `https://teknohub-web.vercel.app`

### Changed (Audit Kontras Global)
- `--color-accent` `#d4f9e0` (pistachio terang, kontras 1.3:1) → `#0B1F45` (navy, 12.6:1) — mempengaruhi 31 tombol utama (Masuk/Daftar, Beli, cart, checkout, forum, builder, admin)
- Badge stok detail produk: solid `bg-green-200` + `text-green-900` bold + `border-2 border-green-800` (sebelumnya transparan `green-600/20` + `text-green-300` kontras 1.6:1)
- Badge stok rendah: solid `bg-yellow-200` + `text-yellow-900` bold
- Tier Gold forum: `bg-amber-500` → `bg-amber-700` + putih (4.8:1)
- Status pesanan (pending/paid/delivered/cancelled): `text-*300` → `text-*700` di latar 20% (4.5:1)
- Error forms (23 file): `text-red-400` → `text-red-600` di latar terang
- Stok rendah admin: `text-amber-400` → `text-amber-700`
- Navbar & SlideNav: solid `bg-background` (hilang `backdrop-blur` + opacity `/80` `/95`) — mencegah banner gelap tembus saat scroll

### Added
- Integrasi keranjang terverifikasi end-to-end: klik "Tambah ke Keranjang" di `/shop/products/[slug]` → item masuk `teknohub-cart` (localStorage zustand persist), tampil di `/shop/cart` (nama, harga, qty stepper, total), badge navbar live update

## [2026-08-10] — Builder AI ↔ Build Summary Sync ↔ Build Summary Sync

### Fixed
- AI Chat recommendation sekarang ter-sync otomatis ke Build Summary
- User konfirmasi "ok/setuju" → Build Summary langsung terupdate
- Card rekomendasi muncul di chat bubble dengan tombol Terapkan/Lewati
- Quote/penawaran otomatis menggunakan Build Summary sebagai basis data

## [2026-08-10] — Fase 6D: UI Overhaul

### Added
- PC Builder: 3D visual experience (NeonGrid, FloatingBars, ParticleField, wizard glow cards)
- Homepage: stats section (produk real count) + kategori filter lengkap (8 kategori)
- Empty states: Cart, Orders dengan ilustrasi dan CTA

### Fixed
- Navbar: link /builder-3d → /builder konsisten di semua tempat
- Navbar: tambah "PC Builder" di desktop nav
- Footer: perbaiki copyright text

## [2026-08-09] — Fase 6A & 6B: Responsive Design + Security

### Added
- Mobile navbar dengan hamburger drawer (MobileDrawer slide-in + overlay backdrop)
- Product grid responsive (2→3→4 kolom), lazy loading gambar produk
- Forum kategori pills horizontal scroll di mobile
- Admin table: horizontal scroll + sticky first column
- HTTP Security Headers (CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy)
- Rate limiting: auth register (5/min), forum threads (10/min), support chat (20/min), pc-builder chat (15/min)
- Input sanitizer (whitelist HTML) untuk TipTap output — threads & replies
- API auth audit: semua route sensitif punya getServerSession + role check (admin/moderator)

### Notes
- npm audit: 5 high vuln (glob via eslint-config-next, postcss via next) — butuh next@16 major bump (breaking), di-skip; di-track di ROADMAP
- Rate limiter in-memory Map: bekerja penuh di single-instance (dev/lokal), tapi Vercel serverless Hobby bisa beda instance per request → rate limit tidak ketat di prod. Upgrade: Upstash Redis (`@upstash/ratelimit`) utk shared state. Checkbox rate limiting tetap dicentang (implementasi ada), catatan di ROADMAP

## [2026-08-09] — Fase 6A & 6B: Responsive Design + Security (docs)

### Added
- ROADMAP: Fase 6A Responsive Design (Mobile-First) — 26 item (navbar drawer, grid responsive, forum/builder/admin mobile, assets)
- ROADMAP: Fase 6B Security Hardening — 30 item (headers, rate limit, sanitization, RLS audit, env/secrets audit, npm audit)

## [2026-08-09] — Fase 1B: Autentikasi & Profil Pengguna

### Added
- Halaman /login — split layout premium (branding TeknoZone kiri + form kanan), validasi Zod, toggle show/hide password, Google OAuth, link lupa password & daftar
- Halaman /register — form username/email/password/konfirmasi, password strength bar, checkbox T&C, Google OAuth, auto-login setelah daftar
- Halaman /forgot-password & /reset-password — Supabase Auth flow (resetPasswordForEmail + setSession token)
- Halaman /profile — header avatar + badge tier, statistik (pesanan/build/thread/reputasi), edit profil (username + bio)
- API /api/auth/register (Supabase admin createUser) & /api/user/profile (GET + PATCH)
- Navbar auth state — UserDropdown (Profil/Pesanan/Keranjang/Keluar) setelah login, tombol Masuk/Daftar saat logout
- Middleware proteksi route /cart, /checkout, /profile, /orders → redirect /login?callbackUrl=
- NextAuth CredentialsProvider — login email/password via Supabase signInWithPassword
- Seed user auth via admin client (service role) — admin@teknohub.id + 13 user review (silver1-9, gold1-3, diamond1)

### Fixed
- Register API validasi manual (zod full schema menolak payload tanpa terms)
- Review re-seed (135) ke user id GoTrue baru setelah auth.users SQL insert dihapus
- Reputasi tier di-set ulang via migration 010b (update by username)

## [2026-08-09] — Apple Store Product Cards (Tekno Zone Marketplace)

### Changed
- ProductCard ala Apple Store: gambar full atas `rounded-[1.5rem]`, **hover zoom** `group-hover:scale-110` (500ms ease-out), gradient overlay
- Kategori + nama + deskripsi singkat (line-clamp-2) + harga + 2 tombol pill berdampingan (Detail outline / Beli navy, `rounded-full`)
- Homepage: grid 4 kolom (8 produk unggulan), judul "Katalog Produk Unggulan"
- Struktur dipertahankan: marketplace direct view (tanpa hero), SlideNav slide-to-forum, `/builder-3d` terpisah
- Palet konsisten: iceBg #CBD5E1 / cardClean #F8FAFC + border-slate-300 / chromeAccent #0B1F45

## [2026-08-09] — Marketplace Front-View & Slide-to-Forum (Tekno Zone)

### Changed
- Homepage: hero dihapus → **marketplace direct view** (grid produk kompak 2-5 kolom, fetch real dari `/api/products`)
- **Slide nav** sticky di bawah header: Marketplace & Store / Forum Komunitas & Reputasi (anchor slide) / AI 3D PC Builder (halaman terpisah)
- Search bar pill + filter kategori pills langsung terlihat di atas halaman utama
- AI PC Builder section dipisah ke halaman `/builder-3d` (placeholder 3D exploded view, Three.js di masa depan)
- Navbar: search pill lebar, tombol AI 3D Builder, avatar, menu ramping (Store/Forum)
- Konsistensi warna: iceBg #CBD5E1, cardClean #F8FAFC + border-slate-300, chromeAccent #0B1F45

## [2026-08-09] — Tekno Zone Rebrand (Apple-inspired Ice Slate & Midnight Navy)

### Changed
- Brand: TeknoHub → **Tekno Zone** (light-first, Apple minimalist aesthetic)
- Design tokens: iceBg `#CBD5E1` background, cardClean `#F8FAFC` cards, chromeAccent `#0B1F45` navy buttons/accents, techDark `#0F172A` text, subGray `#334155` muted
- Typography: SF Pro Display/Inter stack, `-0.015em` tracking, bold tight headings
- Homepage: hero "Inovasi di setiap komponen pilihan", Store 3 featured (Ultrabook/AI Engine Station/Peripherals), AI Builder dark consultation panel, Forum reputation tiers (Silver/Gold/Diamond anti-fake review) + Verified Evidence
- Navbar: transparent backdrop-blur-xl, navy dot logo, Store/AI PC Builder/Forum menu
- ProductCard/ThreadCard: clean surface cards, rounded-[2.5rem], navy accents

## [2026-08-09] — Design System Upgrade (awesome-design-md Shopify)

### Changed
- Implementasi DESIGN.md dari getdesign.md (Shopify: cinematic dark, neon green accent, monumental typography)
- Design token system: CSS Custom Properties di globals.css
- Tailwind extend: custom colors, shadows glow, keyframes fadeInUp/glowPulse/shimmer/cardLift
- Redesign: Homepage hero monumental, Navbar glassmorphism, ProductCard premium, ThreadCard, Builder UI
- Semua komponen menggunakan CSS variables — zero hardcoded colors

## [2026-08-09] — Fase 4: PC Builder AI 100% + Fitur AI

### Added
- Interactive AI PC Builder Chat + Live Summary Sync (di /builder)
- 24/7 Global AI Customer Service (CS) Floating Widget (seluruh web)
- Quote System (request penawaran, admin review, invoice PDF)
- Camofox anti-detect scraper (Tokopedia + Shopee) + cron update harga
