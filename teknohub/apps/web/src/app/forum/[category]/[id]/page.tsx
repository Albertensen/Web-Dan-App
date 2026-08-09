import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";
import VoteControl from "@/components/forum/VoteControl";
import ReplySection from "@/components/forum/ReplySection";

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

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id ?? undefined;
  const threadAuthorId = (thread.author_id as string) ?? undefined;

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

          <div
            className="prose prose-invert max-w-none text-slate-300 mb-8 p-4 bg-[#12121a] rounded-lg border border-slate-700/50"
            dangerouslySetInnerHTML={{ __html: thread.content }}
          />

          <div className="mb-10 flex justify-center">
            <VoteControl threadId={thread.id} />
          </div>
        </div>

        <div className="mt-8">
          <ReplySection
            threadId={thread.id}
            initialReplies={replies ?? []}
            currentUserId={currentUserId}
            threadAuthorId={threadAuthorId}
          />
        </div>
      </div>
    </div>
  );
}
