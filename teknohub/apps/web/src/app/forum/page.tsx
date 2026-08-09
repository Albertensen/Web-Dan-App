import Link from "next/link";
import ThreadCard, { type ThreadProps } from "@/components/forum/ThreadCard";

interface ForumPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    tag?: string;
  };
}

const CATEGORIES = [
  { slug: "hardware", label: "Hardware" },
  { slug: "ai", label: "AI" },
  { slug: "gaming", label: "Gaming" },
  { slug: "mobile", label: "Mobile" },
  { slug: "diy", label: "DIY" },
  { slug: "jual-beli", label: "Jual Beli" },
];

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const category = searchParams.category || "";
  const sort = searchParams.sort || "latest";
  const tag = searchParams.tag || "";

  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forum/threads?category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}&tag=${encodeURIComponent(tag)}`;

  let threads: ThreadProps[] = [];
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      threads = json.data ?? [];
    }
  } catch (e) {
    console.error("Error fetching threads:", e);
  }

  return (
    <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forum Tech & AI</h1>
          <p className="text-slate-400">Diskusi hardware, AI, gaming, dan DIY</p>
        </div>
        <Link
          href="/forum/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          + Buat Thread
        </Link>
      </div>

      {/* Kategori pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/forum"
          className={`px-4 py-2 rounded-full text-sm transition ${
            !category
              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Semua
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/forum?category=${c.slug}`}
            className={`px-4 py-2 rounded-full text-sm transition ${
              category === c.slug
                ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Tag filter */}
      {tag && (
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span className="text-slate-500">Filter tag:</span>
          <Link
            href="/forum"
            className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50"
          >
            #{tag} ✕
          </Link>
        </div>
      )}

      {/* Sort */}
      <div className="flex gap-2 mb-8 text-sm">
        <Link
          href={category ? `/forum?category=${category}&sort=latest` : "/forum?sort=latest"}
          className={sort === "latest" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-blue-400"}
        >
          Terbaru
        </Link>
        <span className="text-slate-600">|</span>
        <Link
          href={category ? `/forum?category=${category}&sort=popular` : "/forum?sort=popular"}
          className={sort === "popular" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-blue-400"}
        >
          Populer
        </Link>
      </div>

      {/* Thread list */}
      {threads.length > 0 ? (
        <div className="space-y-4">
          {threads.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      ) : (
        <div className="p-8 bg-slate-800/50 border border-dashed border-slate-600 rounded-xl text-center">
          <p className="text-lg font-medium text-slate-400">Belum ada thread</p>
          <p className="text-sm text-slate-500 mt-1">
            Jadilah yang pertama memulai diskusi!
          </p>
        </div>
      )}
    </main>
  );
}
