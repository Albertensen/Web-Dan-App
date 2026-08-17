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
    name: "ROG Strix G16 (2026) RTX 4070",
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

  // Realtime Countdown Timer (Hitung mundur s/d 23:59:59 malam ini)
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

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
    <section className="bg-gradient-to-br from-red-600 via-rose-700 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
      {/* Header Flash Sale */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black shadow-lg">
            <Zap size={22} className="fill-current" />
          </span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              FLASH SALE <span className="text-yellow-300 font-extrabold text-sm uppercase px-2 py-0.5 bg-black/30 rounded-lg">Hari Ini</span>
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">Diskon terbatas produk hardware pilihan bergaransi resmi.</p>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 self-start sm:self-auto">
          <Timer size={16} className="text-yellow-300 animate-pulse" />
          <span className="text-xs font-bold text-rose-200">Berakhir dalam:</span>
          <div className="flex items-center gap-1 font-mono text-sm font-black">
            <span className="bg-white text-black px-2 py-1 rounded-lg">{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-white text-black px-2 py-1 rounded-lg">{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-white text-black px-2 py-1 rounded-lg">{pad(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>

      {/* Grid Produk Flash Sale */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FLASH_PRODUCTS.map((p) => {
          const isAdded = addedId === p.id;
          return (
            <Link
              key={p.id}
              href={`/shop/products/${p.slug}`}
              className="group relative bg-surface text-foreground rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Diskon Badge */}
              <span className="absolute top-3 left-3 z-10 px-2 py-1 rounded-lg bg-red-600 text-white text-[11px] font-black shadow-md flex items-center gap-1">
                <Flame size={12} className="fill-current" /> -{p.discountPercent}%
              </span>

              {/* Foto Produk */}
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

              {/* Info Produk */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 mb-1.5 group-hover:text-accent transition">
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-red-600">{fmt(p.price)}</span>
                  <span className="text-[10px] text-tertiary line-through">{fmt(p.originalPrice)}</span>
                </div>
              </div>

              {/* Progress Bar Stok Terjual */}
              <div className="mt-3 space-y-1.5">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full transition-all duration-1000" style={{ width: `${p.soldPercent}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-tertiary">
                  <span className="text-red-600 flex items-center gap-0.5">🔥 Terjual {p.soldPercent}%</span>
                  <span>Sisa {p.stock} unit</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(p, e)}
                  className="w-full mt-2 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-secondary transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
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
