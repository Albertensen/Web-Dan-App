"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Loader2, Store } from "lucide-react";

interface SearchProduct {
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  category: string;
  brand: string | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  laptop: "Laptop", smartphone: "Smartphone", monitor: "Monitor", gpu: "VGA / GPU", cpu: "Processor",
  ram: "RAM", storage: "SSD & Storage", motherboard: "Motherboard", psu: "Power Supply",
};

const CATEGORY_PATH: Record<string, string> = {
  laptop: "laptop", smartphone: "smartphone", monitor: "monitor", gpu: "gpu", cpu: "cpu",
  ram: "ram", storage: "storage", motherboard: "motherboard", psu: "psu",
};

export default function NavbarSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = term.trim();

  // fetch live
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (q.length < 2) { setResults([]); setLoading(false); setOpen(false); return; }
    setLoading(true);
    setOpen(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=6`);
        const json = await res.json();
        setResults(json.data ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q]);

  // tutup saat klik luar / esc
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    router.push(q ? `/shop/products?search=${encodeURIComponent(q)}` : "/shop/products");
  };

  // kategori terkait (maks 3) dari hasil
  const relatedCats = Array.from(new Set(results.map((r) => r.category)))
    .slice(0, 3);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div ref={wrapRef} className={`relative flex-1 min-w-0 ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <button
          type="submit"
          aria-label="Cari"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-accent transition"
        >
          <Search size={16} />
        </button>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => q.length >= 1 && setOpen(true)}
          placeholder="Cari produk atau komponen PC..."
          className="w-full px-4 py-2 pl-9 pr-3 text-xs bg-surface border border-slate-300 rounded-full text-foreground placeholder:text-slate-500 focus:ring-2 focus:ring-accent/40 focus:border-accent focus:outline-none transition shadow-sm"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Loader2 size={14} className="animate-spin" />
          </span>
        )}
      </form>

      {open && q.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-muted flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Mencari...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-muted">Tidak ada produk yang cocok</div>
          ) : (
            <>
              {/* Produk Ditemukan */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-tertiary font-bold px-2 mb-1.5">
                  Produk Ditemukan
                </p>
                <div className="flex flex-col">
                  {results.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/shop/products/${r.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                    >
                      <span className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-foreground shrink-0 overflow-hidden">
                        {r.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                        ) : (
                          r.name.slice(0, 2).toUpperCase()
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold text-foreground truncate">{r.name}</span>
                        <span className="block text-[11px] text-accent font-bold">{fmt(r.price)}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Kategori Terkait */}
              {relatedCats.length > 0 && (
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider text-tertiary font-bold px-2 mb-1.5">
                    Kategori Terkait
                  </p>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {relatedCats.map((c) => (
                      <Link
                        key={c}
                        href={`/shop/products?category=${CATEGORY_PATH[c] ?? c}`}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-slate-200 dark:border-slate-800 text-muted hover:text-accent transition"
                      >
                        <Store size={12} /> {CATEGORY_LABEL[c] ?? c}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Lihat Semua */}
              <Link
                href={`/shop/products?search=${encodeURIComponent(q)}`}
                onClick={() => setOpen(false)}
                className="block p-3 text-center text-xs font-bold text-accent hover:bg-accent-dim transition"
              >
                Lihat Semua Hasil untuk &quot;{q}&quot; →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
