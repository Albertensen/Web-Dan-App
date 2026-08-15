# Master Index — Sistem Kerja Agent + Ornith + Ruflo

## Lokasi Sistem

- Workspace Lokal : /home/myhomeai/TEKNOHUB (repo git, branch main)
- Salinan kerja   : /home/myhomeai/Documents/New Teknohub (tanpa .git, mirror)
- GitHub Repo     : https://github.com/Albertensen/Web-Dan-App

## File yang Wajib Dibaca di Awal Sesi

1. [Local] teknohub/ROADMAP.md → status fase & checklist project (sumber kebenaran)
2. [Local] teknohub/CHANGELOG.md → riwayat perubahan per fase
3. [Local] teknohub/TeknoHub.md → ringkasan project & keputusan teknis
4. [Local] teknohub/docs/obsidian-vault/00-SISTEM/ → aturan agent, desain, path

## Cara Mulai Sesi Baru

1. Baca ROADMAP.md + CHANGELOG.md + TeknoHub.md
2. Cek git status (repo /home/myhomeai/TEKNOHUB)
3. Mulai dari next action di ROADMAP.md

## Hybrid Agent Workflow (Hemat Token Utama)

Delegasikan tugas repetitif/terisolasi ke sub-agent lokal Ollama (ornith:9b) via modul `ollama_agent/`.

**Panggil dari Python:**
```python
import sys; sys.path.insert(0, "/home/myhomeai/TEKNOHUB")
import ollama_agent
hasil = ollama_agent.run("prompt...")   # ~50 detik per call
```

**CLI:**
```bash
python -m ollama_agent "prompt"
python -m ollama_agent --file input.txt
```

**Tugas yang Didelegasikan ke Ornith 9B:**
- Mock data JSON (katalog produk, ulasan, data forum)
- SEO on-page: draf meta title/description, OpenGraph, deskripsi produk
- Fungsi utilitas & validasi form sederhana (email, telepon, password)
- Dokumentasi & konfigurasi: .env.example, ringkasan fungsi, komentar kode

**Wajib: validasi hasil sebelum integrasi** — cek sintaks + `npx tsc --noEmit` di `teknohub/apps/web` agar lolos build. Ornith = penulis draft, Prime Agent = reviewer/pengintegrasi.

## Cara Sync ke GitHub

- Manual: `git add <file-spesifik> && git commit -m "pesan" && git pull --rebase && git push`
- Update ROADMAP.md / CHANGELOG.md setiap fitur selesai (aturan triple-sync)
- JANGAN `git add -A` / `git add .` — bisa menyapu perubahan agent lain
