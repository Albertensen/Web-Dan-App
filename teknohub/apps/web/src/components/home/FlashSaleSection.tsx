"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useCartStore } from "@/store/cartStore";
import { Zap, Timer, Flame, ShoppingCart, Check } from "lucide-react";

interface FlashProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number;
  soldPercent: number;
  image_url: string | null;
  category: string;
}

const FLASH_PRODUCTS: FlashProduct[] = [
  {
    id: "fs-1",
    name: "ROG Strix G16 RTX 4070 Gaming",
    slug: "rog-strix-g16",
    price: 26999000,
    originalPrice: 31999000,
    discountPercent: 15,
    stock: 4,
    soldPercent: 85,
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&q=80&auto=format&fit=crop",
    category: "laptop",
  },
  {
    id: "fs-2",
    name: "NVIDIA GeForce RTX 4080 Super 16GB",
    slug: "rtx-4080-super",
    price: 18499000,
    originalPrice: 21999000,
    discountPercent: 16,
    stock: 3,
    soldPercent: 90,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80&auto=format&fit=crop",
    category: "gpu",
  },
  {
    id: "fs-3",
    name: "Intel Core i9-14900K Raptor Lake",
    slug: "intel-core-i9-14900k",
    price: 8799000,
    originalPrice: 9999000,
    discountPercent: 12,
    stock: 6,
    soldPercent: 70,
    image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&q=80&auto=format&fit=crop",
    category: "cpu",
  },
  {
    id: "fs-4",
    name: "Samsung 990 PRO 2TB NVMe PCIe 4.0",
    slug: "samsung-990-pro-2tb",
    price: 2799000,
    originalPrice: 3499000,
    discountPercent: 20,
    stock: 8,
    soldPercent: 78,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200&q=80&auto=format&fit=crop",
    category: "storage",
  },
];

export default function FlashSaleSection() {
  const addItem = useCartStore((s) => s.add);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 28, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (p: FlashProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: p.id, name: p.name, slug: p.slug, price: p.price, stock: p.stock, image_url: p.image_url });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="bg-gradient-to-br from-[#0F2A4A] via-[#1E3A8A] to-[#1D4ED8] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-400/20 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-amber-300 flex items-center justify-center font-black shadow-inner">
            <Zap size={20} className="fill-current" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              FLASH SALE <span className="text-amber-400 font-bold text-xs uppercase px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">Hari Ini</span>
            </h2>
            <p className="text-xs text-blue-100/80 mt-0.5">Penawaran diskon terbatas hardware resmi distributor.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/20 px-3.5 py-1.5 rounded-2xl self-start sm:self-auto shadow-sm">
          <Timer size={15} className="text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">Berakhir:</span>
          <div className="flex items-center gap-1 font-mono text-xs font-black text-amber-400">
            <span className="bg-black/50 border border-white/15 px-2 py-0.5 rounded-md text-amber-300 font-mono font-bold">{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-black/50 border border-white/15 px-2 py-0.5 rounded-md text-amber-300 font-mono font-bold">{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-black/50 border border-white/15 px-2 py-0.5 rounded-md text-amber-300 font-mono font-bold">{pad(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FLASH_PRODUCTS.map((p) => {
          const isAdded = addedId === p.id;
          return (
            <Link
              key={p.id}
              href={`/shop/products/${p.slug}`}
              className="group relative bg-white text-slate-900 border border-slate-100 rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black shadow flex items-center gap-1">
                <Flame size={11} className="fill-current" /> -{p.discountPercent}%
              </span>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-3">
                <ProductImage
                  src={p.image_url}
                  alt={p.name}
                  category={p.category}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="group-hover:scale-110 transition duration-500 ease-out"
                />
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 mb-1.5 group-hover:text-accent transition">
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-amber-500">{fmt(p.price)}</span>
                  <span className="text-[10px] text-tertiary line-through">{fmt(p.originalPrice)}</span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${p.soldPercent}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-tertiary">
                  <span className="text-amber-500">Terjual {p.soldPercent}%</span>
                  <span>Sisa {p.stock} unit</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(p, e)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {isAdded ? <><Check size={14} /> Ditambahkan</> : <><ShoppingCart size={14} /> + Keranjang</>}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
