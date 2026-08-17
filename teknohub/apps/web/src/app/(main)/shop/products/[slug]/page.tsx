import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import ProductImage from "@/components/ProductImage";
import ProductPurchaseOptions from "@/components/ProductPurchaseOptions";
import ProductReviews from "@/components/ProductReviews";
import RelatedForumThreads from "@/components/forum/RelatedForumThreads";
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

  const { data: related } = await supabase
    .from("products")
    .select("id, name, slug, price, image_url, category, brand, stock")
    .eq("category", product.category)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teknohub-web.vercel.app";
  const availability = product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url || undefined,
    description: product.description || undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: Number(product.price),
      availability,
      itemCondition: "https://schema.org/NewCondition",
      url: `${baseUrl}/shop/products/${product.slug}`,
    },
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        <span className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold ${product.stock <= 0 ? "bg-red-100 text-red-600" : product.stock <= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
          {product.stock <= 0 ? "Stok Habis" : product.stock <= 5 ? `Sisa ${product.stock} unit!` : "Stok Tersedia"}
        </span>
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

          <p className="text-sm sm:text-base text-accent font-bold">Brand: {product.brand || "TeknoHub Official"}</p>

          {/* Pilihan Pembelian: Harga Dinamis, Varian, Qty, Ongkir, dan Tombol Beli */}
          <div className="pt-2">
            <ProductPurchaseOptions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                image_url: product.image_url,
                stock: Number(product.stock),
                brand: product.brand,
                category: product.category,
              }}
            />
          </div>

          <div className="pt-6 border-t border-border">
            <h2 className="text-xl font-semibold mb-3 text-muted">Deskripsi Produk</h2>
            <p className="text-tertiary leading-relaxed">{product.description || "Tidak ada deskripsi tersedia."}</p>
          </div>

          {/* Ulasan & diskusi produk */}
          <div className="pt-6 border-t border-border">
            <h2 className="text-xl font-semibold mb-4 text-muted">Review &amp; Diskusi Produk</h2>
            <ProductReviews productId={product.id} />
          </div>

          <RelatedForumThreads productName={product.name} brand={product.brand ?? ""} category={product.category} />
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
                className="group relative bg-surface border border-border rounded-2xl p-3 hover:border-accent transition duration-300 block"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
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
    </>
  );
}
