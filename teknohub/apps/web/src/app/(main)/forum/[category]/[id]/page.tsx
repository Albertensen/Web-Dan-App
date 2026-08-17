import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";
import VoteControl from "@/components/forum/VoteControl";
import ReplySection from "@/components/forum/ReplySection";
import FollowButton from "@/components/forum/FollowButton";
import ReportButton from "@/components/forum/ReportButton";
import { UserBadge } from "@/components/forum/UserBadge";
import { MessageSquare, Eye, Calendar, ArrowLeft } from "lucide-react";
import ProductMention, { renderMentions } from "@/components/forum/ProductMention";

export const dynamic = "force-dynamic";

interface ThreadDetailProps {
  params: { category: string; id: string };
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "-";
  }
};

export default async function ThreadDetailPage({ params }: ThreadDetailProps) {
  const { category, id } = params;
  const sb = getSupabase();

  let threadData: Record<string, unknown> | null = null;
  let repliesData: Record<string, unknown>[] = [];

  try {
    // 1. Query langsung tabel threads dengan relasi join aman
    const { data: t, error: tErr } = await sb
      .from("threads")
      .select("*, profiles(username, avatar_url, reputation), forum_categories(name, slug)")
      .eq("id", id)
      .maybeSingle();

    if (!tErr && t) {
      const raw = t as Record<string, unknown>;
      const fc = (raw.forum_categories ?? {}) as Record<string, unknown>;
      const prof = (raw.profiles ?? {}) as Record<string, unknown>;
      threadData = {
        ...raw,
        category_name: (fc.name as string) ?? category,
        category_slug: (fc.slug as string) ?? category,
        author_username: (prof.username as string) ?? "Member TeknoHub",
        author_reputation: (prof.reputation as number) ?? 0,
      };
    } else {
      // Fallback coba query view thread_details jika ada
      const { data: td } = await sb.from("thread_details").select("*").eq("id", id).maybeSingle();
      if (td) threadData = td;
    }

    // 2. Query replies
    const { data: r } = await sb
      .from("replies")
      .select("id, content, is_solution, created_at, author_id, profiles(username, avatar_url, reputation)")
      .eq("thread_id", id)
      .order("created_at", { ascending: true });

    if (r) repliesData = r;
  } catch (e) {
    console.error("Error loading forum thread:", e);
  }

  if (!threadData) {
    notFound();
  }

  // Ambil user session dengan aman tanpa crash jika auth offline
  let currentUserId: string | undefined = undefined;
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    currentUserId = session?.user?.id;
  } catch {
    currentUserId = undefined;
  }

  const title = (threadData.title as string) || "Diskusi Komunitas";
  const content = (threadData.content as string) || "";
  const authorName = (threadData.author_username as string) || "Member TeknoHub";
  const authorReputation = Number(threadData.author_reputation || 0);
  const viewCount = Number(threadData.view_count || 0);
  const replyCount = repliesData.length || Number(threadData.reply_count || 0);
  const createdAt = (threadData.created_at as string) || "";
  const categoryName = (threadData.category_name as string) || category;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: title,
    author: { "@type": "Person", name: authorName },
    datePublished: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
    text: content,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: replyCount,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-surface text-foreground p-4 sm:p-8">
        {/* Breadcrumb & Back */}
        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
          <div className="text-xs sm:text-sm text-tertiary flex items-center gap-2">
            <Link href="/forum" className="hover:text-accent flex items-center gap-1 font-semibold">
              <ArrowLeft size={14} /> Forum
            </Link>
            <span>/</span>
            <span className="font-bold text-foreground capitalize">{categoryName}</span>
          </div>
          <Link
            href="/forum/new"
            className="text-xs font-bold text-accent hover:underline"
          >
            + Buat Thread Baru
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Thread Card */}
          <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <header className="border-b border-slate-200 dark:border-slate-800 pb-5">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent-dim text-accent mb-3">
                {categoryName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight tracking-tight mb-3">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-tertiary">
                <div className="flex items-center gap-1.5">
                  <span>Oleh:</span>
                  <span className="font-bold text-accent">{authorName}</span>
                  <UserBadge reputation={authorReputation} />
                </div>
                <span className="flex items-center gap-1"><Eye size={14} /> {viewCount} tayangan</span>
                <span className="flex items-center gap-1"><MessageSquare size={14} /> {replyCount} balasan</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(createdAt)}</span>
              </div>
            </header>

            {/* Render Mentions & Content */}
            <ProductMention text={content} />
            <div
              className="prose dark:prose-invert max-w-none text-tertiary leading-relaxed text-sm sm:text-base whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: renderMentions(content) }}
            />

            {/* Thread Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
              <VoteControl threadId={id} />
              {currentUserId && (
                <div className="flex items-center gap-2">
                  <FollowButton targetType="thread" targetId={id} />
                  <ReportButton targetType="thread" targetId={id} />
                </div>
              )}
            </div>
          </div>

          {/* Section Replies */}
          <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <ReplySection
              threadId={id}
              initialReplies={repliesData as unknown as Parameters<typeof ReplySection>[0]["initialReplies"]}
              currentUserId={currentUserId}
              threadAuthorId={threadData.author_id as string | undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}
