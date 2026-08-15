# Changelog

Semua perubahan penting proyek TeknoHub dicatat di sini.

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
