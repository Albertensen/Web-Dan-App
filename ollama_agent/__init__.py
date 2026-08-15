"""OllamaAgent — sub-agent lokal via Ollama (ornith:9b).

Tugas terisolasi & repetitif tanpa token utama:
- mock data JSON, SEO copy draft, util/validasi, dokumentasi.

Pakai:
    from ollama_agent import agent
    hasil = agent.run("...")          # teks biasa
    data  = agent.json("...")          # parse JSON (auto-repair)
    agent.format("...")                # format teks (markdown/pretty)

CLI:
    python -m ollama_agent "prompt"
    python -m ollama_agent --file input.txt
    python -m ollama_agent --json "prompt"
"""

from __future__ import annotations

import argparse
import hashlib
import json as _json
import os
import re
import sys
import time
import urllib.request

DEFAULT_URL = "http://localhost:11434"
DEFAULT_MODEL = "ornith:9b"
DEFAULT_OPTIONS = {"temperature": 0.2, "num_ctx": 4096}
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".cache")


class OllamaAgentError(RuntimeError):
    """Ollama tidak bisa diakses / model error / output tidak valid."""


def _cache_get(key: str) -> str | None:
    try:
        path = os.path.join(CACHE_DIR, key + ".txt")
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                return f.read()
    except OSError:
        pass
    return None


def _cache_put(key: str, text: str) -> None:
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        with open(os.path.join(CACHE_DIR, key + ".txt"), "w", encoding="utf-8") as f:
            f.write(text)
    except OSError:
        pass


def _stream_generate(payload: dict, timeout: float) -> str:
    """Generate via streaming endpoint; kumpulkan chunks sampai selesai."""
    req = urllib.request.Request(
        f"{DEFAULT_URL}/api/generate",
        data=_json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    chunks: list[str] = []
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            for raw in resp:
                obj = _json.loads(raw)
                if obj.get("error"):
                    raise OllamaAgentError(obj["error"])
                chunks.append(obj.get("response", ""))
    except OllamaAgentError:
        raise
    except Exception as e:
        raise OllamaAgentError(f"Ollama request gagal: {e}") from e
    return "".join(chunks).strip()


def run(
    prompt: str,
    model: str = DEFAULT_MODEL,
    options: dict | None = None,
    timeout: float = 900.0,
    use_cache: bool = True,
    system: str | None = None,
    retries: int = 1,
) -> str:
    """Kirim prompt ke Ollama, kembalikan teks. Cache berbasis hash prompt.

    - system: instruksi sistem (default: ringkas, langsung jawab, tanpa basa-basi)
    - retries: ulang sekali bila hasil kosong atau jelas korup
    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True,
        "options": {**DEFAULT_OPTIONS, **(options or {})},
        "system": system
        or (
            "Kamu asisten teknis. Jawab langsung isi saja, tanpa basa-basi, "
            "tanpa penjelasan berlebihan. Bahasa: sesuai prompt."
        ),
    }
    key = hashlib.sha256(_json.dumps(payload, sort_keys=True).encode()).hexdigest()[:20]
    if use_cache:
        hit = _cache_get(key)
        if hit is not None:
            return hit

    out = _stream_generate(payload, timeout)
    attempts = 0
    while attempts < retries and _looks_broken(out):
        attempts += 1
        time.sleep(1)
        out = _stream_generate(payload, timeout)

    if use_cache:
        _cache_put(key, out)
    return out


def _looks_broken(text: str) -> bool:
    """Output korup bila ada pola: 'Nama X Nama X', paragraf terputus mendadak,
    atau berakhir tanpa penutup kode/JSON."""
    if not text:
        return True
    # kata berulang berurutan (degenerasi model)
    words = text.split()
    for i in range(len(words) - 1):
        if words[i] == words[i + 1] and len(words[i]) > 2:
            return True
    # blok kode tidak ditutup
    if text.count("```") % 2 == 1:
        return True
    # JSON terbuka tapi tidak tertutup
    if text.count("{") > text.count("}"):
        return True
    return False


def _extract_json(text: str):
    """Ambil JSON dari teks model (strip ```json fence, cari blok terbesar)."""
    text = text.strip()
    m = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if m:
        text = m.group(1).strip()
    try:
        return _json.loads(text)
    except _json.JSONDecodeError:
        pass
    # cari blok {...} atau [...] terbesar
    for pattern in (r"\[[\s\S]*\]", r"\{[\s\S]*\}"):
        m = re.search(pattern, text)
        if m:
            try:
                return _json.loads(m.group(0))
            except _json.JSONDecodeError:
                continue
    raise OllamaAgentError(f"Output bukan JSON valid: {text[:200]}")


def json(
    prompt: str,
    model: str = DEFAULT_MODEL,
    options: dict | None = None,
    timeout: float = 900.0,
    use_cache: bool = True,
    retries: int = 1,
):
    """Prompt dengan instruksi JSON + parse hasil. Lemparkan OllamaAgentError bila gagal."""
    p = prompt + "\n\nWAJIB: jawab HANYA satu JSON valid, tanpa teks lain, tanpa markdown fence."
    out = run(p, model=model, options=options, timeout=timeout, use_cache=use_cache, retries=retries)
    return _extract_json(out)



def available(timeout: float = 5.0) -> list[str]:
    req = urllib.request.Request(f"{DEFAULT_URL}/api/tags", headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = _json.loads(resp.read().decode("utf-8"))
        return [m["name"] for m in data.get("models", [])]
    except Exception as e:
        raise OllamaAgentError(f"Tidak bisa akses Ollama: {e}") from e


def clear_cache() -> None:
    import shutil

    shutil.rmtree(CACHE_DIR, ignore_errors=True)


def _cli() -> int:
    ap = argparse.ArgumentParser(description="Jalankan sub-agent Ollama lokal")
    ap.add_argument("prompt", nargs="?", help="Prompt teks (atau pakai --file)")
    ap.add_argument("--file", help="Baca prompt dari file")
    ap.add_argument("--json", action="store_true", help="Parse output sebagai JSON")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--timeout", type=float, default=900.0)
    ap.add_argument("--no-cache", action="store_true")
    ap.add_argument("--clear-cache", action="store_true")
    args = ap.parse_args()

    if args.clear_cache:
        clear_cache()
        print("cache dibersihkan")
        return 0

    prompt = args.prompt
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            prompt = f.read()
    if not prompt:
        ap.error("butuh prompt atau --file")

    try:
        if args.json:
            out = json(prompt, model=args.model, timeout=args.timeout, use_cache=not args.no_cache)
            print(_json.dumps(out, ensure_ascii=False, indent=2))
        else:
            out = run(prompt, model=args.model, timeout=args.timeout, use_cache=not args.no_cache)
            print(out)
    except OllamaAgentError as e:
        print(f"[ollama-agent] error: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(_cli())



# ---------------------------------------------------------------------------
# Tugas-tugas siap pakai (delegasi hemat token utama)
# ---------------------------------------------------------------------------

def mock_data(shape: str, count: int = 5, model: str = DEFAULT_MODEL, timeout: float = 900.0):
    """Buat mock data JSON. shape = deskripsi item, mis. 'produk e-commerce: name, price, category'.
    count = jumlah item. Return list[dict]."""
    p = (
        f"Buat {count} data dummy {shape}. "
        "Variasi nilai realistis bahasa Indonesia, no duplikat. "
        f"Output HANYA JSON array berisi tepat {count} objek."
    )
    return json(p, model=model, timeout=timeout)


def seo_copy(product: str, kategori: str, harga: str, model: str = DEFAULT_MODEL, timeout: float = 900.0):
    """Draft SEO on-page untuk 1 produk. Return dict:
    meta_title, meta_description, og_title, og_description, deskripsi_produk."""
    p = (
        "Kamu SEO copywriter e-commerce Indonesia. Produk: "
        f"{product} (kategori {kategori}, harga {harga}).\n"
        "Buat JSON: meta_title (max 60 char), meta_description (max 155 char), "
        "og_title, og_description, deskripsi_produk (2 kalimat, bahasa Indonesia, sebut harga)."
    )
    return json(p, model=model, timeout=timeout)


def validator(kind: str, lang: str = "python", model: str = DEFAULT_MODEL, timeout: float = 900.0):
    """Tulis fungsi validasi sederhana. kind: 'email', 'phone-id', 'password', 'username'.
    Return kode source (string)."""
    p = (
        f"Tulis fungsi {lang} untuk validasi {kind} (aturan umum Indonesia). "
        "Fungsi terima string, return boolean + pesan error. "
        "Hanya kode, tanpa penjelasan."
    )
    return run(p, model=model, timeout=timeout)


def boilerplate(desc: str, lang: str = "typescript", model: str = DEFAULT_MODEL, timeout: float = 900.0):
    """Buat boilerplate code. desc = deskripsi komponen/fungsi. Return kode source."""
    p = (
        f"Tulis boilerplate {lang}: {desc}. "
        "Kode lengkap siap pakai, tipe eksplisit, tanpa komentar berlebihan. Hanya kode."
    )
    return run(p, model=model, timeout=timeout)


def docs(target: str, kind: str = "readme", model: str = DEFAULT_MODEL, timeout: float = 900.0):
    """Buat draf dokumentasi. target = deskripsi apa yang didokumentasikan.
    kind: readme | env-example | summary | comments."""
    if kind == "env-example":
        p = (
            "Buat draf file .env.example untuk aplikasi berikut: " + target + ". "
            "Format KEY=deskripsi singkat, grup komentar, tanpa nilai rahasia nyata."
        )
    elif kind == "summary":
        p = "Buat ringkasan fungsi/modul: " + target + ". Format: nama, parameter, return, contoh. Bahasa Indonesia."
    elif kind == "comments":
        p = "Tulis komentar JSDoc/docstring untuk kode ini (bahasa Indonesia), JANGAN ubah logika:\n" + target
    else:
        p = "Buat draf README untuk: " + target + ". Bahasa Indonesia, struktur: deskripsi, install, pakai, lisensi."
    return run(p, model=model, timeout=timeout)


def extract(text: str, what: str, model: str = DEFAULT_MODEL, timeout: float = 600.0):
    """Ekstrak data dari teks (email, nomor, URL, tabel, dll). Return JSON."""
    p = (
        "Ekstrak dari teks berikut semua " + what + ". "
        "Output HANYA JSON (array atau objek), tanpa teks lain.\n\n" + text[:4000]
    )
    return json(p, model=model, timeout=timeout)


def format(text: str, style: str = "markdown", model: str = DEFAULT_MODEL, timeout: float = 600.0):
    """Format ulang teks (markdown rapi, rapikan JSON, dll)."""
    p = f"Format ulang teks berikut sebagai {style} yang rapi. Output hanya hasil format:\n\n{text[:4000]}"
    return run(p, model=model, timeout=timeout, system="Kamu formatter teks. Output hanya hasil, tanpa komentar.")


# convenience
agent = type("agent", (), {"run": staticmethod(run), "json": staticmethod(json), "format": staticmethod(format), "available": staticmethod(available), "clear_cache": staticmethod(clear_cache)})()
