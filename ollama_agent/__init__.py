"""OllamaAgent — sub-agent lokal via Ollama (ornith:9b).

Tugas terisolasi & sederhana yang tidak perlu token utama:
- format teks, cek sintaks kecil, ekstraksi data, boilerplate code.

Pakai:
    from ollama_agent import agent
    hasil = agent.run("Perbaiki format markdown berikut:\n" + teks)

CLI:
    python -m ollama_agent "prompt teks"
    python -m ollama_agent --file input.txt
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.request

DEFAULT_URL = "http://localhost:11434"
DEFAULT_MODEL = "ornith:9b"
DEFAULT_OPTIONS = {"temperature": 0.2, "num_ctx": 4096}


class OllamaAgentError(RuntimeError):
    """Ollama tidak bisa diakses / model tidak ada / generate gagal."""


def _post(url: str, payload: dict, timeout: float) -> dict:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:  # network, timeout, non-200
        raise OllamaAgentError(f"Ollama request gagal: {e}") from e


def run(
    prompt: str,
    model: str = DEFAULT_MODEL,
    base_url: str = DEFAULT_URL,
    options: dict | None = None,
    timeout: float = 900.0,
) -> str:
    """Kirim prompt ke Ollama, kembalikan teks hasil (streaming internal).

    Streaming dipakai agar request tidak timeout pada output panjang
    (ornith:9b CPU-only ~80s per paragraf). Hasil digabung sampai selesai.
    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True,
        "options": {**DEFAULT_OPTIONS, **(options or {})},
    }
    req = urllib.request.Request(
        f"{base_url.rstrip('/')}/api/generate",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    chunks: list[str] = []
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            for raw in resp:
                obj = json.loads(raw)
                if obj.get("error"):
                    raise OllamaAgentError(obj["error"])
                chunks.append(obj.get("response", ""))
    except OllamaAgentError:
        raise
    except Exception as e:
        raise OllamaAgentError(f"Ollama request gagal: {e}") from e
    return "".join(chunks).strip()


def available(base_url: str = DEFAULT_URL, timeout: float = 5.0) -> list[str]:
    """Daftar model yang tersedia di Ollama."""
    data = _post(f"{base_url.rstrip('/')}/api/tags", {}, timeout)
    return [m["name"] for m in data.get("models", [])]


def _cli() -> int:
    ap = argparse.ArgumentParser(description="Jalankan sub-agent Ollama lokal")
    ap.add_argument("prompt", nargs="?", help="Prompt teks (atau pakai --file)")
    ap.add_argument("--file", help="Baca prompt dari file")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--url", default=DEFAULT_URL)
    ap.add_argument("--timeout", type=float, default=300.0)
    args = ap.parse_args()

    prompt = args.prompt
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            prompt = f.read()
    if not prompt:
        ap.error("butuh prompt atau --file")

    try:
        out = run(prompt, model=args.model, base_url=args.url, timeout=args.timeout)
    except OllamaAgentError as e:
        print(f"[ollama-agent] error: {e}", file=sys.stderr)
        return 1
    print(out)
    return 0


if __name__ == "__main__":
    sys.exit(_cli())
