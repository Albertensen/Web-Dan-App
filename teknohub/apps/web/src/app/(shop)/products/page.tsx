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
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 sm:p-8">
      <header className="mb-10 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Katalog Produk</h1>
      </header>

      <Suspense fallback={<div>Loading filters...</div>}>
        <ProductFilter initialCategory={category} initialSearch={search} />
      </Suspense>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="p-8 bg-slate-800/50 border border-dashed border-slate-600 rounded-xl text-center mt-8">
          <p className="text-lg font-medium text-slate-400">Produk tidak ditemukan</p>
          <p className="text-sm text-slate-500 mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}
