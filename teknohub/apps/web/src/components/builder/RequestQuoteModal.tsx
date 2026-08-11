"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builderStore";

interface RequestQuoteModalProps {
  buildId?: string;
  buildTitle?: string;
  trigger?: React.ReactNode;
}

export default function RequestQuoteModal({ buildId, buildTitle, trigger }: RequestQuoteModalProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const { selectedComponents, totalEstimasi, budgetTarget } = useBuilderStore();

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pc-builder/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          build_id: buildId,
          note,
          components: selectedComponents,
          totalEstimasi,
          budgetTarget,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal mengirim (pastikan login)");
        return;
      }
      setDone(true);
    } catch {
      setError("Gagal terhubung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition"
      >
        {trigger ?? "📄 Minta Penawaran Rakit"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-surface border border-slate-300 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground mb-1">Minta Penawaran Resmi</h3>
            <p className="text-sm text-tertiary mb-4">
              {buildTitle ? `Build: ${buildTitle}` : "Jasa rakit PC TeknoHub"} — admin akan review & kirim penawaran resmi (estimasi jasa rakit Rp 150.000-300.000).
            </p>

            <label className="block text-sm font-medium text-muted mb-1">Catatan (opsional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Contoh: butuh build untuk editing 4K, prefer AMD..."
              className="w-full p-3 text-sm bg-surface border border-slate-300 rounded-lg text-foreground resize-none mb-4 placeholder:text-tertiary"
            />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            {done ? (
              <div className="text-center py-2">
                <p className="text-emerald-400 text-sm mb-3">✓ Permintaan terkirim! Admin akan menghubungi Anda.</p>
                <button
                  onClick={() => { setOpen(false); setDone(false); setNote(""); }}
                  className="px-4 py-2 rounded-lg bg-surface-2 text-muted text-sm hover:bg-surface-2"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
                <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-tertiary hover:text-foreground">
                  Batal
                </button>
                <button
                  onClick={submit}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-lg bg-accent text-white font-medium disabled:opacity-50 hover:opacity-90"
                >
                  {loading ? "Mengirim..." : "Kirim Permintaan"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
