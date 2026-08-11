"use client";

import { useState, useRef, useEffect } from "react";
import { useBuilderStore, type RecommendedBuild } from "@/store/builderStore";

const CONFIRM_WORDS = ["ok", "oke", "setuju", "pakai", "terapkan", "ya", "yep", "yes", "lanjut", "gunakan"];

export default function PCBuilderChatInterface() {
  const {
    summary, setSummary, chatOpen, setChatOpen, messages, addMessage,
    pendingRecommendation, setPendingRecommendation, clearPendingRecommendation,
    applyRecommendation,
  } = useBuilderStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const applyRec = (rec: RecommendedBuild) => {
    applyRecommendation(rec);
    clearPendingRecommendation();
    setToast("✅ Build Rekomendasi diperbarui!");
  };

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    addMessage({ role: "user", content: text });

    // Deteksi konfirmasi "ok/setuju/pakai" + ada pendingRecommendation
    const lower = text.toLowerCase();
    if (pendingRecommendation && CONFIRM_WORDS.some((w) => lower.includes(w))) {
      addMessage({ role: "assistant", content: "✅ Build telah diperbarui! Rekomendasi AI diterapkan ke Build Summary." });
      applyRec(pendingRecommendation);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pc-builder/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Terjadi kesalahan");
        return;
      }
      addMessage({ role: "assistant", content: json.reply ?? "..." });
      if (json.summary) setSummary(json.summary);
      // Rekomendasi structured → pending
      if (json.hasRecommendation && json.recommendation) {
        setPendingRecommendation(json.recommendation as RecommendedBuild);
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const renderRecCard = (rec: RecommendedBuild) => {
    const items = [
      rec.cpu && ["CPU", rec.cpu],
      rec.gpu && ["GPU", rec.gpu],
      rec.ram && ["RAM", rec.ram],
      rec.storage && ["Storage", rec.storage],
      rec.psu && ["PSU", rec.psu],
      rec.motherboard && ["Motherboard", rec.motherboard],
      rec.casing && ["Casing", rec.casing],
      rec.cooler && ["Cooler", rec.cooler],
    ].filter(Boolean) as [string, string][];

    return (
      <div className="mt-2 rounded-xl border border-cyan-500/30 bg-slate-900/60 p-3">
        <p className="text-xs font-bold text-cyan-300 mb-2">🔧 Rekomendasi Build</p>
        <div className="space-y-1">
          {items.map(([label, name]) => (
            <div key={label} className="flex justify-between text-xs gap-2">
              <span className="text-slate-400">{label}</span>
              <span className="text-slate-200 text-right">{name}</span>
            </div>
          ))}
        </div>
        {rec.totalEstimasi ? (
          <div className="flex justify-between mt-2 pt-2 border-t border-slate-700 text-xs">
            <span className="text-slate-400">Estimasi</span>
            <span className="font-bold text-cyan-300">{fmt(rec.totalEstimasi)}</span>
          </div>
        ) : null}
        {rec.alasan ? (
          <p className="mt-2 text-[11px] text-slate-400 italic leading-relaxed">{rec.alasan}</p>
        ) : null}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => applyRec(rec)}
            className="flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition"
          >
            ✅ Terapkan ke Build
          </button>
          <button
            onClick={clearPendingRecommendation}
            className="px-2 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 transition"
          >
            ❌ Lewati
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative border border-slate-300 rounded-xl bg-surface-2 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-2/70 hover:bg-surface-2 transition"
      >
        <span className="font-semibold text-foreground">🤖 Konsultasi Rakit PC (AI)</span>
        <span className="text-tertiary text-sm">{chatOpen ? "▲" : "▼"}</span>
      </button>

      {chatOpen && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-slate-500 text-sm text-center py-8">
                <p className="mb-2">Tanya rekomendasi rakit PC ke AI!</p>
                <p className="text-xs">Contoh: &quot;Rakit PC gaming budget 15 juta&quot;</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {["Rakit PC gaming 15jt", "PC buat edit video 20jt", "PC hemat 5jt"].map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="px-3 py-1.5 text-xs rounded-full bg-surface-2 border border-slate-300 text-muted hover:border-accent hover:text-accent transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                      : "bg-surface-2 text-foreground border border-slate-300"
                  }`}
                >
                  {m.content}
                                    {m.role === "assistant" && pendingRecommendation && i === messages.length - 1 && renderRecCard(pendingRecommendation)}
                                  </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg text-sm bg-surface-2 text-tertiary border border-slate-300">
                  Mengetik...
                </div>
              </div>
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>

          {/* Live summary sync */}
          {summary && (
            <div className="border-t border-slate-300 bg-surface-2/60 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-accent">📋 Ringkasan Build (Live)</span>
                <button
                  onClick={() => setSummary(null)}
                  className="text-xs text-slate-500 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {summary.parts.map((p) => (
                  <div key={p.id} className="flex justify-between text-xs">
                    <span className="text-tertiary">{p.name}</span>
                    <span className="text-muted">{fmt(p.price)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-slate-300">
                <span className="text-xs text-tertiary">Total</span>
                <span className="text-xs font-bold text-accent">{fmt(summary.total)}</span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-slate-300">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tanya AI soal rakit PC..."
              className="flex-1 px-3 py-2 text-sm bg-surface border border-slate-300 rounded-lg text-foreground placeholder:text-tertiary focus:border-accent"
            />
            <button
              onClick={() => send()}
                            disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
            >
              Kirim
            </button>
          </div>
        </>
      )}

      {/* Toast notif */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-500/90 text-white text-xs font-semibold shadow-lg animate-fade-in-up">
          {toast}
        </div>
      )}
    </div>
  );
}