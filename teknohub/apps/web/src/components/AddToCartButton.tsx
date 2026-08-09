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
      className="w-full py-3 px-6 text-lg font-semibold rounded-xl transition duration-200 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg transform hover:scale-[1.01]"
    >
      Tambah ke Keranjang
    </button>
  );
}
