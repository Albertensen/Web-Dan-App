# SIAP-PAKAI — Cheatsheet 1 Halaman

## Bagian 1 — Quick Reference Model

| Tugas | Pakai |
|-------|-------|
| Arsitektur, review, keputusan | Hermes |
| Fungsi pendek, komentar, CSS, test, duplikasi pola | Gemma 4 E4B (gratis) |
| Jalankan perintah, baca/tulis file, git | Ruflo (tanpa model) |

## Bagian 2 — Start Service

```bash
# 1. Ollama
ollama serve

# 2. MCP Bridge (adapter Ruflo)
node C:\Users\Administrator\hermes-ruflo\src\server-http.js

# 3. RuVocal UI
cd [path ruvocal] && npm run dev
```

## Bagian 3 — Template Prompt Paling Sering Dipakai

### Template Fungsi Baru (untuk Gemma)
```
Tulis fungsi [nama] dalam [bahasa].
Input: [tipe] contoh: [contoh]
Output: [tipe] contoh: [contoh]
Aturan: [aturan spesifik]
Hanya tulis fungsi ini. Jangan tambahkan hal lain.
```

### Template Duplikasi Pola (untuk Gemma)
```
Ini contoh pola yang sudah ada:
[paste kode contoh]

Buat versi yang sama untuk [entity baru].
Ganti: [nama lama] → [nama baru]
Field baru: [daftar field]
Ikuti pola persis, hanya ganti yang disebutkan.
```

### Template Komentar JSDoc (untuk Gemma)
```
Tambahkan JSDoc pada setiap fungsi di kode ini.
Bahasa deskripsi: Indonesia.
JANGAN ubah logika kode sama sekali.
[paste kode]
```

## Bagian 4 — Checklist Setup Sudah Siap

- [ ] `ollama serve` jalan + `gemma4:e4b` tersedia
- [ ] MCP Bridge jalan di http://127.0.0.1:3100/mcp
- [ ] RuVocal UI bisa dibuka di browser
- [ ] GitHub remote terhubung (`git remote -v`)
- [ ] Obsidian vault `PROJECT_WEB` terbuka
