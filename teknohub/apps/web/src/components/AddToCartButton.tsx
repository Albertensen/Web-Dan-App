"use client";

import { useCartStore } from "@/store/cartStore";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string | null;
    stock?: number;
  };
}

export default function AddToCartButton({ product, qty = 1 }: AddToCartButtonProps & { qty?: number }) {
  const add = useCartStore((s) => s.add);
  const out = (product.stock ?? 0) <= 0;

  return (
    <button
      onClick={() => add({ ...product, stock: product.stock ?? 0 }, qty)}
      disabled={out}
      className="w-full py-3.5 px-6 text-sm sm:text-base font-bold rounded-full transition duration-200 bg-accent hover:bg-accent-secondary text-white shadow-md shadow-accent/20 hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {out ? "Stok Habis" : "Tambah ke Keranjang"}
    </button>
  );
}
