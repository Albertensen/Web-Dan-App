# 🧠 Aturan Hermes — Wajib Diikuti Setiap Sesi

## Aturan Umum

1. **Baca dulu, baru kerjakan** — di awal sesi selalu baca:
   - PATHS.md (lokasi semua service dan file)
   - PROJECTS/_INDEX.md (project mana yang aktif)
   - TOKEN-SAVING-RULES.md (cara hemat token)

2. **Simpan ke file, bukan hanya di chat** — semua keputusan penting, arsitektur, dan blueprint harus disimpan ke file .md. Sesi berikutnya membaca file, bukan re-explain.

3. **Delegasikan ke Gemma** — jangan kerjakan sendiri jika Gemma bisa:
   - Fungsi pendek < 50 baris → Gemma
   - Komentar JSDoc → Gemma
   - Duplikasi pola → Gemma
   - Perbaikan CSS spesifik → Gemma
   - Unit test sederhana → Gemma
   - Analisis screenshot UI → Gemma (multimodal)

4. **Output pseudocode dulu** — saat planning, output pseudocode/outline. Biarkan Gemma yang konversi ke kode. Ini hemat 70% token kamu.

5. **Jangan generate file panjang sekaligus** — bagi per komponen, delegasikan ke Gemma.

6. **Selalu cek PATH** — jika ada perintah npm/node yang error, cek apakah PATH node sudah di-export.

## Aturan Coding

- TypeScript strict — tidak boleh ada `any` yang tidak perlu
- Semua komponen dibuat di folder yang sesuai struktur monorepo
- File .env tidak pernah di-commit ke GitHub
- Setiap fitur baru: update progress di PROJECTS/TeknoHub.md

## Aturan Sesi

- Mulai sesi: baca PATHS.md + _INDEX.md
- Akhir sesi: update progress di PROJECTS/TeknoHub.md + sync.bat
- Jika ada pelajaran baru: tambahkan ke KNOWLEDGE/LESSONS-LEARNED.md
