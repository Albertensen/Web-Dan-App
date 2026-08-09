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

export default function ThreadCard({ thread }: ThreadCardProps) {
  const formatDate = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(thread.created_at));

  return (
    <Link href={`/forum/${thread.category_slug}/${thread.id}`} className="block">
      <div className="glow-card p-5 hover:border-blue-500/50 transition border border-slate-800/50 bg-[#12121a] hover:bg-[#1a1a23]">
        {thread.is_pinned && (
          <div className="mb-3 inline-block px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-700/50">
            📌 Disematkan
          </div>
        )}

        <h3 className="text-xl font-semibold text-slate-100 line-clamp-2 mb-4 hover:text-blue-400 transition cursor-pointer">
          {thread.title}
        </h3>

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} href={`/forum?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 pt-2 border-t border-slate-800/50">
          {/* Category Badge */}
          {thread.category_name && thread.category_slug ? (
            <span className="flex items-center gap-1 bg-violet-500/20 text-violet-300 text-xs font-medium px-2 py-0.5 rounded-full border border-violet-700/50">
              {thread.category_name}
            </span>
          ) : null}

          {/* Author */}
          <div className="flex items-center gap-2 text-xs">
            {!thread.author_avatar ? (
                <span className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-sm">{thread.author_username?.[0]?.toUpperCase() || '?'}</span>
            ) : (
              <img src={thread.author_avatar} alt={`${thread.author_username}'s avatar`} className="w-6 h-6 object-cover rounded" />
            )}
            <span>{thread.author_username || "Anonim"}</span>
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
          <span className="text-xs text-slate-500 flex-shrink-0 mt-2 sm:mt-0">
            {formatDate}
          </span>
        </div>
      </div>
    </Link>
  );
}