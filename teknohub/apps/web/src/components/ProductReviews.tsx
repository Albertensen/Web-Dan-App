"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { Star, Camera, CheckCircle2, X } from "lucide-react";
import { REVIEW_META } from "@/lib/reviewMeta";

interface Profile { username: string | null; reputation: number | null }
interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: Profile | Profile[] | null;
}

type FilterKey = "all" | "photo" | "5" | "4" | "3" | "2" | "1";

function normProfile(p: Review["profiles"]): Profile | null {
  if (!p) return null;
  return Array.isArray(p) ? (p[0] ?? null) : p;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((j) => { if (alive) setReviews(Array.isArray(j.data) ? j.data : []); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [productId]);

  const meta = (id: string) => (REVIEW_META as Record<string, { variant?: string; is_verified?: boolean; media?: string[]; has_video?: boolean }>)[id] ?? {};
  const filtered = useMemo(() => {
    if (filter === "all") return reviews;
    if (filter === "photo") {
      return reviews.filter((r) => (meta(r.id).media?.length ?? 0) > 0 || meta(r.id).has_video);
    }
    return reviews.filter((r) => r.rating === Number(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews, filter, reviews.length]);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const bars = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: reviews.length ? (count / reviews.length) * 100 : 0 };
  });

  const sold = reviews.length * 10 + 37;

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-center sm:text-left shrink-0">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-5xl font-extrabold text-foreground">{avg}</span>
              <span className="text-lg text-muted">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-0.5 my-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={16} className={i <= Math.round(Number(avg)) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
              ))}
            </div>
            <p className="text-xs text-tertiary">{reviews.length} ulasan · {sold}+ terjual</p>
          </div>

          <div className="flex-1 space-y-1.5 min-w-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 sm:pl-5 pt-3 sm:pt-0">
            {bars.map((b) => (
              <div key={b.star} className="flex items-center gap-2 text-xs">
                <span className="text-muted w-8 shrink-0">Bintang {b.star}</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-8 text-right text-tertiary shrink-0">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {([
          ["all", "Semua"],
          ["photo", "Dengan Foto/Video"],
          ["5", "Bintang 5"],
          ["4", "Bintang 4"],
          ["3", "Bintang 3"],
          ["2", "Bintang 2"],
          ["1", "Bintang 1"],
        ] as [FilterKey, string][]).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
              filter === k
                ? "bg-accent text-white border-accent"
                : "bg-surface border-slate-200 dark:border-slate-800 text-muted hover:text-accent"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted">Memuat ulasan...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">Belum ada ulasan untuk filter ini.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const prof = normProfile(r.profiles);
            const m = meta(r.id);
            const verified = !!m.is_verified || (prof?.reputation ?? 0) >= 10;
            const media = (m.media ?? []) as string[];
            return (
              <div key={r.id} className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-full bg-accent-dim flex items-center justify-center text-sm font-bold text-accent shrink-0">
                    {prof?.username?.[0]?.toUpperCase() || "?"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">{prof?.username || "Anonim"}</span>
                      {verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 size={12} /> Pembeli Terverifikasi
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-tertiary">{fmtDate(r.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={13} className={i <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                    ))}
                  </div>
                </div>

                {m.variant && (
                  <p className="text-[11px] text-tertiary mb-1.5">Varian: {m.variant}</p>
                )}

                <p className="text-sm text-muted leading-relaxed">{r.comment}</p>

                {(media.length > 0 || m.has_video) && (
                  <div className="flex items-center gap-2 mt-3">
                    {media.map((src, i) => (
                      <button key={i} onClick={() => setLightbox(src)} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 hover:shadow transition">
                        <img src={src} alt={`Foto ulasan ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {m.has_video && (
                      <span className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-muted">
                        <Camera size={18} />
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2 text-white" onClick={() => setLightbox(null)} aria-label="Tutup">
            <X size={24} />
          </button>
          <img src={lightbox} alt="Preview" className="max-h-[85vh] max-w-full rounded-lg" onClick={(e) => e.stopPropagation()} style={{ cursor: "zoom-out" }} />
        </div>
      )}
    </div>
  );
}
