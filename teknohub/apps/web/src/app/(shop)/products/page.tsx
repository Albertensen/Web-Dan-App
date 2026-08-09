import { Suspense } from "react";
import ProductFilter from "@/components/ProductFilter";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category || undefined;
  const search = searchParams.search || undefined;

  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products?category=${encodeURIComponent(category ?? "")}&search=${encodeURIComponent(search ?? "")}`;

  let products: Product[] = [];
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      products = json.data ?? [];
    }
  } catch (e) {
    console.error("Error fetching products:", e);
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <header className="mb-8 border-b border-border pb-5">
        <h1 className="font-display font-extralight text-3xl sm:text-4xl">
          Katalog <span className="gradient-text">Produk</span>
        </h1>
      </header>

      {/* Sticky search/filter */}
      <div className="sticky top-16 z-30 glass-surface rounded-xl px-4 py-3 mb-8">
        <Suspense fallback={<div className="text-muted text-sm">Memuat filter...</div>}>
          <ProductFilter initialCategory={category} initialSearch={search} />
        </Suspense>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="p-8 bg-surface border border-dashed border-border rounded-xl text-center">
          <p className="text-lg font-medium text-muted">Produk tidak ditemukan</p>
          <p className="text-sm text-tertiary mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}
