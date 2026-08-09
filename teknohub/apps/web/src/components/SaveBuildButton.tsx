"use client";

import { useState } from "react";

interface SaveBuildButtonProps {
  parts: { id: string }[];
  buildType: string;
}

export default function SaveBuildButton({ parts, buildType }: SaveBuildButtonProps) {
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/pc-builder/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Build PC Saya",
          build_type: buildType,
          parts: parts.map((p) => ({ component_id: p.id })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal menyimpan (pastikan login)");
        return;
      }
      setSaved(true);
    } catch {
      setError("Gagal terhubung");
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <a href="/builder/saved" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition">
        ✓ Tersimpan — lihat Build Saya
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500/50 hover:text-blue-400 transition"
      >
        💾 Simpan Build
      </button>
      {showForm && (
        <div className="mt-2 flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama build (opsional)"
            className="flex-1 px-3 py-1.5 text-sm bg-[#0a0a0f] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500"
          />
          <button
            onClick={save}
            disabled={saving}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white disabled:opacity-50"
          >
            {saving ? "..." : "Simpan"}
          </button>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
