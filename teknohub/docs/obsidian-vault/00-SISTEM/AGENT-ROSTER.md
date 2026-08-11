# 🤖 Agent Roster — Siapa Mengerjakan Apa

## Hermes (Orchestrator)

**Model:** COMBO-UTAMA | **Tools:** Semua Ruflo tools | **Biaya:** Token berbayar

Gunakan untuk:
- Perencanaan dan arsitektur
- Keputusan tech stack
- Debug kompleks (setelah Gemma gagal 2x)
- Review kode sebelum deploy (file kritis)
- Membuat blueprint → pseudocode untuk didelegasikan ke Gemma
- Mengatur alur kerja dan delegasi

## Ornith 9B via Ollama

**Model:** ornith:9b | **URL:** http://localhost:11434 | **Biaya:** GRATIS

Gunakan untuk (lihat detail di ORNITH-RULES.md):
- Snippet Writer: fungsi/komponen pendek
- Commenter: tambah JSDoc
- Boilerplate Maker: duplikasi pola
- CSS Fixer: perbaikan Tailwind terisolasi
- Test Writer: unit test sederhana
- Agentic coding: SWE-bench 69.4, self-scaffolding (lebih kuat dari Gemma 4 E4B di tugas koding)

## Ruflo (333 Tools via MCP)

**Bridge:** http://127.0.0.1:3100/mcp | **Biaya:** GRATIS

Gunakan untuk:
- Buat/baca/tulis file
- Jalankan perintah terminal
- Git: add, commit, push, pull
- Install npm packages
- Start/stop server
- Screenshot halaman web

## Aturan Eskalasi

```
Tugas masuk
    ↓
Bisa dikerjakan Ruflo saja? → YA → Gunakan Ruflo (0 token)
    ↓ TIDAK
Bisa dikerjakan Ornith? → YA → Gunakan Ornith (gratis)
    ↓ TIDAK / Gemma gagal 2x
Gunakan Hermes (token berbayar)
```
