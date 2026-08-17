import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BuilderBanner from "@/components/BuilderBanner";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import BrandPartners from "@/components/home/BrandPartners";
import ThreadCard, { type ThreadProps } from "@/components/forum/ThreadCard";
import type { Product } from "@/types/product";
import { Flame, Laptop, Gamepad2, Cpu, CircuitBoard, MemoryStick, HardDrive, Smartphone, Monitor, Code } from "lucide-react";

export const dynamic = "force-dynamic";

const FEATURED_CATEGORIES = [
  { slug: "all", label: "Semua Kategori", icon: Flame },
  { slug: "laptop", label: "Laptop", icon: Laptop },
  { slug: "gpu", label: "VGA / GPU", icon: Gamepad2 },
  { slug: "cpu", label: "Processor", icon: Cpu },
  { slug: "software", label: "Software & OS", icon: Code },
  { slug: "motherboard", label: "Motherboard", icon: CircuitBoard },
  { slug: "ram", label: "RAM Memory", icon: MemoryStick },
  { slug: "storage", label: "SSD & Storage", icon: HardDrive },
  { slug: "smartphone", label: "Smartphone", icon: Smartphone },
  { slug: "monitor", label: "Monitor", icon: Monitor },
];

export default async function Home() {
  let products: Product[] = [];
  let threads: ThreadProps[] = [];

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      products = json.data ?? [];
    }
  } catch (e) {
    console.error("Error fetching products", e);
  }

  try {
    const forumUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/forum/threads?limit=4`;
    const res = await fetch(forumUrl, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      threads = json.data ?? [];
    }
  } catch (e) {
    console.error("Error fetching threads", e);
  }

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-2 via-surface to-background border-b border-border py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-dim text-accent border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            Platform Hardware &amp; AI Builder #1 Indonesia
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Pusat Komponen Komputer &amp; <br />
            <span className="gradient-text">Rakit PC Cerdas Bertenaga AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-tertiary">
            Beli hardware original dan lisensi software resmi, konsultasikan kompatibilitas komponen bersama AI Agent, dan bergabung dalam forum komunitas tech.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/builder" className="px-6 py-3.5 rounded-full bg-accent hover:bg-accent-secondary text-white font-bold text-sm transition shadow-lg shadow-accent/20">
              🤖 Mulai Rakit PC AI
            </Link>
            <Link href="/shop/products" className="px-6 py-3.5 rounded-full bg-surface border border-slate-300 dark:border-slate-700 hover:border-accent text-foreground font-bold text-sm transition">
              🛍️ Jelajahi Katalog
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* 2. Flash Sale Section */}
        <FlashSaleSection />

        {/* 3. Kategori Unggulan */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Kategori Pilihan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/shop/products" : `/shop/products?category=${cat.slug}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-slate-200 dark:border-slate-800 hover:border-accent hover:shadow-md transition group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-xl bg-accent-dim text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <cat.icon size={18} />
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-accent transition">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Katalog Produk */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">Rekomendasi Produk Resmi</h2>
              <p className="text-xs text-tertiary mt-0.5">Hardware fisik &amp; lisensi digital original bergaransi resmi.</p>
            </div>
            <Link href="/shop/products" className="text-xs font-bold text-accent hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* 5. Banner AI PC Builder */}
        <BuilderBanner />

        {/* 6. Forum Komunitas Terhangat */}
        {threads.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground">Diskusi Komunitas Terbaru</h2>
                <p className="text-xs text-tertiary mt-0.5">Tanya jawab hardware, ulasan, dan tips rakit PC dari member.</p>
              </div>
              <Link href="/forum" className="text-xs font-bold text-accent hover:underline">
                Buka Forum →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {threads.map((t) => (
                <ThreadCard key={t.id} thread={t} />
              ))}
            </div>
          </section>
        )}

        {/* 7. Official Brand Partners (Di bagian bawah, utuh & tidak terpotong) */}
        <BrandPartners />
      </div>
    </div>
  );
}
