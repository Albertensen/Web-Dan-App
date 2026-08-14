# 📍 Path & Lokasi Penting

> File ini adalah referensi utama. Baca di awal setiap sesi.

## Workspace & Project

| Nama | Path / URL |
|------|-----------|
| Repo Git (utama) | /home/myhomeai/TEKNOHUB |
| Salinan Kerja | /home/myhomeai/Documents/New Teknohub (mirror tanpa .git) |
| Second Brain Vault | /home/myhomeai/Documents/secondbrain |
| GitHub Repo | https://github.com/Albertensen/Web-Dan-App.git |
| Vercel Dashboard | https://vercel.com/rebahan |
| Deploy (PROD) | https://teknohub-web.vercel.app (project aktif, git-integrated) |

## Service & AI

| Nama | URL / Path |
|------|-----------|
| Ollama (Ornith 9B) | http://localhost:11434/v1 |
| Ruflo MCP Bridge | http://127.0.0.1:3100/mcp |
| TeknoHub Dev | http://localhost:3001 (next dev — port 3000 dipakai whatsapp-bridge) |
| Ruflo Install | ~/ruflo/mcp-bridge (systemd: ruflo-mcp-bridge.service) |

## Catatan Port (verified 2026-08-15)

- TeknoHub dev server: http://localhost:3001 (bukan 3000)
- Port 3000: whatsapp-bridge (bukan TeknoHub)
- Port 20128: next-server v16 — kemungkinan hermes agent, bukan TeknoHub
- Port 11434: Ollama (model ornith:9b)
- Port 3100: Ruflo MCP bridge

## Deploy (Vercel) — verified 2026-08-15

- Project aktif: `teknohub-web` (prj_rMXAVyOxR7EcGeXJ3As4Ku4LliGW)
- Git integration: TERHUBUNG ke repo `Albertensen/Web-Dan-App`, production branch `main`
  → setiap `git push` ke main auto-deploy ke https://teknohub-web.vercel.app
- Fallback manual: `cd teknohub/apps/web && npx vercel --prod` (butuh token di ~/.local/share/com.vercel.cli/auth.json)
- Project LAMA `teknohub` (teknohub-web.vercel.app) sudah DIHAPUS 2026-08-15 — URL mati (404)
- JANGAN pakai URL omega — selalu teknohub-web

## Node.js

```bash
node -v  # v22+ (repo pakai npm@10.5.0, packageManager di package.json)
```

## Script Sync GitHub

```bash
cd /home/myhomeai/TEKNOHUB
git status
git add <file-spesifik>
git commit -m "pesan"
git pull --rebase && git push
```

## Catatan

- Repo lama Windows: C:\Users\Administrator\dev-workspace\ (pindah ke Linux 2026-08-12)
- Hermes API lama (COMBO-UTAMA) : http://localhost:20128/v1 — tidak dipakai lagi
