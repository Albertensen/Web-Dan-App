"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = ["Berapa lama rakit PC?", "Apa saja metode pembayaran?", "Cek status pesanan saya", "Garansi komponen berapa lama?"];

export default function AICustomerServiceWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const json = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: json.reply ?? "..." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Gagal terhubung. Coba lagi." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-accent text-white shadow-2xl shadow-accent/20 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Customer Service"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 max-h-[70vh] flex flex-col bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-accent flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🤖</div>
            <div>
              <div className="text-white font-semibold text-sm">TeknoHub CS</div>
              <div className="text-white/70 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online 24/7
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px]">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-tertiary text-sm mb-3">Halo! 👋 Ada yang bisa dibantu?</p>
                <div className="flex flex-col gap-2">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="px-3 py-2 text-xs rounded-lg bg-surface-2 border border-border text-muted hover:border-accent hover:text-accent transition text-left"
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
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-500/25 text-blue-100 border border-blue-500/30 rounded-br-sm"
                      : "bg-surface-2 text-foreground border border-border rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl text-xs bg-surface-2 text-tertiary border border-border">
                  Mengetik...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tulis pertanyaan..."
              className="flex-1 px-3 py-2 text-xs bg-surface border border-border rounded-lg text-foreground placeholder:text-tertiary focus:border-accent"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg bg-accent text-white text-xs font-medium disabled:opacity-50 hover:opacity-90 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
