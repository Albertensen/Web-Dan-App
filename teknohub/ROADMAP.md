# 🗺️ TeknoHub — Roadmap

> Sumber kebenaran: `PROJECTS/TeknoHub.md` di Obsidian (mirror file ini).
> Status: 🔵 Aktif | 🟡 Setup | 🟢 Live | ⏸️ Pause | ✅ Selesai

## Fase 0 — Sistem Kerja ✅

- [x] Obsidian vault PROJECT_WEB (PATHS, rules, templates)
- [x] Workspace `dev-workspace/` + file sistem (3 pilar)
- [x] GitHub repo Web-Dan-App + sync.bat
- [x] Bridge MCP Hermes⇄Ruflo (333 tools)

## Fase 1 — Foundation 🟡

### Monorepo
- [x] Init monorepo teknohub/ (Turbo: apps/* + packages/*)
- [x] Next.js 14 setup (App Router, TS strict, Tailwind)
- [x] Homepage profesional + semua route (products, forum, pc-builds, profile, login, register)
- [x] next.config.mjs, vercel.json, .env.example, turbo.json

### Database (Supabase/PostgreSQL)
- [x] schema.sql: profiles, products, forum (categories/threads/replies), pc_builds + trigger + seed
- [ ] Buat Supabase project (manual di browser)
- [ ] Jalankan schema.sql di Supabase SQL Editor
- [ ] Setup Row Level Security (RLS) policies

### Auth
- [ ] Supabase Auth (email + Google OAuth)
- [ ] Setup Google OAuth credentials (manual di browser)
- [ ] Middleware proteksi route (profile, admin)

### Deploy
- [ ] Connect repo ke Vercel (manual di browser)
- [ ] Env vars di Vercel (Supabase URL, keys)
- [ ] Production deploy pertama

## Fase 2 — E-Commerce 🛒

- [ ] Katalog produk dinamis dari DB (filter kategori, search)
- [ ] Halaman detail produk (spesifikasi, harga, gambar)
- [ ] Keranjang + checkout
- [ ] Integrasi Midtrans (payment gateway)
- [ ] Dashboard admin (CRUD produk, order)

## Fase 3 — Forum 💬

- [ ] Thread forum + balasan (real-time via Supabase Realtime)
- [ ] Kategori + pin + lock
- [ ] Upvote/reputation pengguna
- [ ] Markdown editor + upload gambar

## Fase 4 — PC Builder AI ⭐

- [ ] Wizard rakitan PC (pilih part per kategori)
- [ ] Harga real dari Tokopedia/Shopee (scraping/API)
- [ ] Kompatibilitas part (socket, PSU watt, case size)
- [ ] AI Agent rekomendasi build (Hermes/Gemma via API)
- [ ] Simpan + share build publik

## Fase 5 — Mobile App 📱

- [ ] Expo React Native app
- [ ] Reuse API dari web (monorepo packages)
- [ ] Push notification (order, reply forum)

## Fase 6 — Launch 🚀

- [ ] SEO + OG tags lengkap
- [ ] Analytics (Vercel Analytics / GA4)
- [ ] UAT + fix bug
- [ ] Beta publik → launch

---

## Catatan Teknis

- Monorepo: `apps/web` (Next.js 14), `apps/mobile` (Expo), `packages/*` (shared)
- DB: PostgreSQL via Supabase (schema.sql siap)
- Payment: Midtrans (Snap API)
- AI: Hermes (orchestrator) + Gemma 4 E4B (tugas ringan, gratis via Ollama)
- Scraping harga: Playwright (bagian dari stack)
