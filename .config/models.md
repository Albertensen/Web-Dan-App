# Konfigurasi Model

## Hermes (Model Utama)

OPENAI_BASE_URL=http://localhost:20128/v1
OPENAI_API_KEY=[key dari config Hermes]

## Gemma 4 E4B via Ollama

URL Base : http://localhost:11434/v1
Model ID : gemma4:e4b
API Key  : ollama (literal, tidak perlu key asli)

## Konfigurasi MODELS di RuVocal .env.local

MODELS=[
  {
    "id": "COMBO-UTAMA",
    "name": "Hermes — Pikiran Utama",
    "supportsTools": true
  },
  {
    "id": "gemma4:e4b",
    "name": "Gemma 4 E4B — Juru Tulis (Gratis)",
    "supportsTools": false
  }
]
MCP_SERVERS=[{"name":"ruflo","url":"http://localhost:3100/mcp"}]
TASK_MODEL=COMBO-UTAMA

## Catatan

- supportsTools: false untuk Gemma — model kecil sering gagal format tool calls
- Gemma dipakai untuk pure text generation, Hermes untuk yang butuh tools/Ruflo
