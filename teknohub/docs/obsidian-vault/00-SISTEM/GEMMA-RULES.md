# ⚡ Aturan Gemma 4 E4B — Batasan & Best Practice

## Profil Model

- Model   : Gemma 4 E4B (edge-optimized, ~3GB)
- URL     : http://localhost:11434/v1
- Model ID: gemma4:e4b
- Fitur   : Teks + Gambar (multimodal!) + 128K context

## Yang Bisa Dikerjakan (GRATIS)

✅ Fungsi/komponen pendek < 50 baris
✅ Menambahkan JSDoc/komentar pada kode yang sudah ada
✅ Menduplikasi pola yang sudah ada (ganti nama entity)
✅ Perbaikan CSS/Tailwind yang spesifik dan terisolasi
✅ Unit test untuk fungsi sederhana (pure function)
✅ Analisis screenshot UI → saran CSS konkret (MANFAATKAN INI!)
✅ Konversi pseudocode Hermes → kode nyata
✅ Format/prettify kode
✅ Buat boilerplate berulang

## Yang TIDAK Boleh Diberikan ke Gemma

❌ Rancang arsitektur dari nol
❌ Debug masalah yang melibatkan banyak file
❌ Refactor besar
❌ Algoritma kompleks
❌ Security review
❌ Analisis error yang butuh reasoning panjang

## Aturan Prompt untuk Gemma

1. Maksimal konteks: 100 baris
2. Satu request = satu fungsi atau satu komponen
3. Selalu tambahkan "JANGAN tambahkan hal lain" di prompt
4. Jika output salah 1x → mulai prompt baru yang lebih spesifik (jangan minta iterasi)
5. Berikan contoh output yang diinginkan jika bisa

## Template Prompt Gemma (Copy-Paste)

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

### Analisis Screenshot:
```
[lampirkan screenshot]
Identifikasi: elemen UI, masalah visual, saran CSS/Tailwind konkret.
Jangan buat kode dulu, hanya analisis.
```
