"use client";

import { useState, useRef, useEffect } from "react";
import { useBuilderStore, type RecommendedBuild } from "@/store/builderStore";
import { Bot, Sparkles, Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

const QUICK_PROMPTS = [
  { label: "🎮 Gaming 1440p (15-18 Juta)", prompt: "Rekomendasikan rakit PC gaming 1440p rata kanan budget 18 juta" },
  { label: "💰 Budget Hemat (7-10 Juta)", prompt: "Rakit PC gaming budget hemat 8 juta performa maksimal" },
  { label: "🤖 AI & 3D Render (25-30 Juta)", prompt: "Rakit PC untuk local LLM AI, Blender 3D dan video editing budget 28 juta" },
  { label: "⚡ Esports 240Hz (12 Juta)", prompt: "Rakit PC fokus Valorant dan CS2 stabil 240Hz budget 12 juta" },
];

export default function PCBuilderChatInterface() {
  const {
    messages, addMessage, applyRecommendation,
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

  const send = async (customPrompt?: string) => {
    const text = (customPrompt ?? input).trim();
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
      if (json.hasRecommendation && json.recommendation) {
        applyRecommendation(json.recommendation as RecommendedBuild);
        setToast("✨ AI otomatis memasang komponen ke Casing & Canvas!");
      }
    } catch {
      setError("Gagal terhubung ke AI Agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col h-[600px] overflow-hidden">
      {/* Header Futuristik */}
      <div className="p-4 bg-slate-950/80 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Bot size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                AI Hardware Copilot <Sparkles size={14} className="text-cyan-400 fill-cyan-400" />
              </h3>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Siap Meracik PC Bebas Bottleneck
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          v2.5 AI
        </span>
      </div>

      {/* Area Percakapan */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.length === 0 ? (
          <div className="space-y-4 py-4 text-center">
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-slate-300 space-y-2">
              <p className="font-bold text-cyan-300 text-sm">💡 Bingung Memilih Komponen?</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ketik kebutuhan dan budget Anda di bawah, AI akan langsung memilihkan part yang 100% kompatibel dan memasangkannya ke visual casing!
              </p>
            </div>

            <div className="text-left space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Pilihan Rekomendasi Cepat:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => send(q.prompt)}
                    className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-cyan-400 hover:bg-slate-800 text-left text-slate-200 transition flex items-center justify-between group cursor-pointer"
                  >
                    <span className="font-semibold text-[11px] group-hover:text-cyan-300 transition">
                      {q.label}
                    </span>
                    <Sparkles size={12} className="text-slate-500 group-hover:text-cyan-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-cyan-600 text-white rounded-br-none font-medium"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin" />
              <span>AI sedang menganalisis kompatibilitas &amp; watt...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input Box Futuristik */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-cyan-500/30 rounded-2xl p-1.5 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya AI (cth: PC editing 4K 15 juta)..."
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-40 cursor-pointer"
          >
            <Send size={13} />
            <span>Kirim</span>
          </button>
        </form>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xl flex items-center gap-1.5 animate-bounce">
          <CheckCircle2 size={14} />
          {toast}
        </div>
      )}
    </div>
  );
}
