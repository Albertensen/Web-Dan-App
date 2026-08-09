import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import AddToCartButton from "@/components/AddToCartButton";
import ThreadCard, { type ThreadProps } from "@/components/forum/ThreadCard";

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

  // Ulasan: thread komunitas yang menyebut produk ini (by title search) — real data
  let reviews: ThreadProps[] = [];
  try {
    const { data: found } = await supabase
      .from("threads")
      .select("*")
      .ilike("title", `%${product.name.split(" ")[0]}%`)
      .order("created_at", { ascending: false })
      .limit(3);
    if (found && found.length > 0) {
      reviews = found.map((t) => ({
        id: t.id,
        title: t.title,
        category_name: null,
        category_slug: null,
        author_username: null,
        author_avatar: null,
        author_reputation: null,
        reply_count: t.reply_count ?? 0,
        view_count: t.view_count ?? 0,
        last_reply_at: t.last_reply_at,
        is_pinned: t.is_pinned ?? false,
        tags: null,
        created_at: t.created_at,
      }));
    }
  } catch {
    // silent — tanpa ulasan
  }

  return (
    <div className="min-h-screen bg-surface text-foreground p-4 sm:p-8">
      {/* Breadcrumb */}
      <div className="mb-10 flex items-center space-x-3 text-sm text-tertiary">
        <span className="hover:text-accent">Beranda</span>
        <span>/</span>
        <span className="hover:text-accent">Produk</span>
        <span>/</span>
        <span className="font-medium text-foreground">{product.name}</span>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image/Placeholder */}
        <div className="col-span-1 flex justify-center items-start">
          <div className="w-full max-w-md aspect-[4/5] bg-surface-2 rounded-xl shadow-2xl p-6 flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-slate-500 text-8xl">🖥️</div>
            )}
          </div>
        </div>

        {/* Right Column: Details and CTA */}
        <div className="col-span-1 space-y-6">
          <h1 className="text-4xl font-extrabold text-slate-50">{product.name}</h1>

          <div className="flex items-baseline space-x-3">
            <p className="text-lg text-accent font-medium">Brand: {product.brand || "Unknown"}</p>
            <span className="text-5xl font-extrabold text-foreground">{formattedPrice}</span>
          </div>

          <div
            className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-medium ${
              product.stock > 5
                ? "bg-green-600/20 text-green-300 border border-green-700"
                : "bg-yellow-600/20 text-yellow-300 border border-yellow-700"
            }`}
          >
            Stok: {product.stock}
          </div>

          <div className="pt-4 border-t border-slate-300">
            <h2 className="text-xl font-semibold mb-3 text-muted">Deskripsi Produk</h2>
            <p className="text-tertiary leading-relaxed">{product.description || "Tidak ada deskripsi tersedia."}</p>
          </div>

          <div className="pt-6">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                image_url: product.image_url,
              }}
            />
          </div>

          {/* Ulasan produk dari komunitas */}
          <div className="pt-6 border-t border-slate-300">
            <h2 className="text-xl font-semibold mb-4 text-muted">Ulasan &amp; Diskusi Produk</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <ThreadCard key={r.id} thread={r} />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-surface-2/60 border border-dashed border-slate-300 rounded-xl text-center">
                <p className="text-sm text-muted">Belum ada ulasan untuk produk ini.</p>
                <p className="text-xs text-tertiary mt-1">
                  Diskusikan di forum komunitas untuk berbagi pengalaman!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
