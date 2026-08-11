# 🖥️ TeknoHub Platform

## Info

| Field | Value |
|-------|-------|
| Repo | https://github.com/Albertensen/Web-Dan-App |
| Vercel | https://vercel.com/rebahan |
| Lokal | C:\Users\Administrator\dev-workspace\teknohub\ |
| Status | 🟡 Setup — Fase 1 |
| Mulai | 2026-08-09 |

## Deskripsi

Platform teknologi all-in-one:
- 🛒 E-Commerce elektronik
- 💬 Forum Tech & AI
- 🖥️ Jasa Rakit PC + AI Agent (harga real Tokopedia/Shopee)

## Fase Progress

- [x] Sistem kerja setup (Obsidian, workspace, GitHub)
- [ ] Fase 1 — Foundation (monorepo, schema, auth, Vercel)
- [ ] Fase 2 — E-Commerce
- [ ] Fase 3 — Forum
- [ ] Fase 4 — PC Builder AI ⭐
- [ ] Fase 5 — Mobile App
- [ ] Fase 6 — Launch

> Detail checklist lengkap ada di ROADMAP.md di GitHub repo.

## Next Actions (Fase 1)

- [x] Init monorepo teknohub/ di dev-workspace
- [x] Next.js 14 setup + homepage (dark theme, 3 hero card gradient glow)
- [x] SQL schema + migration (14 tabel + RLS + seed) — SUDAH RUN di Supabase
- [x] Push ke GitHub
- [x] Buat Supabase project (project ref `abulunzifndlvksdljuf`)
- [x] Connect ke Vercel (deployed: https://teknohub-omega.vercel.app)
- [x] Setup Google OAuth (NextAuth v4 + GoogleProvider aktif)

## Keputusan Teknis

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

## Stack

Next.js 14 · Expo RN · Supabase · Midtrans · Hermes AI · Playwright
