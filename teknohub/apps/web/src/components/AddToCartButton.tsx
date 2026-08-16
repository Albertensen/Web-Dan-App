"use client";

import { useCartStore } from "@/store/cartStore";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);

  return (
    <button
      onClick={() => add(product)}
      className="w-full py-3.5 px-6 text-sm sm:text-base font-bold rounded-full transition duration-200 bg-accent hover:bg-accent-secondary text-white shadow-md shadow-accent/20 hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
    >
      Tambah ke Keranjang
    </button>
  );
}
