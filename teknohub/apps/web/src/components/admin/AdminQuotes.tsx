"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Quote {
  id: string;
  status: string;
  ai_draft: string | null;
  final_quote: string | null;
  total_price: number | null;
  created_at: string;
  user: { username: string | null; avatar_url: string | null } | null;
  build: { name?: string; total_price?: number; use_case?: string; budget?: number } | null;
}

const STATUSES = ["all", "requested", "drafted", "sent", "accepted", "rejected"];

const STATUS_BADGE: Record<string, string> = {
  requested: "bg-amber-100 text-amber-800 border-amber-300",
  drafted: "bg-blue-100 text-blue-800 border-blue-300",
  sent: "bg-purple-100 text-purple-800 border-purple-300",
  accepted: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

const formatIDR = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});

  const fetchQuotes = useCallback(async (s: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/quotes?status=${s}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal memuat penawaran");
        return;
      }
      setQuotes(json.data ?? []);
    } catch {
      setError("Gagal terhubung ke server");
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
        body: JSON.stringify({
          id,
          action,
          final_quote: drafts[id],
          total_price: prices[id] ? Number(prices[id]) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal memproses aksi");
        return;
      }
      fetchQuotes(status);
    } catch {
      setError("Gagal terhubung");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Penawaran Rakit PC</h1>
          <p className="text-xs text-tertiary">Review permintaan penawaran, edit harga/garansi, buat PDF invoice &amp; konversi ke pesanan</p>
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                status === s
                  ? "bg-accent text-white"
                  : "bg-surface border border-slate-300 text-muted hover:border-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex justify-between items-center">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-700 font-bold">✕</button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-sm text-tertiary">Memuat penawaran...</div>
      ) : quotes.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-tertiary text-sm">Tidak ada penawaran dengan status ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="bg-surface rounded-2xl border border-slate-300 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-xl">
                    🖥️
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">
                      {q.build?.name || "Paket Rakit PC Kustom"}
                    </h3>
                    <p className="text-xs text-tertiary">
                      Pemohon: <b className="text-foreground">@{q.user?.username || "anon"}</b> · {q.created_at?.slice(0, 10)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_BADGE[q.status] ?? "bg-slate-100"}`}>
                    {q.status}
                  </span>
                  {/* Download PDF button */}
                  <Link
                    href={`/api/admin/quotes/${q.id}/pdf`}
                    target="_blank"
                    className="px-3 py-1 rounded-lg bg-surface-2 border border-slate-300 hover:border-accent text-xs font-semibold flex items-center gap-1"
                  >
                    <span>📄</span> PDF Invoice
                  </Link>
                </div>
              </div>

              {/* Detail AI Draft & Build Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-xs">
                {q.build && (
                  <div className="bg-surface-2/60 rounded-xl p-3 space-y-1">
                    <p className="font-bold text-foreground">Spesifikasi Build:</p>
                    <p className="text-tertiary">Use Case: <span className="font-medium text-foreground uppercase">{q.build.use_case || "—"}</span></p>
                    <p className="text-tertiary">Estimasi Komponen: <b className="text-foreground">{formatIDR(q.build.total_price)}</b></p>
                    <p className="text-tertiary">Budget Target: <b className="text-foreground">{formatIDR(q.build.budget)}</b></p>
                  </div>
                )}
                <div className="bg-surface-2/60 rounded-xl p-3 space-y-1">
                  <p className="font-bold text-foreground">AI Draft Penawaran:</p>
                  <p className="text-tertiary whitespace-pre-wrap">{q.ai_draft || "Belum ada draft otomatis."}</p>
                </div>
              </div>

              {/* Editor Final Quote & Aksi */}
              <div className="pt-2 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted mb-1">Catatan / Rincian Penawaran Final</label>
                    <textarea
                      rows={2}
                      defaultValue={q.final_quote ?? ""}
                      onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
                      placeholder="Contoh: Termasuk jasa rakit Rp 200.000 + garansi 1 tahun toko..."
                      className="w-full p-2.5 text-xs bg-surface border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Total Harga Final (IDR)</label>
                    <input
                      type="number"
                      defaultValue={q.total_price ?? q.build?.total_price ?? ""}
                      onChange={(e) => setPrices({ ...prices, [q.id]: e.target.value })}
                      placeholder="Total harga akhir"
                      className="w-full p-2.5 text-xs bg-surface border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={busyId === q.id}
                    onClick={() => act(q.id, "draft")}
                    className="px-3 py-1.5 text-xs rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold disabled:opacity-50"
                  >
                    Simpan Draft
                  </button>
                  <button
                    type="button"
                    disabled={busyId === q.id}
                    onClick={() => act(q.id, "send")}
                    className="px-3 py-1.5 text-xs rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold disabled:opacity-50"
                  >
                    Kirim Penawaran
                  </button>
                  <button
                    type="button"
                    disabled={busyId === q.id}
                    onClick={() => act(q.id, "accept")}
                    className="px-3 py-1.5 text-xs rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-semibold disabled:opacity-50"
                  >
                    Terima (Accept)
                  </button>
                  <button
                    type="button"
                    disabled={busyId === q.id}
                    onClick={() => act(q.id, "reject")}
                    className="px-3 py-1.5 text-xs rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold disabled:opacity-50"
                  >
                    Tolak
                  </button>
                  {/* Konversi ke pesanan resmi */}
                  <button
                    type="button"
                    disabled={busyId === q.id}
                    onClick={() => act(q.id, "convert_to_order")}
                    className="px-4 py-1.5 text-xs rounded-xl bg-accent text-white hover:bg-accent-secondary font-semibold disabled:opacity-50 flex items-center gap-1"
                  >
                    <span>🛒</span> Konversi ke Pesanan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
