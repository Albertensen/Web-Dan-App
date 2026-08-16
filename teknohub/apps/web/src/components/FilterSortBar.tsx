"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  initialSort?: string;
  initialCategory?: string;
  initialSearch?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  children?: React.ReactNode;
}

const SORT_OPTIONS: Record<string, string> = {
  relevance: "Paling Sesuai",
  popular_desc: "Terpopuler",
  price_asc: "Harga: Terendah ke Tertinggi",
  price_desc: "Harga: Tertinggi ke Terendah",
  rating_desc: "Ulasan Tertinggi",
  created_desc: "Produk Terbaru",
};

export default function FilterSortBar({ initialSort = "relevance", children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const changeSort = (v: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (v && v !== "relevance") p.set("sort", v);
    else p.delete("sort");
    router.push(`?${p.toString()}`);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 border border-border bg-surface rounded-xl px-3 py-2.5">
        <label className="text-xs sm:text-sm font-semibold text-muted shrink-0">
          Urutkan:
        </label>
        <select
          value={initialSort}
          onChange={(e) => changeSort(e.target.value)}
          className="flex-1 min-w-0 text-xs sm:text-sm bg-surface-2 border border-slate-300 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          {Object.entries(SORT_OPTIONS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-2 border border-slate-300 text-xs font-bold text-muted hover:text-accent transition"
        >
          <SlidersHorizontal size={14} /> Filter
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl max-h-[80vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Filter Produk</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded-full bg-surface-2 border border-slate-300 text-xs font-bold text-muted"
              >
                Tutup
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
