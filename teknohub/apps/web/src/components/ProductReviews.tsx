import { supabase } from "@/lib/supabase/client";

// Paksa runtime query (jangan di-cache build)
export const dynamic = "force-dynamic";

type Profile = { username: string | null; reputation: number | null } | null | undefined;

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: Profile;
}

/** Supabase join bisa balikin objek tunggal ATAU array — normalisasi */
function normProfile(p: Profile | { username: string | null; reputation: number | null }[]): Profile {
  if (!p) return null;
  return Array.isArray(p) ? (p[0] ?? null) : p;
}

/** Tier dari reputasi: <10 Silver, 10-50 Gold, >50 Diamond */
function tierOf(reputation: number | null | undefined): { name: string; icon: string; cls: string; bar: string } {
  const r = reputation ?? 0;
  if (r > 50) return { name: "Diamond", icon: "💎", cls: "bg-accent text-white", bar: "bg-accent" };
  if (r >= 10) return { name: "Gold", icon: "🥇", cls: "bg-amber-700 text-white", bar: "bg-amber-700" };
  return { name: "Silver", icon: "🥈", cls: "bg-slate-500 text-white", bar: "bg-slate-400" };
}

export default async function ProductReviews({ productId }: { productId: string }) {
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("id, rating, comment, created_at, profiles(id, username, reputation)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  const raw = (reviews ?? []) as {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: Profile | { username: string | null; reputation: number | null }[] | undefined;
  }[];
  const list: Review[] = raw.map((r) => ({
    ...r,
    profiles: normProfile(r.profiles),
  }));

  if (list.length === 0) {
    return (
      <div className="p-6 bg-surface-2/60 border border-dashed border-border rounded-xl text-center">
        <p className="text-sm text-muted">Belum ada ulasan untuk produk ini.</p>
        <p className="text-xs text-tertiary mt-1">Jadilah yang pertama memberi ulasan!</p>
      </div>
    );
  }

  // Ringkasan per tier (bukan per bintang)
  const tiers = [
    { key: "Diamond", name: "Diamond", icon: "💎", count: list.filter((r) => tierOf(r.profiles?.reputation).name === "Diamond").length },
    { key: "Gold", name: "Gold", icon: "🥇", count: list.filter((r) => tierOf(r.profiles?.reputation).name === "Gold").length },
    { key: "Silver", name: "Silver", icon: "🥈", count: list.filter((r) => tierOf(r.profiles?.reputation).name === "Silver").length },
  ];
  const total = list.length;

  // Rata-rata bobot per tier: Silver 1x, Gold 2x, Diamond 3x (semakin tinggi tier semakin dipercaya)
  const weight = { Silver: 1, Gold: 2, Diamond: 3 };
  const weighted = list.reduce((sum, r) => sum + r.rating * (weight[tierOf(r.profiles?.reputation).name as keyof typeof weight] ?? 1), 0);
  const weightedDiv = list.reduce((sum, r) => sum + (weight[tierOf(r.profiles?.reputation).name as keyof typeof weight] ?? 1), 0);
  const avg = weightedDiv > 0 ? (weighted / weightedDiv).toFixed(1) : "0.0";

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

  return (
    <div className="space-y-6">
      {/* Ringkasan: indicator tier (bukan bintang) */}
      <div className="bg-surface-2/60 border border-border rounded-2xl p-5">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-extrabold text-foreground">{avg}</span>
          <div className="flex items-center gap-1.5">
            {tiers.map((t) => (
              <span key={t.key} title={t.name} className={`w-7 h-7 rounded-full ${tierOf(t.key === "Diamond" ? 80 : t.key === "Gold" ? 25 : 5).cls} flex items-center justify-center text-sm`}>
                {t.icon}
              </span>
            ))}
          </div>
          <span className="text-sm text-muted">{total} ulasan</span>
        </div>

        {/* Progress bar per tier */}
        <div className="space-y-2.5">
          {tiers.map((t) => (
            <div key={t.key} className="flex items-center gap-3 text-xs">
              <span className="w-20 shrink-0 text-muted font-medium">{t.icon} {t.name}</span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${tierOf(t.key === "Diamond" ? 80 : t.key === "Gold" ? 25 : 5).bar} rounded-full transition-all`}
                  style={{ width: `${total > 0 ? (t.count / total) * 100 : 0}%` }}
                />
              </div>
              <span className="w-8 text-right font-semibold text-foreground">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daftar review */}
      <div className="space-y-4">
        {list.map((r) => {
          const tier = tierOf(r.profiles?.reputation);
          return (
            <div key={r.id} className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm text-accent font-bold">
                  {r.profiles?.username?.[0]?.toUpperCase() || "?"}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.profiles?.username || "Anonim"}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.cls}`}>
                      {tier.icon} {tier.name} Member
                    </span>
                  </div>
                  <span className="text-[11px] text-tertiary">{fmtDate(r.created_at)}</span>
                </div>
                {/* Indicator rating tier: kotak tier, bukan bintang */}
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white ${tier.bar}`}
                  title={`${tier.name} ${r.rating}/5`}
                >
                  {r.rating}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{r.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
