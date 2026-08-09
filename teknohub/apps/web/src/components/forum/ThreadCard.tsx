import Link from "next/link";
import TagBadge from "./TagBadge";
import { UserBadge } from "./UserBadge";

interface ThreadProps {
  id: string;
  title: string;
  category_name: string | null;
  category_slug: string | null;
  author_username: string | null;
  author_avatar: string | null;
  author_reputation: number | null;
  reply_count: number;
  view_count: number;
  last_reply_at: string | null;
  is_pinned: boolean;
  tags: string[] | null;
  created_at: string;
}

interface ThreadCardProps {
  thread: ThreadProps;
}

export type { ThreadProps };

/** Waktu relatif: "5 menit lalu", "2 jam lalu", dst */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(iso));
}

const CATEGORY_COLORS: Record<string, string> = {
  Hardware: "bg-accent-dim text-accent border-accent/30",
  AI: "bg-violet-100 text-violet-700 border-violet-300",
  Mobile: "bg-blue-100 text-blue-700 border-blue-300",
  Gaming: "bg-emerald-100 text-emerald-700 border-emerald-300",
  DIY: "bg-amber-100 text-amber-700 border-amber-300",
  "Jual Beli": "bg-pink-100 text-pink-700 border-pink-300",
};

export default function ThreadCard({ thread }: ThreadCardProps) {
  const catClass = CATEGORY_COLORS[thread.category_name ?? ""] ?? "bg-accent-dim text-accent border-accent/30";

  return (
    <Link href={`/forum/${thread.category_slug}/${thread.id}`} className="block">
      <div className="bg-surface border border-slate-300 rounded-2xl p-5 shadow-sm hover:border-accent transition duration-300 hover:shadow-md">
        {thread.is_pinned && (
          <div className="mb-3 inline-block px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 border border-amber-300">
            📌 Disematkan
          </div>
        )}

        <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-4 tracking-tight hover:text-accent transition-colors cursor-pointer">
          {thread.title}
        </h3>

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} href={`/forum?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted pt-2 border-t border-slate-200">
          {/* Category Badge */}
          {thread.category_name && thread.category_slug ? (
            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${catClass}`}>
              {thread.category_name}
            </span>
          ) : null}

          {/* Author */}
          <div className="flex items-center gap-2 text-xs">
            {!thread.author_avatar ? (
              <span className="w-6 h-6 bg-surface-2 rounded-full flex items-center justify-center text-xs text-accent">
                {thread.author_username?.[0]?.toUpperCase() || "?"}
              </span>
            ) : (
              <img src={thread.author_avatar} alt={`${thread.author_username}'s avatar`} className="w-6 h-6 object-cover rounded-full" />
            )}
            <span className="text-foreground">{thread.author_username || "Anonim"}</span>
            <UserBadge reputation={thread.author_reputation} />
          </div>

          {/* Counts */}
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              💬 {thread.reply_count} Balasan
            </span>
            <span className="flex items-center gap-1">
              👁 {thread.view_count} Dilihat
            </span>
          </div>

          {/* Date */}
          <span className="text-xs text-tertiary flex-shrink-0 mt-2 sm:mt-0">
            {relativeTime(thread.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
