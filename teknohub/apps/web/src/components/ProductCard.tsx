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
    <div className="glow-card group flex flex-col overflow-hidden animate-card-lift">
      {/* Image — 4:3 + overlay gradient on hover */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-surface-2/40">
            {PLACEHOLDER_EMOJI[product.category] ?? "🛒"}
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full neon-border bg-black/60 text-[11px] font-medium tracking-wide">
          {CATEGORY_LABEL[product.category] ?? product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-muted mb-1 uppercase tracking-wider">{product.brand}</p>
        )}
        <h3 className="text-base font-medium text-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-display text-xl gradient-text font-medium">{fmt(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-tertiary line-through">{fmt(product.original_price!)}</span>
          )}
        </div>

        <p className={`text-xs mb-4 ${product.stock > 0 ? "text-accent" : "text-red-400"}`}>
          {product.stock > 0 ? `Stok: ${product.stock}` : "Habis"}
        </p>

        <div className="flex gap-2 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-center px-4 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            Lihat Detail
          </Link>
          <button
            onClick={() => addItem(product)}
            className="px-4 py-2.5 rounded-full bg-accent text-black text-sm font-medium hover:opacity-90 transition-opacity"
            aria-label="Tambah ke keranjang"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}
