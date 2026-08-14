# WORKFLOW — Alur Kerja Harian

> Model: ornith:9b via Ollama (gratis) utk tugas ringan; agent utama utk planning/review/security.
> Aturan hemat token lengkap: teknohub/docs/obsidian-vault/KNOWLEDGE/TOKEN-SAVING-RULES.md

## Pagi — Planning (~10 menit)

- Baca teknohub/ROADMAP.md → ambil next action
- Tentukan target hari → bagi jadi tugas kecil (output pseudocode, bukan kode)
- Simpan daftar tugas ke TODO-[tanggal].md

## Siang — Coding

- Ambil satu tugas dari daftar
- Tugas pendek (<50 baris, duplikasi pola, CSS terisolasi) → Ornith (gratis)
- Tugas kompleks/multi-file/security → agent utama
- Review output → simpan ke file

## Sore — Review Visual

- Screenshot halaman → analisis masalah visual → saran CSS konkret
- Terapkan perbaikan → screenshot ulang utk validasi

## Akhir Hari — Final Review

- Review file kritis: auth, payment, security, API
- Update ROADMAP.md (centang item selesai) + CHANGELOG.md (entry baru)
- Sync ke GitHub (lihat MASTER-INDEX.md)

## Estimasi Token

Agent utama hanya utk planning + review kritis — sisanya gratis via Ornith.
