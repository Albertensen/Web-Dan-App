"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SavedBuild {
  id: string;
  title: string;
  slug: string;
  build_type: string;
  total_price: number | null;
  like_count: number;
  created_at: string;
}

const TYPE_LABEL: Record<string, string> = {
  gaming: "🎮 Gaming", productivity: "💼 Productivity",
  "content-creator": "🎬 Content Creator", "mini-itx": "📦 Mini ITX", budget: "💰 Budget",
};

export default function SavedBuilds() {
  const [builds, setBuilds] = useState<SavedBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/pc-builder/builds")
      .then((r) => r.json())
      .then((j) => {
        if (j.error) {
          setError(j.error);
        } else {
          setBuilds(j.data ?? []);
        }
      })
      .catch(() => setError("Gagal terhubung"))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number | null) =>
    n == null ? "—" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Build Saya</h1>
        <Link href="/builder" className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90">
          + Buat Build Baru
        </Link>
      </div>

      {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-900/30 rounded-lg">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : builds.length === 0 ? (
        <div className="p-8 bg-surface-2/60 border border-dashed border-slate-300 rounded-xl text-center">
          <p className="text-tertiary">Belum ada build tersimpan.</p>
          <p className="text-sm text-slate-500 mt-1">Buat rekomendasi di PC Builder lalu simpan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {builds.map((b) => (
            <Link key={b.id} href={`/builder/${b.slug}`} className="block">
              <div className="p-4 bg-surface border border-slate-300 rounded-xl hover:border-accent transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-foreground">{b.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-dim text-accent border border-accent/30">
                    {TYPE_LABEL[b.build_type] ?? b.build_type}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-tertiary">
                  <span className="font-medium text-accent">{fmt(b.total_price)}</span>
                  <span>❤️ {b.like_count}</span>
                  <span className="text-slate-500">
                    {new Date(b.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
