import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import ProductImage from "@/components/ProductImage";
import AddToCartButton from "@/components/AddToCartButton";
import ProductReviews from "@/components/ProductReviews";
import ProductGallery from "@/components/ProductGallery";
import StickyBuyBar from "@/components/StickyBuyBar";
import ShareButton from "@/components/ShareButton";

export const dynamic = "force-dynamic";

interface ProductProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  const { data: product } = await supabase
    .from("products")
    .select("name, description, image_url, price")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!product) {
    return { title: "Produk Tidak Ditemukan — TeknoHub" };
  }

  const price = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(product.price));

  return {
    title: `${product.name} — TeknoHub`,
    description: product.description?.slice(0, 155) ?? `${product.name} harga ${price} di TeknoHub.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 155) ?? `${product.name} di TeknoHub.`,
      type: "website",
      images: product.image_url ? [{ url: product.image_url, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductProps) {
  const slug = params.slug;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(product.price));

  const { data: related } = await supabase
    .from("products")
    .select("id, name, slug, price, image_url, category, brand, stock")
    .eq("category", product.category)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4);

  // Spek teknis dari kolom jsonb specs (fallback kosong jika tak ada)
  const rawSpecs = (product.specs ?? {}) as Record<string, string | number | boolean | null>;
  const specRows = Object.fromEntries(
    Object.entries(rawSpecs).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const labelSpec = (k: string) =>
    k.replace(/[_-]+/g, " ").replace(/\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-surface text-foreground p-4 sm:p-8 pb-28 md:pb-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center flex-wrap gap-2 text-sm text-tertiary">
        <Link href="/" className="hover:text-accent transition">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop/products" className="hover:text-accent transition">Produk</Link>
        {product.category && (
          <>
            <span aria-hidden="true">/</span>
            <Link
              href={`/shop/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-accent transition capitalize"
            >
              {product.category}
            </Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Gallery */}
        <div className="col-span-1">
          <ProductGallery
            images={[product.image_url, product.image_url, product.image_url, product.image_url]}
            name={product.name}
            category={product.category}
          />
        </div>

{/* Right Column: Details and CTA */}
        <div className="col-span-1 space-y-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">{product.name}</h1>
            <div className="shrink-0 mt-1"><ShareButton /></div>
          </div>

                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-sm sm:text-lg text-accent font-medium">Brand: {product.brand || "Unknown"}</p>
                      <span className="text-3xl sm:text-5xl font-extrabold text-foreground">{formattedPrice}</span>
                    </div>

          <div
            className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-bold border-2 ${
              product.stock > 5
                ? "bg-green-200 text-green-900 border-green-800"
                : "bg-yellow-200 text-yellow-900 border-yellow-800"
            }`}
          >
            Stok: {product.stock}
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-xl font-semibold mb-3 text-muted">Deskripsi Produk</h2>
            <p className="text-tertiary leading-relaxed">{product.description || "Tidak ada deskripsi tersedia."}</p>
          </div>
          <div className="pt-4 border-t border-border">
            <h2 className="text-xl font-semibold mb-3 text-muted">Spesifikasi Teknis</h2>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
              {[
                ["Merek / Brand", product.brand || "—"],
                ["Kategori", product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "—"],
                ["ID Produk", product.id],
                ["Stok Tersedia", String(product.stock)],
                ["Harga", formattedPrice],
                ...Object.entries(specRows).map(([k, v]) => [labelSpec(k), String(v)] as [string, string]),
              ]
                .filter(([, v]) => v && v !== "—")
                .map(([k, v], idx) => (
                  <div
                    key={k}
                    className={`p-3 grid grid-cols-3 gap-2 text-sm ${idx % 2 === 1 ? "bg-slate-50 dark:bg-slate-900/50" : ""}`}
                  >
                    <span className="col-span-1 font-medium text-slate-500 dark:text-slate-400">{k}</span>
                    <span className="col-span-2 font-semibold text-slate-900 dark:text-slate-100 whitespace-pre-wrap">{v}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-6">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                image_url: product.image_url,
                stock: Number(product.stock),
              }}
            />
          </div>

          {/* Ulasan & diskusi produk (tier-based) */}
          <div className="pt-6 border-t border-border">
            <h2 className="text-xl font-semibold mb-4 text-muted">Review &amp; Diskusi Produk</h2>
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div className="max-w-6xl mx-auto mt-14">
          <h2 className="text-xl font-bold text-foreground mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/shop/products/${p.slug}`}
                className="group bg-surface border border-border rounded-2xl p-3 hover:border-accent transition duration-300"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3">
                  <ProductImage
                    src={p.image_url}
                    alt={p.name}
                    category={p.category}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="group-hover:scale-110 transition duration-500 ease-out"
                  />
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-1 mb-1">{p.name}</p>
                <p className="text-sm font-bold text-accent">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(p.price))}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <StickyBuyBar product={{ id: product.id, name: product.name, slug: product.slug, price: Number(product.price), stock: Number(product.stock), image_url: product.image_url }} />
    </div>
  );
}
