# 🎯 Pola Prompt yang Terbukti Efektif

## Pola: Pseudocode → Kode (Hemat 70% token Hermes)
1. Hermes: "Buat pseudocode untuk [fitur]" → output outline/logika
2. Gemma: "Konversi pseudocode ini ke TypeScript: [paste]"

## Pola: Contoh → Duplikasi (Gemma sangat andal)
"Ini contoh pola untuk [A]: [kode]
Buat versi sama untuk [B]. Ganti [X]→[Y], field: [list]"

## Pola: Screenshot → CSS Fix (Manfaatkan multimodal Gemma)
Upload screenshot → "Analisis masalah visual → saran Tailwind konkret"

## Pola: Batch Komentar
Kumpulkan 5-10 fungsi → "Tambahkan JSDoc pada semua fungsi ini"
Lebih efisien dari 1 fungsi per request.

## Pola: Hermes Blueprint → Ruflo Eksekusi
Hermes buat daftar perintah → Ruflo eksekusi satu per satu
Model tidak perlu terlibat untuk perintah yang sudah jelas

## Yang TIDAK Efektif (Hindari)
- Minta Hermes generate kode panjang langsung
- Minta Gemma debug masalah multi-file
- Gonta-ganti model setiap tugas kecil
- Jelaskan konteks yang sama berulang (gunakan file!)
