# OllamaAgent — Sub-Agent Lokal (ornith:9b)

Sub-agent offline untuk tugas terisolasi & repetitif. Hemat token utama.

## Setup
1. `ollama serve` jalan (localhost:11434)
2. `ollama pull ornith:9b` (sudah ada)

## Pakai dari Python
```python
import sys; sys.path.insert(0, "/home/myhomeai/TEKNOHUB")
import ollama_agent
# alias ringkas
from ollama_agent import agent

# teks biasa
hasil = agent.run("Buat draf paragraf deskripsi toko")

# JSON (auto-repair, wajib JSON)
data = agent.json("Buat JSON: {\"a\": 1}")

# mock data
produk = agent.mock_data("produk elektronik: name, price, category", count=5)

# SEO 1 produk → dict
seo = agent.seo_copy("RTX 4060 Gaming GPU", "gpu", "Rp 4.599.000")

# ekstrak data dari teks → JSON
emails = agent.extract(teks, "alamat email")

# format ulang teks
rapi = agent.format(teks, "markdown")
```

## CLI
```bash
python -m ollama_agent "prompt"
python -m ollama_agent --json "Buat JSON..."
python -m ollama_agent --file prompt.txt
python -m ollama_agent --clear-cache
```

## Kemampuan Nyata (terverifikasi)
| Tugas | Status | Catatan |
|---|---|---|
| Mock data JSON (3-5 item) | ✅ | 70-90s, valid |
| SEO copy 1 produk | ✅ | 80s, valid |
| Validasi JSON output | ✅ | auto-repair + retry |
| Cache | ✅ | hash prompt, hit 0.0s |
| Ekstraksi teks pendek | ✅ | pakai json() |
| Kode multi-fungsi (validator/boilerplate) | ❌ | ornith rusak sintaks (`from`/`=` hilang) — kerjakan manual |

## Aturan
- Ornith = penulis draft. Prime Agent = reviewer.
- Kode >20 baris / butuh tsc → JANGAN delegasikan, tulis manual.
- Sebelum integrasi: `npx tsc --noEmit` di `teknohub/apps/web`.
- JSON > 5 item / teks > 4000 char → pecah per-call.
- ~20-90s per call (96% CPU, 217MB VRAM). Hindari call saat butuh cepat.

## Error
- Ollama mati / model tidak ada → `OllamaAgentError`
- Output korup → auto-retry sekali, lalu error jelas.
