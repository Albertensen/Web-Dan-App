import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BuilderBanner from "@/components/BuilderBanner";

// Halaman dinamis — fetch produk real per request (bukan static build)
export const dynamic = "force-dynamic";

const FEATURED_CATEGORIES = ["Semua", "GPU", "Processor", "Laptop"];

const TIERS = [
  {
    icon: "⭐",
    name: "Silver Tier",
    range: "1-9 Transaksi",
    desc: "Ulasan buruk diredam bobotnya untuk cegah persaingan kotor, namun bukti valid tetap tampil transparan.",
    cls: "border-slate-300",
    titleCls: "text-slate-700",
  },
  {
    icon: "⭐⭐",
    name: "Gold Tier",
    range: "10-50 Transaksi",
    desc: "Pelanggan setia platform. Memberikan bobot ulasan standar yang adil dan obyektif.",
    cls: "border-2 border-amber-600",
    titleCls: "text-amber-800",
  },
  {
    icon: "⭐⭐⭐",
    name: "Diamond Tier",
    range: ">50 Transaksi",
    desc: "Power user forum. Memiliki tingkat kepercayaan tertinggi dalam menilai kualitas lapak.",
    cls: "border-2 border-accent",
    titleCls: "text-accent",
  },
];

const REVIEWS = [
  {
    badge: "💎 Diamond Member",
    badgeCls: "bg-accent",
    meta: "• 64 Transaksi Sukses",
    title: "Review Jasa Rakit PC: Rapi dan Kabel Manajemen Sempurna!",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    badge: "⭐ Silver Member",
    badgeCls: "bg-slate-600",
    meta: "• 2 Transaksi Sukses",
    evidence: "Verified Evidence",
    title: "Kendala Pengiriman Kurir (Ada Bukti Foto Dus Penyok)",
    stars: "⭐⭐⭐",
  },
];

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  brand: string | null;
}

export default async function Home() {
  // Fetch produk real dari API (tanpa mock data)
  let products: Product[] = [];
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      products = json.data ?? [];
    }
  } catch (e) {
    console.error("Error fetching products:", e);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* ================= BANNER AI 3D PC BUILDER ================= */}
      <BuilderBanner />

      {/* ================= MARKETPLACE (Direct View) ================= */}
      <section id="marketplace">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Katalog Produk Unggulan</h1>
            <p className="text-xs text-muted">Perangkat elektronik &amp; hardware dengan standar performa tertinggi.</p>
          </div>
          {/* Filter kategori pills */}
          <div className="flex gap-2 text-xs overflow-x-auto no-scrollbar pb-1">
            {FEATURED_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={c === "Semua" ? "/products" : `/products?category=${encodeURIComponent(c.toLowerCase())}`}
                className="bg-surface px-3 py-1.5 rounded-full border border-slate-300 font-medium cursor-pointer hover:border-accent whitespace-nowrap"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Grid produk kompak */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-surface border border-dashed border-slate-300 rounded-2xl text-center">
            <p className="text-sm text-muted">Produk belum tersedia. Cek kembali nanti.</p>
          </div>
        )}
      </section>

      {/* ================= FORUM & REPUTASI (Slide) ================= */}
      <section id="forum-slide" className="pt-8 border-t-2 border-slate-400">
        <div className="mb-6">
          <span className="text-[11px] uppercase font-semibold text-accent tracking-widest block mb-1">
            Community Hub
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Forum Komunitas &amp; Sistem Reputasi</h2>
          <p className="text-xs text-muted">
            Ulasan transparan dengan proteksi tier transaksi (Silver, Gold, Diamond) untuk menghindari fake review.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {TIERS.map((t) => (
            <div key={t.name} className={`bg-surface border ${t.cls} p-4 rounded-2xl shadow-sm`}>
              <div className={`font-bold text-xs ${t.titleCls} mb-1`}>
                {t.icon} {t.name} ({t.range})
              </div>
              <p className="text-[11px] text-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="bg-surface border border-slate-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-base font-bold tracking-tight">Diskusi &amp; Ulasan Terbaru</h3>
            <Link
              href="/forum"
              className="bg-accent text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-accent-secondary transition"
            >
              Buka Forum
            </Link>
          </div>

          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div
                key={r.title}
                className="p-4 bg-slate-200/70 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`${r.badgeCls} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}>
                      {r.badge}
                    </span>
                    <span className="text-[11px] text-muted">{r.meta}</span>
                    {r.evidence && (
                      <span className="bg-red-200 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {r.evidence}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-foreground text-xs">{r.title}</h4>
                </div>
                <div className="text-amber-600 font-bold text-xs">{r.stars}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-400/50 py-12 px-6 mt-16 text-center text-muted text-[11px] font-medium tracking-wide">
        <p>© 2026 Tekno Zone. Marketplace, Auth Header, Cart &amp; eBay Banner Integration.</p>
      </footer>
    </main>
  );
}
