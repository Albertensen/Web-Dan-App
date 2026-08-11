# 📍 Path & Lokasi Penting

> File ini adalah referensi utama. Baca di awal setiap sesi.

## Workspace & Project

| Nama | Path / URL |
|------|-----------|
| Workspace Lokal | C:\Users\Administrator\dev-workspace\ |
| Project TeknoHub | C:\Users\Administrator\dev-workspace\teknohub\ |
| Obsidian Vault | C:\Users\Administrator\Documents\MY-WORKSPACE\SECONDBRAIN\PROJECT_WEB\ |
| GitHub Repo | https://github.com/Albertensen/Web-Dan-App.git |
| Vercel Dashboard | https://vercel.com/rebahan |

## Service & AI

| Nama | URL / Path |
|------|-----------|
| Hermes API | http://localhost:20128/v1 |
| Ollama (Ornith 9B) | http://localhost:11434/v1 |
| RuVocal UI | http://localhost:3000 (default) |
| MCP Bridge (Ruflo) | http://127.0.0.1:3100/mcp |
| Ruflo Adapter | C:\Users\Administrator\hermes-ruflo\src\server-http.js |

## Node.js (jika perlu export PATH di git-bash)

```bash
export PATH="/c/Users/Administrator/AppData/Local/hermes/node:$PATH"
```

## Script Sync GitHub

```bash
# Klik dua kali atau jalankan:
C:\Users\Administrator\dev-workspace\sync.bat
# Atau manual:
cd C:\Users\Administrator\dev-workspace && git add . && git commit -m "sync" && git push
```

## File Konfigurasi RuVocal

C:\Users\Administrator\ruflo\src\ruvocal\.env.local
```env
OPENAI_BASE_URL=http://localhost:20128/v1
MODELS=[{"id":"COMBO-UTAMA","supportsTools":true,"name":"Hermes"},{"id":"ornith:9b","supportsTools":false,"name":"Ornith 9B (Gratis)"}]
MCP_SERVERS=[{"name":"ruflo","url":"http://localhost:3100/mcp"}]
```
