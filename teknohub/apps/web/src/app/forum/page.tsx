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
          className="px-4 py-2 rounded-xl bg-accent font-semibold text-sm hover:opacity-90 transition-opacity"
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
        <div className="p-8 bg-surface-2/60 border border-dashed border-slate-300 rounded-xl text-center">
          <p className="text-lg font-medium text-tertiary">Belum ada thread</p>
          <p className="text-sm text-slate-500 mt-1">
            Jadilah yang pertama memulai diskusi!
          </p>
        </div>
      )}
    </main>
  );
}
