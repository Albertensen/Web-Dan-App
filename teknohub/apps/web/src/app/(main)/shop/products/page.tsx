import FilterSortBar from "@/components/FilterSortBar";
import ProductFilter from "@/components/ProductFilter";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    min_price?: string;
    max_price?: string;
    brands?: string;
    in_stock?: string;
    sort?: string;
    type?: string;
  };
}

const TYPE_TABS: { value: string; label: string }[] = [
  { value: "all", label: "🔥 Semua Produk" },
  { value: "physical", label: "🖥️ Hardware Fisik" },
  { value: "digital", label: "⚡ Produk Digital" },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category || "";
  const search = searchParams.search || "";
  const minPrice = searchParams.min_price || "";
  const maxPrice = searchParams.max_price || "";
  const brands = searchParams.brands || "";
  const inStock = searchParams.in_stock || "";
  const sort = searchParams.sort || "relevance";
  const type = searchParams.type || "all";

  const params = new URLSearchParams({
    category, search, min_price: minPrice, max_price: maxPrice, brands, in_stock: inStock, sort,
  });
  if (type !== "all") params.set("type", type);
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products?${params.toString()}`;

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
      <header className="mb-6 border-b border-border pb-5">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Katalog <span className="text-accent">Produk</span>
        </h1>
        <p className="text-sm text-muted mt-1">{products.length} produk ditemukan</p>
      </header>

      {/* Tab Filter Cepat: Semua / Hardware Fisik / Produk Digital */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPE_TABS.map((t) => {
          const p = new URLSearchParams(searchParams);
          if (t.value === "all") p.delete("type");
          else p.set("type", t.value);
          const active = type === t.value;
          return (
            <Link
              key={t.value}
              href={`?${p.toString()}`}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition ${
                active
                  ? t.value === "digital"
                    ? "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/25"
                    : t.value === "physical"
                      ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/25"
                      : "bg-accent text-white border-accent shadow-md shadow-accent/25"
                  : "border-slate-300 dark:border-slate-700 text-muted hover:border-accent hover:text-accent bg-surface"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar Filter (desktop) */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-20">
          <ProductFilter initialCategory={category} initialSearch={search} initialMinPrice={minPrice} initialMaxPrice={maxPrice} initialBrands={brands} initialInStock={inStock} initialType={type} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Sorting bar + mobile filter toggle */}
          <FilterSortBar
            initialCategory={category}
            initialSearch={search}
            initialMinPrice={minPrice}
            initialMaxPrice={maxPrice}
            initialSort={sort}
          >
            <ProductFilter initialCategory={category} initialSearch={search} initialMinPrice={minPrice} initialMaxPrice={maxPrice} initialBrands={brands} initialInStock={inStock} initialType={type} />
          </FilterSortBar>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="p-8 mt-6 bg-surface border border-dashed border-border rounded-2xl text-center">
              <p className="text-lg font-medium text-muted">Produk tidak ditemukan</p>
              <p className="text-sm text-tertiary mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
