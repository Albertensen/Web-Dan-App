import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BuilderBanner from "@/components/BuilderBanner";
import ThreadCard, { type ThreadProps } from "@/components/forum/ThreadCard";
import { Flame, Laptop, Gamepad2, Cpu, CircuitBoard, MemoryStick, HardDrive, Smartphone, Monitor, ShieldCheck, Zap, Bot, MessageSquare, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

const FEATURED_CATEGORIES = [
  { slug: "all", label: "Semua Kategori", icon: Flame },
  { slug: "laptop", label: "Laptop", icon: Laptop },
  { slug: "gpu", label: "VGA / GPU", icon: Gamepad2 },
  { slug: "cpu", label: "Processor", icon: Cpu },
  { slug: "motherboard", label: "Motherboard", icon: CircuitBoard },
  { slug: "ram", label: "RAM Memory", icon: MemoryStick },
  { slug: "storage", label: "SSD & Storage", icon: HardDrive },
  { slug: "smartphone", label: "Smartphone", icon: Smartphone },
  { slug: "monitor", label: "Monitor", icon: Monitor },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "100% Produk Asli", desc: "Garansi resmi distributor" },
  { icon: Zap, title: "Pengiriman Cepat", desc: "Asuransi & packing aman" },
  { icon: Bot, title: "Konsultasi AI 24/7", desc: "Racik PC bebas bottleneck" },
  { icon: MessageSquare, title: "Komunitas Terpercaya", desc: "Diskusi & reputasi member" },
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12">
      {/* ================= HERO BUILDER BANNER ================= */}
      <BuilderBanner />

      {/* ================= TRUST BADGES (MARKETPLACE STANDARD) ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {TRUST_BADGES.map((b) => (
          <div key={b.title} className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <span className="text-accent shrink-0 flex"><b.icon size={24} /></span>
            <div className="min-w-0">
              <p className="font-extrabold text-xs sm:text-sm text-foreground truncate">{b.title}</p>
              <p className="text-[11px] text-tertiary truncate">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MARKETPLACE CATALOG SECTION ================= */}
      <section id="marketplace" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag size={22} className="text-accent" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Katalog Produk Resmi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Komponen PC, laptop gaming, smartphone, dan periferal bergaransi resmi
            </p>
          </div>
          <Link
            href="/shop/products"
            className="self-start sm:self-auto px-5 py-2 rounded-full border border-border bg-surface-2 hover:border-accent text-xs font-bold transition"
          >
            Lihat Semua Produk →
          </Link>
        </div>

        {/* Kategori Carousel Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FEATURED_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={c.slug === "all" ? "/shop/products" : `/shop/products?category=${c.slug}`}
              className="shrink-0 bg-surface border border-border hover:border-accent hover:shadow px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition"
            >
              <span className="flex"><c.icon size={18} /></span>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="p-12 text-center bg-surface-2/60 border border-dashed border-border rounded-3xl">
            <p className="text-tertiary text-sm">Produk sedang disiapkan. Silakan kunjungi kembali nanti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ================= FORUM COMMUNITY SECTION ================= */}
      <section id="forum-slide" className="bg-surface rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-accent" />
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                Diskusi Komunitas Terbaru
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-tertiary mt-1">
              Tanyakan rekomendasi rakit PC, benchmark, dan diskusikan teknologi terkini
            </p>
          </div>
          <Link
            href="/forum/new"
            className="self-start sm:self-auto bg-accent text-white hover:bg-accent-secondary px-5 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-accent/20"
          >
            + Buat Thread Baru
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threads.slice(0, 4).map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>

        <div className="text-center pt-2">
          <Link href="/forum" className="text-xs font-bold text-accent hover:underline">
            Kunjungi Semua Diskusi di Forum Komunitas →
          </Link>
        </div>
      </section>

      {/* ================= TENTANG TEKNOZONE ================= */}
      <section id="tentang" className="bg-gradient-to-br from-accent via-accent-secondary to-accent text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-zone-blue/30 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-4">
            <Zap size={14} className="inline-block mr-1 -mt-0.5" /> Platform Teknologi Terintegrasi
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
            Belanja Komponen, Konsultasi AI, dan Berbagi Pengalaman di Satu Tempat.
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            TeknoHub menghadirkan ekosistem terlengkap untuk antusias PC, gamer, dan kreator konten di Indonesia. Ditenagai algoritma kecerdasan buatan untuk meracik komponen tanpa khawatir bottleneck.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/builder" className="px-6 py-3 rounded-full bg-white text-accent font-extrabold text-xs hover:bg-slate-100 transition shadow-lg">
              Coba AI PC Builder →
            </Link>
            <Link href="/shop/products" className="px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 font-bold text-xs hover:bg-white/20 transition">
              Katalog Toko
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
