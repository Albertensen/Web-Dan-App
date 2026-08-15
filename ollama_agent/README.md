# OllamaAgent — Sub-Agent Lokal (ornith:9b)

Sub-agent offline untuk tugas terisolasi & repetitif. Hemat token utama.

## Setup
1. `ollama serve` jalan (localhost:11434)
2. `ollama pull ornith:9b` (sudah ada di mesin ini)

## Pakai dari Python (Prime Agent)
```python
import sys; sys.path.insert(0, "/home/myhomeai/TEKNOHUB")
import ollama_agent

# generate teks
hasil = ollama_agent.run("Buat draf meta description untuk produk keyboard mekanik")

# cek model tersedia
models = ollama_agent.available()
```

## Pakai dari CLI
```bash
python -m ollama_agent "Tulis fungsi validasi email Python"
python -m ollama_agent --file prompt.txt
python -m ollama_agent --model ornith:9b --timeout 300 "prompt"
```

## Catatan
- ~50 detik per generate (ornith:9b 5.6GB, lokal)
- `temperature` default 0.2 (deterministik), `num_ctx` 4096
- Error (Ollama mati / model tidak ada) → `OllamaAgentError`

## Aturan Integrasi (wajib)
1. Ornith = penulis draft. Prime Agent = reviewer.
2. Sebelum integrasi: cek sintaks + `npx tsc --noEmit` di `teknohub/apps/web`.
3. Jangan commit output Ornith tanpa review Prime Agent.
