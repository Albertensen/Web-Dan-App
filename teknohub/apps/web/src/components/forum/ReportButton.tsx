"use client";

import { useState } from "react";

interface ReportButtonProps {
  targetType: "thread" | "reply" | "user";
  targetId: string;
}

export default function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (reason.trim().length < 5) {
      setError("Alasan minimal 5 karakter");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/forum/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, reason }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal melaporkan");
        return;
      }
      setDone(true);
      setOpen(false);
    } catch {
      setError("Gagal terhubung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-slate-500 hover:text-red-400 transition"
      >
        ⚑ Lapor
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 p-4 bg-[#1a1a22] border border-slate-700 rounded-xl shadow-2xl z-20">
          <p className="text-sm font-medium text-slate-200 mb-2">Laporkan konten ini</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Alasan laporan (min 5 karakter)..."
            className="w-full p-2 text-sm bg-[#0a0a0f] border border-slate-700 rounded-lg text-white resize-none mb-2 focus:border-red-500"
          />
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Batal
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="px-3 py-1 text-xs bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg hover:bg-red-500/30 disabled:opacity-50"
            >
              {loading ? "..." : "Kirim Laporan"}
            </button>
          </div>
        </div>
      )}

      {done && (
        <span className="ml-2 text-xs text-green-400">✓ Terkirim</span>
      )}
    </div>
  );
}
