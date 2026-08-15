"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import ProductImage from "./ProductImage";

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
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.add);

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const hasDiscount = product.original_price && product.original_price > product.price;
  const catLabel = CATEGORY_LABEL[product.category] ?? product.category;

  return (
    <div className="bg-surface border border-slate-300 rounded-[2rem] p-5 flex flex-col justify-between hover:border-accent transition duration-300 shadow-sm group">
      <div>
        {/* Gambar full + hover zoom (scale-110 halus) */}
        <div className="h-56 rounded-[1.5rem] mb-5 overflow-hidden flex items-center justify-center relative bg-surface-2/80">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none" />
          <ProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="z-0 group-hover:scale-110 transition duration-500 ease-out"
          />
        </div>

        {/* Kategori */}
        <span className="text-[10px] text-accent font-semibold uppercase tracking-wider block mb-1">
          {product.brand ? `${product.brand} / ` : ""}
          {catLabel}
        </span>

        {/* Nama */}
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-1 line-clamp-2">{product.name}</h3>

        {/* Deskripsi singkat */}
        {product.description && (
          <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">{product.description}</p>
        )}
      </div>

      <div>
        {/* Harga */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-sm font-semibold text-foreground">{fmt(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-tertiary line-through">{fmt(product.original_price!)}</span>
          )}
        </div>

        {/* 2 tombol pill berdampingan */}
        <div className="flex gap-2">
          <Link
            href={`/shop/products/${product.slug}`}
            className="flex-1 text-center bg-surface-2 hover:bg-accent hover:text-white text-foreground py-2 rounded-full text-xs font-medium transition"
          >
            Detail
          </Link>
          <button
            onClick={() => addItem(product)}
            className="flex-1 bg-accent text-white hover:bg-accent-secondary py-2 rounded-full text-xs font-medium transition disabled:opacity-50"
            disabled={product.stock <= 0}
          >
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}
