"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  products?: { name?: string; slug?: string };
  profiles?: { username?: string; full_name?: string };
}

const RATINGS = ["all", "5", "4", "3", "2", "1"];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?rating=${ratingFilter}`);
      const json = await res.json();
      if (res.ok) setReviews(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleDelete(id: string) {
    if (!confirm("Hapus ulasan ini secara permanen?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Moderasi Ulasan Produk</h1>
          <p className="text-xs text-tertiary">Kelola feedback, rating, dan hapus ulasan spam / melanggar aturan</p>
        </div>
        {/* Rating Filter */}
        <div className="flex items-center gap-1">
          {RATINGS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                ratingFilter === r
                  ? "bg-accent text-white"
                  : "bg-surface border border-slate-300 text-muted hover:border-accent"
              }`}
            >
              {r === "all" ? "Semua" : `⭐ ${r}`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-tertiary">Memuat ulasan...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-tertiary text-sm">Belum ada ulasan untuk filter ini.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-2 text-xs text-tertiary uppercase border-b border-slate-300">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3">Pengulas</th>
                  <th className="p-3 text-center">Rating</th>
                  <th className="p-3">Komentar</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 max-w-xs truncate font-medium text-foreground">
                      {r.products?.slug ? (
                        <Link href={`/shop/products/${r.products.slug}`} target="_blank" className="hover:text-accent hover:underline">
                          {r.products.name || r.products.slug}
                        </Link>
                      ) : (
                        "Produk Dihapus"
                      )}
                    </td>
                    <td className="p-3 text-xs text-muted font-medium">
                      @{r.profiles?.username || "anon"}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        ⭐ {r.rating}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-tertiary max-w-md">
                      <p className="line-clamp-2">{r.comment || <span className="italic text-slate-400">Tanpa komentar</span>}</p>
                    </td>
                    <td className="p-3 text-xs text-tertiary whitespace-nowrap">
                      {(r.created_at ?? "").slice(0, 10)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold disabled:opacity-50"
                      >
                        {deletingId === r.id ? "..." : "Hapus"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
