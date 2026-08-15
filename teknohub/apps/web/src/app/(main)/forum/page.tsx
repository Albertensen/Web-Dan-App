import Link from "next/link";
import ThreadCard, { type ThreadProps } from "@/components/forum/ThreadCard";

interface ForumPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    tag?: string;
    search?: string;
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
  const search = searchParams.search || "";

  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forum/threads?category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}&tag=${encodeURIComponent(tag)}&search=${encodeURIComponent(search)}`;

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
          <h1 className="text-3xl font-bold mb-2">Forum Komunitas</h1>
          <p className="text-tertiary">Diskusi hardware, AI, gaming, dan DIY</p>
        </div>
        <Link
          href="/forum/new"
          className="px-4 py-2 rounded-xl bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          + Buat Thread
        </Link>
      </div>

      {/* Search forum */}
      <form action="/forum" method="GET" className="mb-6 flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Cari thread di forum..."
          className="flex-1 px-4 py-2 bg-surface-2 border border-slate-300 rounded-lg text-foreground text-sm focus:ring-accent/40 focus:border-accent placeholder:text-tertiary"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-surface-2 border border-slate-300 rounded-lg text-sm text-muted hover:border-accent hover:text-accent transition"
        >
          Cari
        </button>
      </form>

      {/* Kategori pills — horizontal scroll di mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
        <Link
          href="/forum"
          className={`px-4 py-2 rounded-full text-sm transition ${
            !category
              ? "bg-accent text-white"
              : "bg-surface-2 text-muted hover:bg-surface-2"
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
                ? "bg-accent text-white"
                : "bg-surface-2 text-muted hover:bg-surface-2"
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
            className="px-3 py-1 rounded-full bg-accent-dim text-accent border border-accent/30"
          >
            #{tag} ✕
          </Link>
        </div>
      )}

      {/* Sort */}
      <div className="flex gap-2 mb-8 text-sm">
        <Link
          href={category ? `/forum?category=${category}&sort=latest` : "/forum?sort=latest"}
          className={sort === "latest" ? "text-accent font-semibold" : "text-tertiary hover:text-accent"}
        >
          Terbaru
        </Link>
        <span className="text-slate-600">|</span>
        <Link
          href={category ? `/forum?category=${category}&sort=popular` : "/forum?sort=popular"}
          className={sort === "popular" ? "text-accent font-semibold" : "text-tertiary hover:text-accent"}
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
        <div className="flex flex-col items-center justify-center gap-5 text-center py-16 px-6 border border-dashed border-slate-300 rounded-2xl bg-surface-2/40">
          <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center text-slate-400 shadow-sm border border-slate-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-11 h-11">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Belum ada thread</h2>
            <p className="text-muted text-sm mt-1">Jadilah yang pertama memulai diskusi di forum ini</p>
          </div>
          <Link
            href="/forum/new"
            className="bg-accent hover:bg-accent-secondary text-white px-8 py-3 rounded-full font-semibold transition shadow-sm"
          >
            + Buat Thread Pertama
          </Link>
        </div>
      )}
    </main>
  );
}
