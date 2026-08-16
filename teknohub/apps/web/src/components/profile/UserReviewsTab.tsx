"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface MyReview {
  id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  products?: {
    name?: string;
    slug?: string;
    image_url?: string | null;
    price?: number;
  };
}

export default function UserReviewsTab() {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<MyReview | null>(null);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchMyReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/reviews");
      const json = await res.json();
      if (res.ok) setReviews(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyReviews();
  }, [fetchMyReviews]);

  function openEdit(r: MyReview) {
    setEditingReview(r);
    setNewRating(r.rating);
    setNewComment(r.comment ?? "");
    setMsg("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingReview) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/user/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: editingReview.id,
          rating: newRating,
          comment: newComment,
        }),
      });
      if (res.ok) {
        setReviews(
          reviews.map((r) =>
            r.id === editingReview.id
              ? { ...r, rating: newRating, comment: newComment }
              : r
          )
        );
        setEditingReview(null);
      } else {
        const j = await res.json();
        setMsg(j.error || "Gagal menyimpan ulasan");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm text-tertiary">Memuat riwayat ulasan Anda...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-2/40 border border-dashed border-border rounded-2xl">
        <p className="text-sm text-muted">Anda belum pernah memberikan ulasan produk.</p>
        <Link href="/shop/products" className="inline-block mt-3 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold">
          Belanja &amp; Beri Ulasan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {r.products?.image_url ? (
              <Image
                src={r.products.image_url}
                alt={r.products.name || "Produk"}
                width={48}
                height={48}
                sizes="48px"
                className="w-12 h-12 object-cover rounded-xl shrink-0"
              />
            ) : (
              <span className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-xl shrink-0">
                📦
              </span>
            )}
            <div className="min-w-0">
              {r.products?.slug ? (
                <Link href={`/shop/products/${r.products.slug}`} className="font-bold text-foreground hover:text-accent truncate block text-sm">
                  {r.products.name || r.products.slug}
                </Link>
              ) : (
                <span className="font-bold text-foreground text-sm">Produk</span>
              )}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-amber-500 text-xs">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </span>
                <span className="text-xs font-bold text-foreground">({r.rating}/5)</span>
                <span className="text-[11px] text-tertiary">· {(r.created_at ?? "").slice(0, 10)}</span>
              </div>
              {r.comment && (
                <p className="text-xs text-muted mt-1 italic">&ldquo;{r.comment}&rdquo;</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => openEdit(r)}
            className="shrink-0 px-4 py-1.5 rounded-xl border border-slate-300 bg-surface-2 hover:border-accent text-xs font-semibold transition"
          >
            ✏️ Ubah Ulasan
          </button>
        </div>
      ))}

      {/* Modal Edit Ulasan */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-300">
              <h2 className="font-bold text-foreground text-base">Ubah Ulasan Produk</h2>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-tertiary mb-3">
              Produk: <b className="text-foreground">{editingReview.products?.name || "Produk"}</b>
            </p>

            {msg && <p className="mb-3 text-xs text-red-600">{msg}</p>}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Rating Bintang (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`text-2xl transition ${
                        star <= newRating ? "text-amber-500 scale-110" : "text-slate-300 hover:text-amber-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-foreground">{newRating} Bintang</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Komentar / Pengalaman Anda</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ceritakan kepuasan dan ulasan Anda mengenai produk ini..."
                  className="w-full p-2.5 text-xs bg-surface border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 text-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-accent text-white hover:bg-accent-secondary disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
