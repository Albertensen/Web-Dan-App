"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import ProductImage from "./ProductImage";
import { Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  brand: string | null;
  description?: string | null;
  original_price?: number | null;
}

interface ProductCardProps {
  product: Product;
}

const CATEGORY_LABEL: Record<string, string> = {
  laptop: "Laptop",
  smartphone: "Smartphone",
  monitor: "Monitor",
  gpu: "GPU",
  cpu: "CPU",
  ram: "RAM",
  storage: "Storage",
  motherboard: "Motherboard",
  psu: "Power Supply",
  case: "Casing",
  cooler: "Cooler",
  aksesoris: "Aksesoris",
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.add);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const catLabel = CATEGORY_LABEL[product.category] ?? product.category;

  return (
    <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
      <div>
        {/* Gambar Produk dengan Zoom Halus & Badge Diskon */}
        <div className="aspect-square rounded-xl mb-4 overflow-hidden flex items-center justify-center relative bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none" />

          {hasDiscount && (
            <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold shadow">
              HEMAT {discountPercent}%
            </span>
          )}

          <span className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-surface/90 text-slate-700 text-[10px] font-bold border border-slate-200">
            {product.brand || "Official"}
          </span>

          <ProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="z-0 group-hover:scale-110 transition duration-500 ease-out"
          />
        </div>

        {/* Kategori & Tag */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] text-accent font-bold uppercase tracking-wider bg-accent-dim px-2 py-0.5 rounded-full">
            {catLabel}
          </span>
          <span className="text-[11px] text-slate-400">· Garansi Resmi</span>
        </div>

        {/* Nama Produk */}
        <Link href={`/shop/products/${product.slug}`} className="block">
          <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground line-clamp-2 hover:text-accent transition duration-150 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Penjualan Mock */}
        <div className="flex items-center gap-1 text-xs mb-2">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
          ))}
          <span className="text-tertiary text-[11px] font-medium ml-0.5">4.9 · 50+ ulasan</span>
        </div>
      </div>

      <div>
        {/* Harga & Diskon */}
        <div className="flex flex-col mb-3">
          {hasDiscount && (
            <span className="text-xs text-tertiary line-through">{fmt(product.original_price!)}</span>
          )}
          <span className="text-base sm:text-lg font-black text-foreground">{fmt(product.price)}</span>
        </div>

        {/* 2 Tombol Aksi Marketplace */}
        <div className="flex items-center gap-2">
          <Link
            href={`/shop/products/${product.slug}`}
            className="flex-1 text-center bg-surface-2 hover:bg-slate-200 text-foreground py-2.5 rounded-full text-xs font-bold transition border border-border"
          >
            Detail
          </Link>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className="flex-1 bg-accent text-white hover:bg-accent-secondary py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50 shadow-md shadow-accent/20"
          >
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
