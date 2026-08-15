import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BuilderBanner from "@/components/BuilderBanner";
import ThreadCard, { type ThreadProps } from "@/components/forum/ThreadCard";

// Halaman dinamis — fetch produk real per request (bukan static build)
export const dynamic = "force-dynamic";

const FEATURED_CATEGORIES = ["Semua", "Laptop", "GPU", "Processor", "Smartphone", "Monitor", "Storage", "Peripherals"];

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
  } catch {
    console.error("Error fetching products");
  }

  // Fetch thread komunitas real
  let threads: ThreadProps[] = [];
  try {
    const forumUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forum/threads?sort=latest`;
    const res = await fetch(forumUrl, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      threads = json.data ?? [];
    }
  } catch {
    console.error("Error fetching threads");
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* ================= BANNER AI 3D PC BUILDER ================= */}
      <BuilderBanner />

      {/* ================= MARKETPLACE (Direct View) ================= */}
      <section id="marketplace">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Katalog Produk Unggulan</h1>
                    <p className="text-xs text-muted">Perangkat elektronik &amp; hardware dengan standar performa tertinggi.</p>
                  </div>
          {/* Filter kategori pills */}
          <div className="flex gap-2 text-xs overflow-x-auto no-scrollbar pb-1">
            {FEATURED_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={c === "Semua" ? "/shop/products" : `/shop/products?category=${encodeURIComponent(c.toLowerCase())}`}
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

      {/* ================= STATS / SOCIAL PROOF ================= */}
      <section className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-slate-300 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-3xl font-extrabold tracking-tight text-accent mb-1">
              {products.length}+
            </div>
            <p className="text-xs font-semibold text-muted">Produk Terkurasi</p>
          </div>
          <div className="bg-surface border border-slate-300 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-3xl font-extrabold tracking-tight text-accent mb-1">5.000+</div>
            <p className="text-xs font-semibold text-muted">Member Terdaftar</p>
          </div>
          <div className="bg-surface border border-slate-300 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-3xl font-extrabold tracking-tight text-accent mb-1">24/7</div>
            <p className="text-xs font-semibold text-muted">AI Support</p>
          </div>
        </div>
      </section>

      {/* ================= FORUM KOMUNITAS (Slide) ================= */}
      <section id="forum-slide" className="pt-8 border-t-2 border-slate-400">
        <div className="mb-6">
          <span className="text-[11px] uppercase font-semibold text-accent tracking-widest block mb-1">
            Community Hub
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Forum Komunitas</h2>
          <p className="text-xs text-muted">
            Diskusi hardware, AI, gaming, dan DIY dari komunitas TeknoZone.
          </p>
        </div>

        {/* Thread komunitas terbaru */}
        <div className="space-y-4">
          {threads.length > 0 ? (
            threads.slice(0, 4).map((t) => <ThreadCard key={t.id} thread={t} />)
          ) : (
            <div className="p-8 bg-surface border border-dashed border-slate-300 rounded-2xl text-center">
              <p className="text-sm text-muted">Belum ada diskusi. Mulai thread pertama!</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/forum"
            className="bg-accent text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-accent-secondary transition"
          >
            Buka Forum Komunitas &rarr;
          </Link>
        </div>
      </section>

      {/* ================= TENTANG TEKNOZONE ================= */}
      <section id="tentang" className="pt-8 border-t-2 border-slate-400">
        <div className="bg-surface border border-slate-300 rounded-3xl p-8 shadow-sm">
          <span className="text-[11px] uppercase font-semibold text-accent tracking-widest block mb-2">
            About Us
          </span>
          <h2 className="text-2xl font-bold tracking-tight mb-3">Tentang TeknoZone</h2>
          <p className="text-xs text-muted leading-relaxed max-w-3xl mb-6">
            TeknoZone adalah pusat hardware &amp; komunitas terpercaya — satu ekosistem untuk
            belanja elektronik, konsultasi rakit PC dengan AI agent, dan forum teknologi dengan
            sistem reputasi transparan berbasis tier transaksi.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-2/60 rounded-2xl p-4">
              <div className="font-bold text-sm text-foreground mb-1">🛒 Marketplace</div>
              <p className="text-[11px] text-muted leading-relaxed">
                Katalog produk elektronik &amp; hardware tervalidasi dengan harga kompetitif.
              </p>
            </div>
            <div className="bg-surface-2/60 rounded-2xl p-4">
              <div className="font-bold text-sm text-foreground mb-1">🤖 Build PC with Agent AI</div>
              <p className="text-[11px] text-muted leading-relaxed">
                Simulasi perakitan 3D interaktif dengan cek kompatibilitas daya &amp; anti-bottleneck.
              </p>
            </div>
            <div className="bg-surface-2/60 rounded-2xl p-4">
              <div className="font-bold text-sm text-foreground mb-1">💬 Komunitas</div>
              <p className="text-[11px] text-muted leading-relaxed">
                Forum dengan tier reputasi (Silver, Gold, Diamond) anti-fake review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
            <footer className="border-t-2 border-slate-400/60 mt-16 pt-10 pb-8 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3">Tekno Zone</h3>
                  <p className="text-xs text-muted leading-relaxed max-w-xs">
                    Belanja elektronik, diskusi tech &amp; AI, dan rakit PC dengan AI Agent — satu ekosistem.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3">Menu</h3>
                  <ul className="space-y-2 text-xs text-muted">
                    <li><Link href="/shop/products" className="hover:text-accent transition">Produk</Link></li>
                    <li><Link href="/forum" className="hover:text-accent transition">Forum</Link></li>
                    <li><Link href="/builder" className="hover:text-accent transition">PC Builder AI</Link></li>
                    <li><Link href="/shop/cart" className="hover:text-accent transition">Keranjang</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3">Akun</h3>
                  <ul className="space-y-2 text-xs text-muted">
                    <li><Link href="/user/profile" className="hover:text-accent transition">Profil</Link></li>
                    <li><Link href="/shop/orders" className="hover:text-accent transition">Pesanan</Link></li>
                    <li><Link href="/login" className="hover:text-accent transition">Masuk</Link></li>
                  </ul>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-400/50 text-center text-muted text-[11px] font-medium tracking-wide">
                <p>© 2026 TeknoZone. Platform Hardware &amp; Komunitas Terpercaya Indonesia.</p>
              </div>
            </footer>
    </main>
  );
}
