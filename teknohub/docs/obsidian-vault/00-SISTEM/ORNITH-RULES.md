# ⚡ Aturan Ornith 9B — Batasan & Best Practice

> Migrasi dari Gemma 4 E4B → Ornith 9B (2026-08-12). Ornith lebih kuat di koding/agentic (SWE-bench 69.4), setengah ukuran (5.6GB vs 9.6GB). Kelemahan: TIDAK multimodal (teks saja).

## Profil Model

- Model   : Ornith 1.0 9B (DeepReinforce, MIT)
- URL     : http://localhost:11434/v1
- Model ID: ornith:9b
- Fitur   : Agentic coding, self-scaffolding, 262K context, Q4_K_M
- Kecepatan: ~3.7 tok/s (offload CPU, GTX 960M 2GB VRAM)

## Yang Bisa Dikerjakan (GRATIS)

✅ Fungsi/komponen pendek < 50 baris
✅ Menambahkan JSDoc/komentar pada kode yang sudah ada
✅ Menduplikasi pola yang sudah ada (ganti nama entity)
✅ Perbaikan CSS/Tailwind yang spesifik dan terisolasi
✅ Unit test untuk fungsi sederhana (pure function)
✅ Konversi pseudocode Hermes → kode nyata
✅ Format/prettify kode
✅ Buat boilerplate berulang
✅ Agentic task: tool-calling, scaffold kode, terminal tasks (Terminal-Bench 43.1)

## Yang TIDAK Boleh Diberikan ke Ornith

❌ Rancang arsitektur dari nol
❌ Debug masalah yang melibatkan banyak file
❌ Refactor besar
❌ Algoritma kompleks
❌ Security review
❌ Analisis error yang butuh reasoning panjang
❌ Analisis gambar/screenshot (bukan multimodal — pakai Hermes)

## Aturan Prompt untuk Ornith

1. Maksimal konteks: 100 baris
2. Satu request = satu fungsi atau satu komponen
3. Selalu tambahkan "JANGAN tambahkan hal lain" di prompt
4. Jika output salah 1x → mulai prompt baru yang lebih spesifik (jangan minta iterasi)
5. Berikan contoh output yang diinginkan jika bisa

## Template Prompt Ornith (Copy-Paste)

### Fungsi Baru:
```
Tulis fungsi [nama] dalam [bahasa].
Input: [tipe] contoh: [contoh]
Output: [tipe] contoh: [contoh]
Aturan: [aturan]
Hanya tulis fungsi ini. Jangan tambahkan hal lain.
```

### Duplikasi Pola:
```
Ini contoh pola untuk [entity lama]:
[paste kode]
Buat versi sama untuk [entity baru].
Ganti: [lama] → [baru], field: [daftar field]
Ikuti pola persis.
```

### Tambah Komentar:
```
Tambahkan JSDoc pada fungsi di kode ini.
Bahasa deskripsi: Indonesia.
JANGAN ubah logika kode.
[paste kode]
```
