"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  brand: string | null;
  original_price?: number | null;
}

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_EMOJI: Record<string, string> = {
  laptop: "💻",
  smartphone: "📱",
  monitor: "🖥️",
  gpu: "🎮",
  cpu: "🧠",
  ram: "💾",
};

const CATEGORY_LABEL: Record<string, string> = {
  laptop: "Laptop",
  smartphone: "Smartphone",
  monitor: "Monitor",
  gpu: "GPU",
  cpu: "CPU",
  ram: "RAM",
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.add);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <div className="bg-surface border border-slate-300 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-accent transition duration-300 shadow-sm group">
      {/* Image — 4:3 + overlay on hover */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-surface-2/60">
            {PLACEHOLDER_EMOJI[product.category] ?? "🛒"}
          </div>
        )}
        {/* Category pill */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-medium tracking-wide">
          {CATEGORY_LABEL[product.category] ?? product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {product.brand && (
          <p className="text-[11px] text-muted font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
        )}
        <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-3 tracking-tight min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-semibold text-foreground">{fmt(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-tertiary line-through">{fmt(product.original_price!)}</span>
          )}
        </div>

        <p className={`text-xs mb-4 ${product.stock > 0 ? "text-accent" : "text-red-500"}`}>
          {product.stock > 0 ? `Stok: ${product.stock}` : "Habis"}
        </p>

        <div className="flex gap-2 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-center px-4 py-2.5 rounded-full border border-slate-400 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            Lihat Detail
          </Link>
          <button
            onClick={() => addItem(product)}
            className="px-4 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-black transition"
            aria-label="Tambah ke keranjang"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}
