# TeknoHub — Dokumentasi Proyek

Platform e-commerce + forum + AI PC Builder. Monorepo: `apps/web` (Next.js 14), `supabase/migrations`.

## Stack
- **Frontend**: Next.js 14, TailwindCSS, Zustand, TipTap
- **Design**: Tekno Zone — light Apple ice slate (#CBD5E1 bg, #F8FAFC card, navy #0B1F45 accent, #2563EB zone-blue), SF Pro/Inter, card rounded-[2.5rem]
- **Backend**: Next.js API routes, Supabase (Postgres, Auth, Storage, Realtime)
- **Auth**: NextAuth (Credentials + Google OAuth) → Supabase signInWithPassword; admin createUser utk seed
- **AI**: Ollama lokal (Gemma 4 E4B), algoritma bottleneck + alokasi budget
- **Deploy**: Vercel (`teknohub-omega.vercel.app`), Supabase Cloud

## Fase Roadmap
| Fase | Status |
|---|---|
| 1 — Foundation | ✅ Selesai |
| 2 — E-Commerce | 🟢 Hampir tuntas (opsional: Algolia/OG-image; blokir: Midtrans akun) |
| 3 — Forum Tech & AI | ✅ Tuntas (Core + Komunitas) |
| 1B — Autentikasi & Profil | ✅ Tuntas (login/register/forgot-password/reset/profile, Google OAuth, middleware proteksi) |
| 4 — PC Builder AI ⭐ | ✅ Tuntas (100%) |
| 6A — Responsive Design | 🟢 Sebagian (navbar drawer, grid responsive, forum pills, admin table, lazy img) |
| 6B — Security Hardening | 🟢 Sebagian (headers, rate limit in-memory, sanitizer, auth audit) |
| 5 — Mobile App | ⏳ Belum dimulai |
| 6 — Launch | ⏳ Belum dimulai |

## Fase 4 — Fitur AI
- [x] **Interactive AI PC Builder Chat + Live Summary Sync** (di `/builder`) — konsultasi rakit PC via chat, rekomendasi AI sinkron ke ringkasan build real-time
- [x] **24/7 Global AI Customer Service (CS) Floating Widget** (seluruh web) — chatbot CS dengan knowledge base toko (lama rakit, garansi, pengiriman, pembayaran, status pesanan)
- [x] **Quote System** — request penawaran, admin review, invoice PDF
- [x] **Camofox anti-detect scraper** — Tokopedia + Shopee (harga + marketplace_url), cron daily

## Fase 1B — Autentikasi & Akun Pengguna
- [x] Login/register (split layout premium, zod, strength bar, Google OAuth)
- [x] Forgot & reset password (Supabase resetPasswordForEmail + setSession)
- [x] Profil user (header tier, statistik, edit username/bio via /api/user/profile)
- [x] Middleware proteksi /cart /checkout /profile /orders → /login?callbackUrl
- [x] UserDropdown di Navbar; seed user via admin client (admin@teknohub.id / Admin123!)

## Fase 6A — Responsive Design (sebagian)
- [x] Navbar mobile: hamburger + MobileDrawer slide-in + overlay
- [x] Product grid 2→3→4 kolom; lazy loading img
- [x] Forum kategori pills horizontal scroll; admin table sticky first column
- [ ] Sisa: footer stack, product detail/cart/checkout mobile, builder wizard 1 kolom, next/image, font subset

## Fase 6B — Security Hardening (sebagian)
- [x] HTTP headers (CSP, X-Frame DENY, nosniff, Referrer-Policy, Permissions-Policy)
- [x] Rate limit in-memory: auth 5/min, forum 10/min, support 20/min, pc-builder 15/min (catatan: Vercel serverless → Upstash Redis utk ketat di prod)
- [x] Sanitizer HTML whitelist (threads & replies); auth audit semua route
- [ ] Sisa: npm audit fix (butuh next@16 major), RLS audit penuh, rotate key, file upload MIME check

## Catatan Sesi
- **2026-08-09**: Fase 1B tuntas + Fase 6A/6B sebagian (commit a183ba6, 98b39c5, 0ab97ca, d0163e6). User offline besok — lanjut dari sisa checklist ROADMAP.

Detail lengkap: lihat `ROADMAP.md`.
