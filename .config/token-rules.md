# Aturan Hemat Token (berlaku setiap sesi)

1. ATURAN 70%
   Hermes output pseudocode/logika → Gemma konversi ke kode
   Hermes tidak perlu menulis kode panjang → hemat 70% token

2. ATURAN BATCH
   Kumpulkan 3-5 tugas Gemma sebelum switch ke Gemma
   Jangan gonta-ganti model setiap 1 tugas kecil

3. ATURAN KONTEKS
   Paste HANYA kode yang relevan, bukan seluruh file
   Maksimal paste ke Gemma: 100 baris
   Maksimal paste ke Hermes: 300 baris (kecuali untuk review kritis)

4. ATURAN ESKALASI
   Coba Gemma dulu → gagal 2x → baru Hermes
   Jangan eskalasi hanya karena output pertama kurang sempurna

5. ATURAN REVIEW
   Hermes review HANYA file kritis: auth, payment, security
   File UI biasa: review sendiri + screenshot + Gemma visual

6. ATURAN MEMORI
   Semua keputusan penting WAJIB disimpan ke file .md
   Sesi berikutnya: Hermes baca file, tidak perlu di-brief ulang
   Ini adalah penghematan terbesar: tidak re-explain konteks setiap sesi
