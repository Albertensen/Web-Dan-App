"use client";

import { useState, useEffect, useCallback } from "react";

interface Quote {
  id: string;
  status: string;
  ai_draft: string | null;
  final_quote: string | null;
  total_price: number | null;
  created_at: string;
  user: { username: string | null; avatar_url: string | null } | null;
}

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [status, setStatus] = useState("requested");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const fetchQuotes = useCallback(async (s: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/quotes?status=${s}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal memuat");
        return;
      }
      setQuotes(json.data ?? []);
    } catch {
      setError("Gagal terhubung");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes(status);
  }, [status, fetchQuotes]);

  const act = async (id: string, action: string) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, final_quote: drafts[id] ?? "" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal");
        return;
      }
      setQuotes(quotes.filter((q) => q.id !== id));
    } catch {
      setError("Gagal terhubung");
    } finally {
      setBusyId("");
    }
  };

  const fmt = (n: number | null) =>
    n == null ? "—" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const STATUSES = ["requested", "drafted", "sent", "accepted", "rejected"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Review Penawaran Rakit</h1>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              status === s
                ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-900/30 rounded-lg">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : quotes.length === 0 ? (
        <div className="p-8 bg-slate-800/40 border border-dashed border-slate-700 rounded-xl text-center">
          <p className="text-slate-400">Tidak ada quote berstatus {status}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="p-4 bg-[#14141c] border border-slate-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-200">
                  {q.user?.username ?? "User"} <span className="text-slate-500">•</span>{" "}
                  <span className="text-slate-400">{new Date(q.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  {q.status}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-2 whitespace-pre-wrap bg-[#0a0a0f] p-3 rounded-lg border border-slate-800">
                {q.ai_draft}
              </p>
              <p className="text-sm text-slate-400 mb-3">
                Total: <span className="font-semibold text-blue-400">{fmt(q.total_price)}</span>
              </p>

              <textarea
                value={drafts[q.id] ?? q.final_quote ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                rows={2}
                placeholder="Penawaran final (jika dikirim)..."
                className="w-full p-2 text-sm bg-[#0a0a0f] border border-slate-700 rounded-lg text-white resize-none mb-3 placeholder-slate-500"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => act(q.id, "send")}
                  disabled={busyId === q.id}
                  className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/40 hover:bg-blue-500/25 disabled:opacity-50"
                >
                  Kirim Penawaran
                </button>
                <a
                  href={`/api/admin/quotes/${q.id}/pdf`}
                  className="px-3 py-1.5 text-xs rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/40 hover:bg-violet-500/25 inline-block"
                >
                  📄 Download Invoice PDF
                </a>
                <button
                  onClick={() => act(q.id, "accept")}
                  disabled={busyId === q.id}
                  className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25 disabled:opacity-50"
                >
                  Terima
                </button>
                <button
                  onClick={() => act(q.id, "reject")}
                  disabled={busyId === q.id}
                  className="px-3 py-1.5 text-xs rounded-lg bg-red-500/15 text-red-300 border border-red-500/40 hover:bg-red-500/25 disabled:opacity-50"
                >
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
