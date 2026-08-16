"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Zap, Check } from "lucide-react";

export interface StickyProduct {
  id: string; name: string; slug: string; price: number; stock: number; image_url: string | null;
}

export default function StickyBuyBar({ product }: { product: StickyProduct }) {
  const addItem = useCartStore((s) => s.add);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [visible, setVisible] = useState(false);

  // Muncul setelah scroll 300px, hilang saat kembali ke atas
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const out = product.stock <= 0;

  const add = (buy: boolean) => {
    if (out) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    if (buy) router.push("/shop/checkout");
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-black text-foreground truncate">{fmt(product.price)}</p>
        <p className="text-[10px] text-tertiary">{out ? "Stok Habis" : "Stok tersedia"}</p>
      </div>
      <button
        onClick={() => add(false)}
        disabled={out}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-slate-300 text-foreground text-xs font-bold shrink-0 disabled:opacity-50"
      >
        {added ? <Check size={14} className="text-emerald-500" /> : <ShoppingCart size={14} />}
        {added ? "Ditambah" : "+ Keranjang"}
      </button>
      <button
        onClick={() => add(true)}
        disabled={out}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-accent text-white text-xs font-bold shrink-0 disabled:opacity-50"
      >
        <Zap size={14} /> Beli Sekarang
      </button>
    </div>
  );
}
