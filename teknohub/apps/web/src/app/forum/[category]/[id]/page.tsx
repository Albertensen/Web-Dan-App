import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import VoteControl from "@/components/forum/VoteControl";

interface ThreadDetailProps {
  params: { category: string; id: string };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });

export default async function ThreadDetailPage({ params }: ThreadDetailProps) {
  const { category, id } = params;

  const { data: thread, error } = await supabase
    .from("thread_details")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !thread) {
    notFound();
  }

  const { data: replies } = await supabase
    .from("replies")
    .select("id, content, is_solution, created_at, author_id")
    .eq("thread_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 sm:p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/forum" className="hover:text-blue-400">
          Forum
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-200">{thread.category_name || category}</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="glow-card p-6 sm:p-8">
          <header className="mb-8 pb-4 border-b border-slate-700">
            <h1 className="text-3xl font-bold text-white mb-2">{thread.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <span>
                Oleh: <span className="font-medium text-blue-400">{thread.author_username}</span>
              </span>
              <span>👁 {thread.view_count}</span>
              <span>💬 {thread.reply_count}</span>
              <span>📅 {formatDate(thread.created_at)}</span>
            </div>
          </header>

          <div className="text-slate-300 whitespace-pre-wrap mb-8 p-4 bg-[#12121a] rounded-lg border border-slate-700/50">
            {thread.content}
          </div>

          <div className="mb-10 flex justify-center">
            <VoteControl threadId={thread.id} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b pb-2 border-slate-700">
            Balasan ({(replies ?? []).length})
          </h2>

          {(replies ?? []).length === 0 ? (
            <p className="text-slate-400 text-sm">Belum ada balasan. Jadilah yang pertama!</p>
          ) : (
            (replies ?? []).map((reply) => (
              <div key={reply.id} className="glow-card p-4 mb-4">
                <div className={`text-slate-200 mb-1 ${reply.is_solution ? "text-green-300" : ""}`}>
                  {reply.content}
                </div>
                <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-800">
                  <div className="text-slate-400">
                    <span className="font-medium text-blue-400">User {reply.author_id.slice(-4)}</span>
                    <span className="mx-2">•</span>
                    {formatDate(reply.created_at)}
                  </div>
                  {reply.is_solution && (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-600/20 text-green-400 rounded-full border border-green-700">
                      ✅ Solusi
                    </span>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="mt-8 p-6 glow-card">
            <h3 className="text-xl font-bold text-white mb-4">Tambahkan Balasan</h3>
            <p className="text-sm text-slate-400 mb-4">Login untuk membalas diskusi.</p>
            <form
              action="/api/auth/signin"
              className="space-y-4"
            >
              <textarea
                placeholder="Tulis balasan Anda di sini..."
                rows={6}
                className="w-full p-3 bg-[#0a0a0f] border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold rounded-lg transition duration-300"
              >
                Kirim Balasan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
