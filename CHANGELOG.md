# Changelog

> Semua perubahan penting di repo Web-Dan-App dicatat di sini.
> Format: [Tanggal] — deskripsi (commit hash)

## [2026-08-12] — Sync & Update Docs (pindah PC Windows → Linux)

- `feat(builder): sync AI chat recommendation → Build Summary` (`0a977fd`)
- `fix(builder-chat): suggestion button stale closure` (`65c60c4`)
- `feat(ui): PC Builder 3D visual, homepage forum preview, stats, navbar fixes, empty states` (`3084afe`)
- `feat: integrate Shopify DESIGN.md tokens into globals.css` (`35f3e76`)
- `fix: Fase 7 Security Hardening — rate limit middleware, auth cookies, upload validasi, RLS exploit patch` (`6d83db9`)
- `fix(navbar): tombol Masuk/Daftar mobile + fix middleware route-key rate limit` (`04d1106`)
- `chore: restore struktur repo asli + ganti model LLM → ornith:9b` (`08cd8d7`)
- Update docs: MASTER-INDEX, WORKFLOW, PATHS (path Linux), vault PROJECTS/TeknoHub (status aktual), SETUP-BARU (fragmen rusak)

## [2026-08-10] — Builder AI Sync + Fase 6D UI Overhaul

### Added
- AI Chat recommendation sync otomatis ke Build Summary (konfirmasi "ok/setuju")
- PC Builder: 3D visual experience (NeonGrid, FloatingBars, ParticleField)
- Homepage: stats section + kategori filter lengkap (8 kategori)
- Empty states: Cart, Orders

### Fixed
- Navbar: link /builder-3d → /builder konsisten
- Footer copyright text

## [2026-08-09] — Fase 6A & 6B: Responsive + Security

### Added
- Mobile navbar hamburger drawer, product grid responsive, admin table scroll
- HTTP Security Headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy)
- Rate limiting: auth (5/min), forum (10/min), support chat (20/min), pc-builder (15/min)
- Input sanitizer whitelist HTML utk TipTap
- API auth audit: getServerSession + role check semua route sensitif

### Notes
- npm audit: 5 high vuln (butuh next major bump) — di-track di ROADMAP
- Rate limiter in-memory: cukup utk dev; prod Vercel → Upstash Redis

## [2026-08-09] — Fase 1B: Autentikasi & Profil

### Added
- /login, /register (Zod + strength bar + Google OAuth), /forgot-password, /reset-password
- /profile (avatar, badge tier, statistik, edit username/bio)
- API /api/auth/register + /api/user/profile
- Middleware proteksi /cart /checkout /profile /orders
- NextAuth CredentialsProvider via Supabase signInWithPassword
- Seed admin + 13 user review (silver1-9, gold1-3, diamond1)

### Fixed
- Register API validasi manual
- Review re-seed (135) ke user GoTrue baru
- Reputasi tier reset via migration 010b

## [2026-08-09] — Apple Store Product Cards + Tekno Zone Rebrand

### Changed
- ProductCard ala Apple Store (hover zoom, rounded-[1.5rem])
- Homepage: marketplace direct view + SlideNav slide-to-forum
- Rebrand: TeknoHub → Tekno Zone (iceBg #CBD5E1, cardClean #F8FAFC, chromeAccent #0B1F45)
- Design System: DESIGN.md Shopify tokens (CSS custom properties, glow, typography)

## [2026-08-09] — Fase 4: PC Builder AI 100%

### Added
- Interactive AI PC Builder Chat + Live Summary Sync (/builder)
- 24/7 AI Customer Service Floating Widget (seluruh web)
- Quote System (request, admin review, invoice PDF)
- Camofox anti-detect scraper (Tokopedia + Shopee) + cron update harga
- Database komponen (34 komponen, migration 004) + price history
- API GET /api/components + Vercel Cron harian

## [2026-08-09] — Fase 2 E-Commerce + Fase 3 Forum

### Added
- Seed 15 produk (6 kategori) via migration 003
- API /api/products filter + search, ProductCard, cart (Zustand persist)
- CheckoutForm (Zod, kurir, Midtrans Snap inject), API checkout, webhook Midtrans
- Migration 004: thread_details view + reputation triggers
- API /api/forum/threads, ThreadCard, VoteControl, forum home + detail

## [2026-08-09] — Fase 1: Foundation Setup

### Added
- Monorepo teknohub/ (Next.js 14 App Router, Turbo)
- Homepage dark theme 3 hero card
- SQL schema 13 tabel + indexes + RLS + seed (migration 001-002)
- .env.example, turbo.json, next.config.mjs, vercel.json

### Status Checklist
- [x] Init monorepo, homepage, schema, dev jalan, push GitHub

## [2026-08-09] — Fase 0: Sistem Kerja

- `feat: setup sistem kerja` (`75999f3`) — workspace, README, MASTER-INDEX, SIAP-PAKAI, WORKFLOW
- `feat(teknohub): Next.js 14 monorepo` (`4999fe9`)
- `docs: ROADMAP.md` (`624b20b`, `780d4d1`)
