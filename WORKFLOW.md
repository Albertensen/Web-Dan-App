# WORKFLOW — Alur Kerja Harian

## Pagi — Planning dengan Hermes (~10 menit, ~300-500 token)

- Kirim SESSION-START.md ke Hermes
- Hermes baca konteks → tampilkan ringkasan sesi terakhir
- Tentukan target hari ini → Hermes bagi jadi tugas-tugas kecil (output pseudocode, bukan kode)
- Simpan daftar tugas ke file TODO-[tanggal].md

## Siang — Coding dengan Gemma (sepanjang hari, GRATIS)

- Ambil satu tugas dari daftar
- Pilih template dari .config/prompts/ sesuai jenis tugas
- Isi template → kirim ke Gemma
- Review output (30 detik) → Ruflo simpan ke file
- Ulangi untuk tugas berikutnya

## Sore — Review Visual dengan Gemma (~30 menit, GRATIS)

- Screenshot halaman yang sudah dibuat
- Kirim ke Gemma dengan template visual.md
- Gemma analisis masalah visual → saran CSS konkret
- Terapkan perbaikan → screenshot ulang untuk validasi

## Akhir Hari — Final Review dengan Hermes (~5 menit, ~200-400 token)

- Paste file-file kritis yang diubah hari ini
- Hermes cek: bug obvious, security issue, hal yang perlu diperbaiki
- Jika ada issue: tambahkan ke TODO besok
- Sync ke GitHub: klik sync.bat
- Isi log di Obsidian DAILY/

## Estimasi Token Hermes per Hari

**500-900 token** — sisanya GRATIS via Gemma
