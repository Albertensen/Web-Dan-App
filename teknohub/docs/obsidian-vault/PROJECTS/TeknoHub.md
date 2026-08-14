# 🖥️ TeknoHub Platform

## Info

| Field | Value |
|-------|-------|
| Repo | https://github.com/Albertensen/Web-Dan-App |
| Vercel | https://vercel.com/rebahan |
| Deploy | https://teknohub-web.vercel.app |
| Lokal (Linux) | /home/myhomeai/TEKNOHUB |
| Status | 🔵 Aktif |
| Mulai | 2026-08-09 |

## Deskripsi

Platform teknologi all-in-one:
- 🛒 E-Commerce elektronik
- 💬 Forum Tech & AI
- 🖥️ Jasa Rakit PC + AI Agent (harga real Tokopedia/Shopee)

## Fase Progress (detail: teknohub/ROADMAP.md — sumber kebenaran)

- [x] Fase 1 — Foundation (monorepo, schema, auth, Vercel)
- [x] Fase 2 — Autentikasi & Akun Pengguna
- [x] Fase 3 — E-Commerce (sisa opsional: Algolia, OG-image; blokir: akun Midtrans)
- [x] Fase 4 — Forum Tech & AI
- [x] Fase 5 — PC Builder AI ⭐
- [x] Fase 6 — Responsive Design
- [~] Fase 6D — UI Overhaul & Polish (sisa: related products, breadcrumb, forum empty state)
- [~] Fase 7 — Security Hardening (sebagian)
- [ ] Fase 8 — Testing & QA
- [ ] Fase 9 — Mobile App (Expo)
- [ ] Fase 10 — Launch

## Keputusan Teknis

| Keputusan | Pilihan | Alasan |
|-----------|---------|--------|
| Frontend web | Next.js 14 App Router | SSR, SEO, file-based routing |
| Mobile | Expo React Native | 1 codebase → Android + iOS |
| Database | Supabase PostgreSQL | Auth + Realtime + Storage built-in |
| Payment | Midtrans | Payment gateway Indonesia terpopuler |
| Scraping | Camofox + Playwright fallback | Handle SPA/JS-rendered pages |
| AI Agent | Agent utama (planning) + Ornith 9B (coding gratis) | Hemat token |
| Repo struktur | Monorepo (turborepo) | Share types antara web dan mobile |
| Auth | NextAuth + Supabase | OAuth Google + email |
| Styling | Tailwind + DESIGN-RULES (Tekno Zone) | Konsisten |
| State | Zustand | Ringan, tidak boilerplate |

## Stack

Next.js 14 · Expo RN · Supabase · Midtrans · Ornith 9B · Camofox/Playwright
