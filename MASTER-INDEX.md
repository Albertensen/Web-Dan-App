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

## Cara Sync ke GitHub

- Manual: `git add <file-spesifik> && git commit -m "pesan" && git pull --rebase && git push`
- Update ROADMAP.md / CHANGELOG.md setiap fitur selesai (aturan triple-sync)
- JANGAN `git add -A` / `git add .` — bisa menyapu perubahan agent lain
