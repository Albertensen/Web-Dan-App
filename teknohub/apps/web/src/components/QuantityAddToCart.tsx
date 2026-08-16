"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { Minus, Plus } from "lucide-react";

interface QuantityAddToCartProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string | null;
    stock?: number;
  };
}

export default function QuantityAddToCart({ product }: QuantityAddToCartProps) {
  const stock = product.stock ?? 0;
  const [qty, setQty] = useState(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(stock, q + 1));

  if (stock <= 0) {
    return <AddToCartButton product={product} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted">Jumlah</span>
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-full p-1">
          <button onClick={dec} aria-label="Kurangi" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-surface-2/60 font-bold disabled:opacity-40 disabled:cursor-not-allowed" disabled={qty <= 1}>
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button onClick={inc} aria-label="Tambah" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-surface-2/60 font-bold disabled:opacity-40 disabled:cursor-not-allowed" disabled={qty >= stock}>
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-tertiary">Maks {stock}</span>
      </div>
      <AddToCartButton product={product} qty={qty} />
    </div>
  );
}
