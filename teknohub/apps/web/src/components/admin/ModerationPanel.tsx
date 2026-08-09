"use client";

import { useState, useEffect, useCallback } from "react";

interface Report {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_id: string;
}

export default function ModerationPanel() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const fetchReports = useCallback(async (status = "open") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/forum/moderator/reports?status=${status}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal memuat");
        return;
      }
      setReports(json.data ?? []);
    } catch {
      setError("Gagal terhubung");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const act = async (id: string, action: string) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/forum/moderator/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal");
        return;
      }
      setReports(reports.filter((r) => r.id !== id));
    } catch {
      setError("Gagal terhubung");
    } finally {
      setBusyId("");
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Moderasi Laporan</h1>

      {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-900/30 rounded-lg">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : reports.length === 0 ? (
        <div className="p-8 bg-surface-2/60 border border-dashed border-slate-300 rounded-xl text-center">
          <p className="text-tertiary">Tidak ada laporan {busyId ? "" : "terbuka"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="p-4 bg-surface border border-slate-300 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/30">
                  {r.target_type}
                </span>
                <span className="text-xs text-slate-500">{fmt(r.created_at)}</span>
              </div>
              <p className="text-sm text-muted mb-1">
                <span className="text-slate-500">Target:</span> {r.target_id}
              </p>
              <p className="text-sm text-tertiary mb-3">
                <span className="text-slate-500">Alasan:</span> {r.reason}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => act(r.id, "dismiss")}
                  disabled={busyId === r.id}
                  className="px-3 py-1.5 text-xs rounded-lg bg-surface-2 text-muted border border-slate-300 hover:border-slate-300 disabled:opacity-50"
                >
                  Tolak laporan
                </button>
                <button
                  onClick={() => act(r.id, "actioned")}
                  disabled={busyId === r.id}
                  className="px-3 py-1.5 text-xs rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 disabled:opacity-50"
                >
                  Tindak lanjut
                </button>
                <button
                  onClick={() => act(r.id, "ban")}
                  disabled={busyId === r.id}
                  className="px-3 py-1.5 text-xs rounded-lg bg-red-500/15 text-red-300 border border-red-500/40 hover:bg-red-500/25 disabled:opacity-50"
                >
                  Ban user (30 hari)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
