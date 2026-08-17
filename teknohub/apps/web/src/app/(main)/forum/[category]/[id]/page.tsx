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

  let thread: Record<string, unknown> | null = null;
  let replies: Record<string, unknown>[] = [];

  try {
    const admin = getServiceClient();

    // 1) Coba view thread_details
    const q = await admin.from("thread_details").select("*").eq("id", id).maybeSingle();
    if (q.error || !q.data) {
      // Fallback: query langsung tabel threads + join manual
      const direct = await getServiceClient()
        .from("threads")
        .select("id, title, content, category_id, author_id, is_pinned, is_locked, view_count, reply_count, last_reply_at, created_at, updated_at, tags")
        .eq("id", id)
        .maybeSingle();
      if (direct.data) {
        // resolve category + author
        const cat = await getServiceClient().from("forum_categories").select("name, slug").eq("id", direct.data.category_id).maybeSingle();
        const prof = await getServiceClient().from("profiles").select("username, avatar_url, reputation").eq("id", direct.data.author_id).maybeSingle();
        thread = {
          ...direct.data,
          category_name: cat.data?.name ?? category,
          category_slug: cat.data?.slug ?? category,
          author_username: prof.data?.username ?? "Anon",
          author_reputation: prof.data?.reputation ?? 0,
          content: direct.data.content,
        };
      } else {
        notFound();
      }
    } else {
      thread = q.data;
    }

    // 2) Ambil balasan (replies/forum_replies)
    const rr = await getServiceClient().from("replies").select("id, content, is_solution, created_at, author_id").eq("thread_id", id).order("created_at", { ascending: true });
    if (!rr.error && rr.data) replies = rr.data;
  } catch {
    notFound();
  }

  if (!thread) {
    notFound();
  }

  const data = thread as {
    id: string;
    title: string;
    content: string;
    category_name: string;
    category_slug: string;
    author_id?: string | null;
    author_username?: string;
    author_reputation?: number;
    view_count?: number;
    reply_count?: number;
    created_at?: string;
    tags?: string[];
  };

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id ?? undefined;
  const threadAuthorId = (data.author_id as string) ?? undefined;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teknohub-web.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: data.title ?? data.subject ?? "Diskusi Forum",
    author: { "@type": "Person", name: "TeknoHub Member" },
    datePublished: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
    text: data.content ?? "",
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
        <span className="font-medium text-foreground">{data.category_name || category}</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="glow-card p-6 sm:p-8">
          <header className="mb-8 pb-4 border-b border-slate-300">
            <h1 className="text-3xl font-bold text-foreground mb-2">{data.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-tertiary">
              <span>
                Oleh: <span className="font-medium text-accent">{data.author_username}</span>
                <UserBadge reputation={data.author_reputation} />
              </span>
              <span className="inline-flex items-center gap-1"><Eye size={14} /> {data.view_count}</span>
              <span><MessageSquare size={16} className="inline mr-1" /> {data.reply_count}</span>
              <span className="inline-flex items-center gap-1"><Calendar size={14} /> {formatDate(data.created_at)}</span>
            </div>
          </header>

          <ProductMention text={data.content ?? ""} />
          <div
            className="prose max-w-none text-muted mb-8 p-4 bg-surface-2 rounded-lg border border-slate-300/50"
            dangerouslySetInnerHTML={{ __html: renderMentions(data.content ?? "") }}
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