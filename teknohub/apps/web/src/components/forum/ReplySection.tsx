"use client"
import { useState } from "react"

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
}

export default function ReplySection({ threadId, initialReplies }: ReplySectionProps) {
  const [content, setContent] = useState("")
  const [replies, setReplies] = useState<Reply[]>(initialReplies)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const formatDate = (iso: string): string => new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (content.trim() === "") {
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

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b pb-2 border-slate-700">
        Balasan ({replies.length})
      </h2>

      {replies.length === 0 ? (
        <p className="text-slate-400 text-sm mb-6">Belum ada balasan. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="glow-card p-4 mb-4 bg-[#1a1a20] border border-slate-800 rounded-xl shadow-lg">
              <div className="text-slate-200 mb-1 whitespace-pre-wrap">{reply.content}</div>
              {reply.is_solution && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-600/20 text-green-400 rounded-full border border-green-700 mb-2">
                  ✅ Solusi
                </span>
              )}
              <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-800">
                <span className="text-slate-400">
                  <span className="font-medium text-blue-400">User {reply.author_id.slice(-4)}</span>
                  <span className="mx-2">•</span>
                  {formatDate(reply.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Tulis balasan Anda di sini..."
          className="w-full p-3 bg-[#0a0a0f] border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white resize-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50"
        >
          {submitting ? "Mengirim..." : "Kirim Balasan"}
        </button>
      </form>
    </div>
  )
}