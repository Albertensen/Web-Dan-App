"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import VoteControl from "@/components/forum/VoteControl";
import ReplySection from "@/components/forum/ReplySection";
import FollowButton from "@/components/forum/FollowButton";
import ReportButton from "@/components/forum/ReportButton";
import { UserBadge } from "@/components/forum/UserBadge";
import { MessageSquare, Eye, Calendar, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import ProductMention, { renderMentions } from "@/components/forum/ProductMention";

interface ThreadData {
  id: string;
  title: string;
  content: string;
  category_name?: string;
  category_slug?: string;
  author_id?: string;
  author_username?: string;
  author_reputation?: number;
  view_count?: number;
  reply_count?: number;
  created_at?: string;
  tags?: string[];
}

export default function ThreadDetailPage() {
  const params = useParams();
  const category = (params?.category as string) || "hardware";
  const id = params?.id as string;
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [thread, setThread] = useState<ThreadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadThread() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/forum/threads`);
        if (!res.ok) throw new Error("Gagal menghubungi server forum.");
        const json = await res.json();
        const found = (json.data || []).find((t: ThreadData) => t.id === id);

        if (!found) {
          if (isMounted) setError("Thread diskusi ini tidak ditemukan atau telah dihapus.");
          return;
        }

        if (isMounted) {
          setThread(found);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal memuat detail diskusi.";
        if (isMounted) setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadThread();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-6 text-tertiary">
        <Loader2 size={32} className="animate-spin text-accent" />
        <p className="text-sm font-semibold">Memuat diskusi forum...</p>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-[60vh] max-w-lg mx-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-black text-foreground">Diskusi Tidak Ditemukan</h2>
        <p className="text-xs sm:text-sm text-tertiary">{error || "Thread yang Anda cari tidak tersedia."}</p>
        <Link
          href="/forum"
          className="px-5 py-2.5 rounded-full bg-accent text-white font-bold text-xs hover:bg-accent-secondary transition shadow-md"
        >
          ← Kembali ke Forum
        </Link>
      </div>
    );
  }

  const categoryName = thread.category_name || category;
  const authorName = thread.author_username || "Member TeknoHub";
  const authorRep = Number(thread.author_reputation || 0);

  return (
    <div className="min-h-screen bg-surface text-foreground p-4 sm:p-8">
      {/* Breadcrumb & Navigation */}
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
        {/* Main Post Card */}
        <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <header className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent-dim text-accent mb-3">
              {categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight tracking-tight mb-3">
              {thread.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-tertiary">
              <div className="flex items-center gap-1.5">
                <span>Oleh:</span>
                <span className="font-bold text-accent">{authorName}</span>
                <UserBadge reputation={authorRep} />
              </div>
              <span className="flex items-center gap-1"><Eye size={14} /> {thread.view_count || 0} tayangan</span>
              <span className="flex items-center gap-1"><MessageSquare size={14} /> {thread.reply_count || 0} balasan</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(thread.created_at)}</span>
            </div>
          </header>

          {/* Product Mentions & Content */}
          <ProductMention text={thread.content} />
          <div
            className="prose dark:prose-invert max-w-none text-tertiary leading-relaxed text-sm sm:text-base whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: renderMentions(thread.content) }}
          />

          {/* Thread Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
            <VoteControl threadId={thread.id} />
            {currentUserId && (
              <div className="flex items-center gap-2">
                <FollowButton targetType="thread" targetId={thread.id} />
                <ReportButton targetType="thread" targetId={thread.id} />
              </div>
            )}
          </div>
        </div>

        {/* Section Replies */}
        <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <ReplySection
            threadId={thread.id}
            initialReplies={[]}
            currentUserId={currentUserId}
            threadAuthorId={thread.author_id}
          />
        </div>
      </div>
    </div>
  );
}
