"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Zap, Check } from "lucide-react";

export interface StickyProduct {
  id: string; name: string; slug: string; price: number; stock: number; image_url: string | null;
  is_digital?: boolean;
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
    <><div className={`fixed top-20 left-0 right-0 z-40 hidden md:flex transition-transform duration-300 bg-surface/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 items-center gap-4 shadow-md ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="flex w-full h-full items-center justify-center text-[9px] font-black text-accent">{product.name.slice(0,2).toUpperCase()}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
        <p className="text-xs font-semibold text-accent">{fmt(product.price)}</p>
      </div>
      <button
        onClick={() => add(false)}
        disabled={out}
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {out ? <><ShoppingCart size={14} /> Stok Habis</> : added ? <><Check size={14} /> Ditambah</> : <><ShoppingCart size={14} /> + Keranjang</>}
      </button>
    </div>
    <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-black text-foreground truncate">{fmt(product.price)}</p>
        <p className="text-[10px] text-tertiary">{out ? "Stok Habis" : "Stok tersedia"}</p>
      </div>
      <button
        onClick={() => add(false)}
        disabled={out}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-slate-300 text-foreground text-xs font-bold shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {out ? null : added ? <Check size={14} className="text-emerald-500" /> : <ShoppingCart size={14} />}
        {out ? "Stok Habis" : added ? "Ditambah" : "+ Keranjang"}
      </button>
      <button
        onClick={() => add(true)}
        disabled={out}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-accent text-white text-xs font-bold shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {out ? null : <><Zap size={14} /> Beli Sekarang</>}
        {out && "Stok Habis"}
      </button>
    </div></>
  );
}
