import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";
import { createClient } from "@supabase/supabase-js";

// Server-side admin client utk baca thread & replies (hindari blokir RLS saat SSR)
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return supabase;
  return createClient(url, key);
}
import VoteControl from "@/components/forum/VoteControl";
import ReplySection from "@/components/forum/ReplySection";
import FollowButton from "@/components/forum/FollowButton";
import ReportButton from "@/components/forum/ReportButton";
import { UserBadge } from "@/components/forum/UserBadge";
import { MessageSquare , Eye, Calendar } from "lucide-react";
import ProductMention, { renderMentions } from "@/components/forum/ProductMention";

export const dynamic = "force-dynamic";

interface ThreadDetailProps {
  params: { category: string; id: string };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });

export default async function ThreadDetailPage({ params }: ThreadDetailProps) {
  const { category, id } = params;

  const admin = getServiceClient();
  const { data: thread, error } = await admin
    .from("thread_details")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !thread) {
    notFound();
  }

  const { data: replies } = await admin
    .from("replies")
    .select("id, content, is_solution, created_at, author_id")
    .eq("thread_id", id)
    .order("created_at", { ascending: true });

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id ?? undefined;
  const threadAuthorId = (thread.author_id as string) ?? undefined;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teknohub-web.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: thread.title ?? thread.subject ?? "Diskusi Forum",
    author: { "@type": "Person", name: "TeknoHub Member" },
    datePublished: thread.created_at ? new Date(thread.created_at).toISOString() : new Date().toISOString(),
    text: thread.content ?? "",
    discussionUrl: `${baseUrl}/forum/${category}/${id}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: replies?.length ?? 0,
    },
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="min-h-screen bg-surface text-foreground p-4 sm:p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-tertiary mb-6 flex items-center gap-2">
        <Link href="/forum" className="hover:text-accent">
          Forum
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{thread.category_name || category}</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="glow-card p-6 sm:p-8">
          <header className="mb-8 pb-4 border-b border-slate-300">
            <h1 className="text-3xl font-bold text-foreground mb-2">{thread.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-tertiary">
              <span>
                Oleh: <span className="font-medium text-accent">{thread.author_username}</span>
                <UserBadge reputation={thread.author_reputation} />
              </span>
              <span className="inline-flex items-center gap-1"><Eye size={14} /> {thread.view_count}</span>
              <span><MessageSquare size={16} className="inline mr-1" /> {thread.reply_count}</span>
              <span className="inline-flex items-center gap-1"><Calendar size={14} /> {formatDate(thread.created_at)}</span>
            </div>
          </header>

          <ProductMention text={thread.content ?? ""} />
          <div
            className="prose max-w-none text-muted mb-8 p-4 bg-surface-2 rounded-lg border border-slate-300/50"
            dangerouslySetInnerHTML={{ __html: renderMentions(thread.content ?? "") }}
          />

          <div className="mb-10 flex justify-center gap-4 items-center">
            <VoteControl threadId={thread.id} />
            {currentUserId && (
              <>
                <FollowButton targetType="thread" targetId={thread.id} />
                <ReportButton targetType="thread" targetId={thread.id} />
              </>
            )}
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
    </>
  );
}