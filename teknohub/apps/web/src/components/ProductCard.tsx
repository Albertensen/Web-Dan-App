"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import ProductImage from "./ProductImage";
import { Star, Heart, ShoppingCart, Check } from "lucide-react";

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
  const addItem = useCartStore((s) => s.add);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

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

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const outOfStock = product.stock <= 0;
  const catLabel = CATEGORY_LABEL[product.category] ?? product.category;

  return (
    <div className="relative bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
      <div>
        <div className="aspect-square rounded-xl mb-4 overflow-hidden flex items-center justify-center relative bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none" />

          {/* Badge Diskon */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold shadow">
              -{discountPercent}%
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={toggleWishlist}
            aria-label="Tambah ke wishlist"
            className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 flex items-center justify-center transition hover:scale-110 shadow-sm ${
              inWishlist ? "text-red-500" : "text-slate-500 hover:text-red-500"
            }`}
          >
            <Heart size={16} className={inWishlist ? "fill-current" : ""} />
          </button>

          <span className="absolute bottom-3 right-3 z-20 px-2 py-0.5 rounded-md bg-surface/90 text-slate-700 text-[10px] font-bold border border-slate-200">
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
          <span className="text-[11px] text-slate-400">· {outOfStock ? "Stok Habis" : "Ready Stock"}</span>
        </div>

        {/* Nama Produk */}
        <Link href={`/shop/products/${product.slug}`} className="block">
          <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground line-clamp-2 hover:text-accent transition duration-150 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
          ))}
          <span className="text-tertiary text-[11px] font-medium ml-0.5">4.9 · 50+ ulasan</span>
        </div>
      </div>

      <div>
        {/* Harga */}
        <div className="flex items-baseline gap-2 mb-3">
          {hasDiscount && (
            <span className="text-xs text-tertiary line-through">{fmt(product.original_price!)}</span>
          )}
          <span className="text-base sm:text-lg font-black text-foreground">{fmt(product.price)}</span>
        </div>

        {/* Aksi */}
        <div className="flex items-center gap-2">
          <Link
            href={`/shop/products/${product.slug}`}
            className="flex-1 text-center bg-surface-2 hover:bg-slate-200 text-foreground py-2.5 rounded-full text-xs font-bold transition border border-border"
          >
            Detail
          </Link>
          <button
            onClick={quickAdd}
            disabled={outOfStock}
            className="flex-[1.4] flex items-center justify-center gap-1.5 bg-accent text-white hover:bg-accent-secondary py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent/20"
          >
            {outOfStock ? (
              "Stok Habis"
            ) : added ? (
              <>
                <Check size={14} /> Ditambahkan
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> + Keranjang
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-lg whitespace-nowrap">
          Produk berhasil ditambahkan ke keranjang
        </div>
      )}
    </div>
  );
}
