import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BuilderBanner from "@/components/BuilderBanner";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import BrandPartners from "@/components/home/BrandPartners";
import ThreadCard, { type ThreadProps } from "@/components/forum/ThreadCard";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14">
      {/* 1. Spanduk Utama AI PC Builder (Paling Atas) */}
      <BuilderBanner />

      {/* 2. Flash Sale Section */}
      <FlashSaleSection />

      {/* 3. Rekomendasi Produk Resmi (Fisik & Digital) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Rekomendasi Produk Resmi
            </h2>
            <p className="text-xs text-tertiary mt-0.5">
              Hardware komputer fisik &amp; lisensi digital original bergaransi resmi distributor.
            </p>
          </div>
          <Link href="/shop/products" className="text-xs font-bold text-accent hover:underline">
            Lihat Semua Katalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. Diskusi Komunitas Terbaru (Forum) */}
      {threads.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Diskusi Komunitas Terbaru
              </h2>
              <p className="text-xs text-tertiary mt-0.5">
                Tanya jawab hardware, ulasan pengguna, dan tips perakitan PC dari member.
              </p>
            </div>
            <Link href="/forum" className="text-xs font-bold text-accent hover:underline">
              Buka Forum Komunitas →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threads.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Official Brand Partners (Bagian Bawah, Utuh & Rapi) */}
      <BrandPartners />
    </div>
  );
}
