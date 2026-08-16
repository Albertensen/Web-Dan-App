"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Loader2 } from "lucide-react";

interface Thread {
  id: string;
  title: string;
  category_name: string;
  category_slug: string;
  reply_count: number;
}

// Mengambil thread forum yang relevan dengan produk (nama/merk/kategori produk).
export default function RelatedForumThreads({ productName, brand, category }: { productName: string; brand: string; category: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const words = [brand, category, productName].filter(Boolean);
    const term = words.join(" ");
    setLoading(true);
    fetch(`/api/forum/threads?search=${encodeURIComponent(term)}&sort=popular`)
      .then((r) => r.json())
      .then((j) => { if (alive) setThreads((j.data ?? []).slice(0, 4)); })
      .catch(() => { if (alive) setThreads([]); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [productName, brand, category]);

  return (
    <div className="pt-6 border-t border-border">
      <h2 className="text-xl font-semibold mb-4 text-muted">💬 Diskusi Komunitas Terkait</h2>
      {loading ? (
        <p className="text-sm text-tertiary flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Memuat diskusi...</p>
      ) : threads.length === 0 ? (
        <p className="text-sm text-tertiary">Belum ada thread forum yang membahas produk ini. Jadilah yang pertama di <Link href="/forum/new" className="text-accent hover:underline">Forum</Link>.</p>
      ) : (
        <div className="space-y-2">
          {threads.map((t) => (
            <Link key={t.id} href={`/forum/${t.category_slug}/${t.id}`} className="flex items-center gap-3 p-3 border border-border rounded-xl bg-surface hover:border-accent transition">
              <MessageSquare size={16} className="text-accent shrink-0" />
              <span className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{t.title}</span>
              <span className="shrink-0 text-[11px] text-tertiary">{t.reply_count} balasan</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
