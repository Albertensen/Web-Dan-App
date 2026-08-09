# Sistem Kerja Hermes + Gemma + Ruflo

Sistem kerja lengkap untuk membangun web dan aplikasi — sekali setup, dipakai selamanya.

## 3 Komponen

| Komponen | Peran |
|----------|-------|
| **Hermes** | Pemikir utama, orchestrator, keputusan penting |
| **Gemma 4 E4B** (via Ollama) | Juru tulis gratis, tugas ringan |
| **Ruflo** (333 tools via MCP) | Eksekutor semua perintah |

## 3 Pilar

| Pilar | Lokasi |
|-------|--------|
| 1. Workspace Lokal | `C:\Users\Administrator\dev-workspace\` |
| 2. GitHub | `https://github.com/Albertensen/Web-Dan-App.git` |
| 3. Obsidian SecondBrain | `C:\Users\Administrator\Documents\MY-WORKSPACE\SECONDBRAIN\PROJECT_WEB\` |

## File Penting

- `MASTER-INDEX.md` — penghubung 3 pilar
- `SIAP-PAKAI.md` — cheatsheet 1 halaman
- `WORKFLOW.md` — alur kerja harian + estimasi token
- `NEW-PROJECT.md` — checklist project baru
- `SESSION-START.md` — template briefing sesi
- `sync.bat` — sync ke GitHub sekali klik
- `.config/` — agents, models, token-rules, template prompt

## Cara Mulai Sesi Baru

1. Baca `SESSION-START.md`
2. Kirim isinya ke Hermes
3. Hermes baca konteks → langsung mulai coding
