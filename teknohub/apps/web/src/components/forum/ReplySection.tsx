"use client"
import { useState } from "react"
import ProductMention, { renderMentions } from "./ProductMention"
import SolutionButton from "./SolutionButton"
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("./TipTapEditor"), {
  ssr: false,
  loading: () => (
    <textarea
      placeholder="Tulis balasan Anda di sini..."
      rows={4}
      className="w-full p-4 rounded-2xl bg-surface border border-slate-300 dark:border-slate-800 text-foreground resize-none"
      disabled
    />
  ),
});
import ReportButton from "./ReportButton"

interface Reply {
  id: string;
  content: string;
  is_solution: boolean;
  created_at: string;
  author_id: string;
}

interface ReplySectionProps {
  threadId: string;
  initialReplies: Reply[];
  currentUserId?: string;
  threadAuthorId?: string;
}

export default function ReplySection({ threadId, initialReplies, currentUserId, threadAuthorId }: ReplySectionProps) {
  const [content, setContent] = useState("")
  const [replies, setReplies] = useState<Reply[]>(initialReplies)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const formatDate = (iso: string): string => new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const plain = content.replace(/<[^>]*>/g, "").trim()
    if (plain === "") {
      setError("Balasan tidak boleh kosong")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/forum/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId, content }),
      })

      if (!res.ok) throw new Error("gagal")

      const json = await res.json()
      setReplies([...replies, json.data])
      setContent("")
    } catch {
      setError("Gagal mengirim balasan. Pastikan sudah login.")
    } finally {
      setSubmitting(false)
    }
  }

  // Kadang content plain-text berisi markdown; kutip otomatis utk tombol balas
  const quoteReply = (reply: Reply) => {
    const plain = reply.content.replace(/<[^>]*>/g, "").replace(/\n/g, " ").slice(0, 120);
    const author = reply.author_id ? reply.author_id.slice(-4) : "Anon";
    const quote = `> @${author}: &quot;${plain}...&quot;\n\n`;
    setContent(quote);
    document.getElementById("reply-editor")?.focus();
  };

  const sortedReplies = [...replies].sort((a, b) => Number(b.is_solution) - Number(a.is_solution));

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6 border-b pb-2 border-slate-300">
        Balasan ({replies.length})
      </h2>

      {replies.length === 0 ? (
        <p className="text-tertiary text-sm mb-6">Belum ada balasan. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-4">
          {sortedReplies.map((reply) => (
            <div key={reply.id} className="glow-card p-4 mb-4 bg-surface border border-slate-300 rounded-xl shadow-lg">
              <ProductMention text={reply.content} />
              <div
                className="prose max-w-none text-foreground mb-1 text-sm"
                dangerouslySetInnerHTML={{ __html: renderMentions(reply.content) }}
              />
              {reply.is_solution && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-600/20 text-green-700 rounded-full border border-green-700 mb-2">
                  ✅ Solusi
                </span>
              )}
              <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-300">
                <span className="text-tertiary">
                  <span className="font-medium text-accent">{(reply.author_id ? `User ${reply.author_id.slice(-4)}` : "Anon")}</span>
                  <span className="mx-2">•</span>
                  {formatDate(reply.created_at)}
                </span>
                {currentUserId && currentUserId === threadAuthorId && (
                  <SolutionButton
                    replyId={reply.id}
                    isSolution={reply.is_solution}
                    onMarked={() => setReplies(replies.map((r) => (r.id === reply.id ? { ...r, is_solution: true } : r)))}
                  />
                )}
                {currentUserId && (
                  <button
                    type="button"
                    onClick={() => quoteReply(reply)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border border-slate-300 text-muted hover:text-accent hover:border-accent transition"
                  >
                    💬 Kutip / Balas
                  </button>
                )}
                {currentUserId && (
                  <ReportButton targetType="reply" targetId={reply.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <TipTapEditor value={content} onChange={setContent} placeholder="Tulis balasan Anda di sini..." />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-accent hover:bg-accent-secondary text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50"
        >
          {submitting ? "Mengirim..." : "Kirim Balasan"}
        </button>
      </form>
    </div>
  )
}