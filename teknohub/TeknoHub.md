# TeknoHub — Dokumentasi Proyek

Platform e-commerce + forum + AI PC Builder. Monorepo: `apps/web` (Next.js 14), `supabase/migrations`.

## Stack
- **Frontend**: Next.js 14, TailwindCSS, Zustand, TipTap
- **Design**: Tekno Zone — light Apple ice slate (#CBD5E1 bg, #F8FAFC card, navy #0B1F45 accent, #2563EB zone-blue), SF Pro/Inter, card rounded-[2.5rem]
- **Backend**: Next.js API routes, Supabase (Postgres, Auth, Storage, Realtime)

- **Auth**: NextAuth (Credentials + Google OAuth) → Supabase signInWithPassword; admin createUser utk seed
- **AI**: Ollama lokal (Gemma 4 E4B), algoritma bottleneck + alokasi budget
- **Deploy**: Vercel (`teknohub-web.vercel.app`), Supabase Cloud

## Fase Roadmap

| Fase | Status |
|---|---|
| 1 — Foundation | ✅ Selesai |
| 2 — Autentikasi & Profil | ✅ Tuntas (login/register/forgot/reset/profile, Google OAuth, middleware) |
| 3 — E-Commerce | 🟢 Hampir tuntas (sisa opsional: Algolia/OG-image; blokir: Midtrans akun) |
| 4 — Forum Tech & AI | ✅ Tuntas (Core + Komunitas) |
| 5 — PC Builder AI ⭐ | ✅ Tuntas (100%) |
| 6 — Responsive Design | ✅ Tuntas (2026-08-10, commit f9a7b2c) |
| 7 — Security Hardening | 🟡 Sebagian (headers, rate limit, sanitizer, auth audit) |
| 8 — Testing & QA | ⏳ Belum dimulai |
| 9 — Mobile App | ⏳ Belum dimulai (paling akhir) |
| 10 — Launch | ⏳ Belum dimulai |
