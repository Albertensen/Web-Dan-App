"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Loader2, ArrowRight } from "lucide-react";

interface Thread {
  id: string;
  title: string;
  category_name?: string;
  category_slug?: string;
  reply_count?: number;
  view_count?: number;
}

export default function RelatedForumThreads({
  productName,
  brand,
  category,
}: {
  productName: string;
  brand: string;
  category: string;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    // Ambil diskusi terkait atau diskusi populer terbaru
    fetch(`/api/forum/threads?limit=5`)
      .then((r) => r.json())
      .then((j) => {
        if (alive) setThreads(j.data ?? []);
      })
      .catch(() => {
        if (alive) setThreads([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [productName, brand, category]);

  if (loading) {
    return (
      <div className="py-6 flex items-center justify-center gap-2 text-xs text-tertiary">
        <Loader2 size={16} className="animate-spin text-accent" />
        <span>Memuat diskusi komunitas...</span>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-surface border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <p className="text-xs sm:text-sm text-tertiary">
          Belum ada thread diskusi untuk produk ini.
        </p>
        <Link
          href={`/forum/new?title=${encodeURIComponent(`[Tanya] ${productName}`)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-secondary transition shadow-sm"
        >
          Mulai Diskusi Pertama →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {threads.map((t) => (
        <Link
          key={t.id}
          href={`/forum/${t.category_slug || "hardware"}/${t.id}`}
          className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface hover:border-accent hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3 min-w-0">
            <span className="p-2 rounded-xl bg-accent/10 text-accent shrink-0 mt-0.5 group-hover:scale-105 transition">
              <MessageSquare size={16} />
            </span>
            <div className="min-w-0">
              <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-surface-2 text-tertiary mb-1">
                {t.category_name || "Hardware"}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-accent transition leading-snug line-clamp-2 break-words">
                {t.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-[11px] text-tertiary">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {t.reply_count || 0} balasan
            </span>
            <span className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-muted group-hover:text-accent group-hover:bg-accent/10 transition">
              <ArrowRight size={13} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
