import FilterSortBar from "@/components/FilterSortBar";
import ProductFilter from "@/components/ProductFilter";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
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
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category || "";
  const search = searchParams.search || "";
  const minPrice = searchParams.min_price || "";
  const maxPrice = searchParams.max_price || "";
  const brands = searchParams.brands || "";
  const inStock = searchParams.in_stock || "";
  const sort = searchParams.sort || "relevance";

  const params = new URLSearchParams({
    category, search, min_price: minPrice, max_price: maxPrice, brands, in_stock: inStock, sort,
  });
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

      <div className="flex gap-6 items-start">
        {/* Sidebar Filter (desktop) */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-20">
          <ProductFilter initialCategory={category} initialSearch={search} initialMinPrice={minPrice} initialMaxPrice={maxPrice} initialBrands={brands} initialInStock={inStock} />
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
            <ProductFilter initialCategory={category} initialSearch={search} initialMinPrice={minPrice} initialMaxPrice={maxPrice} initialBrands={brands} initialInStock={inStock} />
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
