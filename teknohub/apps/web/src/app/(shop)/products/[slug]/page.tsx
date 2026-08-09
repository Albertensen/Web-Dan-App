import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import AddToCartButton from "@/components/AddToCartButton";

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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 sm:p-8">
      {/* Breadcrumb */}
      <div className="mb-10 flex items-center space-x-3 text-sm text-slate-400">
        <span className="hover:text-blue-400">Beranda</span>
        <span>/</span>
        <span className="hover:text-blue-400">Produk</span>
        <span>/</span>
        <span className="font-medium text-slate-200">{product.name}</span>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image/Placeholder */}
        <div className="col-span-1 flex justify-center items-start">
          <div className="w-full max-w-md aspect-[4/5] bg-slate-800 rounded-xl shadow-2xl p-6 flex items-center justify-center">
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
            <p className="text-lg text-blue-400 font-medium">Brand: {product.brand || "Unknown"}</p>
            <span className="text-5xl font-extrabold text-slate-200">{formattedPrice}</span>
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

          <div className="pt-4 border-t border-slate-700">
            <h2 className="text-xl font-semibold mb-3 text-slate-300">Deskripsi Produk</h2>
            <p className="text-slate-400 leading-relaxed">{product.description || "Tidak ada deskripsi tersedia."}</p>
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
        </div>
      </div>
    </div>
  );
}
