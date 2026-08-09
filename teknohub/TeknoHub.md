# TeknoHub — Dokumentasi Proyek

Platform e-commerce + forum + AI PC Builder. Monorepo: `apps/web` (Next.js 14), `supabase/migrations`.

## Stack
- **Frontend**: Next.js 14, TailwindCSS, Zustand, TipTap
- **Backend**: Next.js API routes, Supabase (Postgres, Auth, Storage, Realtime)
- **AI**: Ollama lokal (Gemma 4 E4B), algoritma bottleneck + alokasi budget
- **Deploy**: Vercel (`teknohub-omega.vercel.app`), Supabase Cloud

## Fase Roadmap
| Fase | Status |
|---|---|
| 1 — Foundation | ✅ Selesai |
| 2 — E-Commerce | 🟢 Hampir tuntas (opsional: Algolia/OG-image; blokir: Midtrans akun) |
| 3 — Forum Tech & AI | ✅ Tuntas (Core + Komunitas) |
| 4 — PC Builder AI ⭐ | 🟢 In Progress |
| 5 — Mobile App | ⏳ Belum dimulai |
| 6 — Launch | ⏳ Belum dimulai |

## Fase 4 — Fitur AI Baru
- [ ] **Interactive AI PC Builder Chat + Live Summary Sync** (di `/builder`) — konsultasi rakit PC via chat, rekomendasi AI sinkron ke ringkasan build real-time
- [ ] **24/7 Global AI Customer Service (CS) Floating Widget** (seluruh web) — chatbot CS dengan knowledge base toko (lama rakit, garansi, pengiriman, pembayaran, status pesanan)

Detail lengkap: lihat `ROADMAP.md`.
