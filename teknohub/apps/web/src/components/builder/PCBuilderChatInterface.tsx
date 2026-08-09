"use client";

import { useState, useRef, useEffect } from "react";
import { useBuilderStore } from "@/store/builderStore";

export default function PCBuilderChatInterface() {
  const { summary, setSummary, chatOpen, setChatOpen, messages, addMessage } = useBuilderStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    addMessage({ role: "user", content: text });
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
      if (json.summary) {
        setSummary(json.summary);
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="border border-slate-300 rounded-xl bg-surface-2 overflow-hidden">
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
                      onClick={() => { setInput(q); send(); }}
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
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
            >
              Kirim
            </button>
          </div>
        </>
      )}
    </div>
  );
}
