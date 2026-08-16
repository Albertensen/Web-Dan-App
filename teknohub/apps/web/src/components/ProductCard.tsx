"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "./ProductImage";
import { Star, Heart } from "lucide-react";

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

const WISHLIST_KEY = "teknohub-wishlist";

function readWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    setWishlist(readWishlist().includes(product.id));
  }, [product.id]);

  const inWishlist = wishlist;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ids = readWishlist();
    const next = inWishlist ? ids.filter((id) => id !== product.id) : [...ids, product.id];
    writeWishlist(next);
    setWishlist(!inWishlist);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const outOfStock = product.stock <= 0;
  const catLabel = CATEGORY_LABEL[product.category] ?? product.category;
  const href = `/shop/products/${product.slug}`;

  return (
    <Link
      href={href}
      className="group relative bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full"
    >
      {/* Gambar */}
      <div className="relative aspect-square rounded-xl mb-3 overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none" />

        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold shadow">
            -{discountPercent}%
          </span>
        )}

        <button
          onClick={toggleWishlist}
          aria-label="Tambah ke wishlist"
          className={`absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 flex items-center justify-center transition hover:scale-110 shadow-sm ${
            inWishlist ? "text-red-500" : "text-slate-500 hover:text-red-500"
          }`}
        >
          <Heart size={16} className={inWishlist ? "fill-current" : ""} />
        </button>

        <ProductImage
          src={product.image_url}
          alt={product.name}
          category={product.category}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="z-0 group-hover:scale-110 transition duration-500 ease-out"
        />
      </div>

      {/* Info tengah */}
      <div className="grow">
        <span className="inline-block text-[10px] text-accent font-bold uppercase tracking-wider bg-accent-dim px-2 py-0.5 rounded-full mb-1.5">
          {catLabel}
        </span>
        <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground line-clamp-2 mb-1">
          {product.name}
        </h3>
      </div>

      {/* Harga */}
      <div className="flex items-baseline gap-2 mt-2">
        {hasDiscount && (
          <span className="text-[11px] text-tertiary line-through">{fmt(product.original_price!)}</span>
        )}
        <span className="text-base sm:text-lg font-black text-foreground">{fmt(product.price)}</span>
      </div>

      {/* Rating + garansi */}
      <div className="flex items-center gap-1 text-[11px] mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
        <div className="flex items-center gap-0.5 shrink-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-tertiary font-medium">4.9 · Jakarta Barat · Garansi Resmi</span>
        {outOfStock && (
          <span className="ml-auto text-[10px] font-bold text-red-500">Stok Habis</span>
        )}
      </div>
    </Link>
  );
}
