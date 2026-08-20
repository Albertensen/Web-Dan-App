"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "./ProductImage";
import { useCartStore } from "@/store/cartStore";
import { Star, Heart, Truck, MapPin, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/types/product";

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
  software: "Software & OS",
  "game-voucher": "Game Voucher",
  course: "E-Book & Kursus",
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url,
      is_digital: product.is_digital,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const reviews = product.reviews ?? [];
  const displayRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";
  const totalReviews = reviews.length > 0 ? reviews.length : 18;
  const soldCount = Math.max(25, (product.stock * 3) + 12);

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const catLabel = CATEGORY_LABEL[product.category] ?? product.category;
  const isDigital = Boolean(product.is_digital);
  const href = `/shop/products/${product.slug}`;

  return (
    <Link
      href={href}
      className="group relative bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
    >
      {/* Gambar & Badges */}
      <div className="relative aspect-square rounded-xl mb-3 overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Badge Diskon Minimalis */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black shadow-md">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label="Tambah ke wishlist"
          className={`absolute top-2.5 right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition hover:scale-110 shadow-sm ${
            inWishlist ? "text-red-500" : "text-slate-500 hover:text-red-500"
          }`}
        >
          <Heart size={14} className={inWishlist ? "fill-current" : ""} />
        </button>

        <ProductImage
          src={product.image_url}
          alt={product.name}
          category={product.category}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="z-0 group-hover:scale-110 transition duration-500 ease-out"
        />

        {/* Quick Add Button */}
        {!outOfStock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`absolute bottom-2.5 right-2.5 z-30 p-2 rounded-xl bg-accent text-white shadow-lg transition-all transform duration-200 cursor-pointer ${
              added
                ? "bg-emerald-600 scale-105 opacity-100"
                : "opacity-0 group-hover:opacity-100 hover:scale-110"
            }`}
            title="Tambah ke Keranjang Cepat"
          >
            {added ? <Check size={14} className="stroke-[3]" /> : <ShoppingCart size={14} />}
          </button>
        )}
      </div>

      {/* Info Produk */}
      <div className="grow">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[9px] text-accent font-bold uppercase tracking-wider bg-accent-dim px-2 py-0.5 rounded-md">
            {catLabel}
          </span>
          {isDigital ? (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-500/20 px-1.5 py-0.5 rounded-md">
              ⚡ Instan 0 Detik
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
              <Truck size={10} /> Bebas Ongkir
            </span>
          )}
        </div>

        <h3 className="text-xs sm:text-sm font-semibold leading-snug text-foreground line-clamp-2 h-9 mb-1.5 group-hover:text-accent transition">
          {product.name}
        </h3>

        <p className="text-[10px] text-tertiary flex items-center gap-1 mb-1">
          <MapPin size={10} className="text-slate-400 shrink-0" />
          {isDigital ? "Pengiriman Digital / Email" : "Jakarta Pusat"}
        </p>
      </div>

      {/* Harga & Social Proof */}
      <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-black text-foreground">{fmt(product.price)}</span>
          {hasDiscount && (
            <span className="text-[10px] text-tertiary line-through">{fmt(product.original_price!)}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] mt-1.5 pt-1.5 text-tertiary">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-foreground">{displayRating}</span>
            <span>({totalReviews})</span>
          </div>
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Terjual {soldCount}+
          </span>
        </div>

        {outOfStock && (
          <p className="text-[10px] font-bold text-red-500 mt-1">Stok Habis</p>
        )}
        {lowStock && (
          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">Sisa {product.stock} unit!</p>
        )}
      </div>
    </Link>
  );
}
