"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Truck, ShieldCheck, Loader2, ShoppingCart, Zap, Check, KeyRound, Globe } from "lucide-react";

interface PurchaseProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  stock?: number;
  brand?: string | null;
  category?: string | null;
  is_digital?: boolean;
  license_type?: string | null;
  digital_instructions?: string | null;
}

interface Variant {
  label: string;
  priceDelta: number;
  stock?: number;
}

interface Props {
  product: PurchaseProduct;
  variants?: Variant[];
}

const DEFAULT_VARIANTS: Record<string, Variant[]> = {
  laptop: [
    { label: "RAM 16GB / 512GB SSD", priceDelta: 0, stock: 10 },
    { label: "RAM 32GB / 1TB SSD", priceDelta: 2500000, stock: 8 },
  ],
  smartphone: [
    { label: "128GB Storage", priceDelta: 0, stock: 20 },
    { label: "256GB Storage", priceDelta: 1800000, stock: 15 },
  ],
};

export default function ProductPurchaseOptions({ product }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.add);

  const isDigital = Boolean(product.is_digital);
  const baseStock = product.stock ?? 0;
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [added, setAdded] = useState(false);

  // State Ongkir (hanya untuk fisik)
  const [city, setCity] = useState("");
  const [insur, setInsur] = useState(false);
  const [ongkir, setOngkir] = useState<{ label: string; cost: number } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const cat = (product.category ?? "").toLowerCase();
  const effectiveVariants = !isDigital
    ? (DEFAULT_VARIANTS[cat] ??
      (cat.includes("laptop")
        ? DEFAULT_VARIANTS.laptop
        : cat.includes("smart") || cat.includes("phone")
        ? DEFAULT_VARIANTS.smartphone
        : undefined))
    : undefined;

  const variant = effectiveVariants?.[variantIdx];
  const base = Number(product.price);
  const price = variant ? base + variant.priceDelta : base;
  const stock = variant?.stock ?? baseStock;
  const out = stock <= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const handleAddToCart = (buyNow: boolean = false) => {
    if (out) return;
    const itemToAdd = {
      id: product.id,
      name: variant ? `${product.name} (${variant.label})` : product.name,
      slug: product.slug,
      price,
      stock,
      image_url: product.image_url,
    };

    addItem(itemToAdd, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    if (buyNow) {
      router.push("/shop/checkout");
    }
  };

  const handleCheckOngkir = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city.trim()) {
      setError("Masukkan kota/kecamatan dahulu");
      return;
    }
    setError("");
    setChecking(true);
    setOngkir(null);
    setTimeout(() => {
      const tariff = Math.round(22000 + (city.length % 5) * 5000);
      setOngkir({ label: "Reguler (JNE/SiCepat) 2-3 hari", cost: tariff });
      setChecking(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Harga Utama Dinamis */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            {fmt(price)}
          </span>
          {isDigital && (
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <Zap size={14} /> Lisensi Digital Instan
            </span>
          )}
        </div>
        {variant && variant.priceDelta > 0 && (
          <p className="text-xs text-accent font-semibold mt-1">
            Termasuk penyesuaian varian: +{fmt(variant.priceDelta)}
          </p>
        )}
        {isDigital && product.license_type && (
          <p className="text-xs font-semibold text-tertiary mt-1 flex items-center gap-1">
            <KeyRound size={12} className="text-cyan-500" /> Tipe Lisensi:{" "}
            <span className="text-foreground font-bold">{product.license_type}</span>
          </p>
        )}
      </div>

      {/* Pilihan Varian Produk (Fisik) */}
      {effectiveVariants && effectiveVariants.length > 0 && (
        <div>
          <p className="text-sm font-bold text-foreground mb-2.5">Pilih Varian</p>
          <div className="flex flex-wrap gap-2.5">
            {effectiveVariants.map((v, i) => {
              const isSelected = variantIdx === i;
              return (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => {
                    setVariantIdx(i);
                    setQty(1);
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                    isSelected
                      ? "border-accent bg-accent text-white shadow-md shadow-accent/20 scale-[1.02]"
                      : "border-slate-300 dark:border-slate-800 bg-surface text-muted hover:border-accent hover:text-foreground"
                  }`}
                >
                  {isSelected && <Check size={14} className="stroke-[3]" />}
                  <span>{v.label}</span>
                  {v.priceDelta > 0 && (
                    <span className={isSelected ? "text-white/90" : "text-accent font-bold"}>
                      (+{fmt(v.priceDelta)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Jumlah / Kuantitas */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-foreground">Jumlah</span>
        <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-800 rounded-full p-1 bg-surface shadow-sm">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1 || out}
            aria-label="Kurangi Jumlah"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground font-bold disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-bold text-sm text-foreground select-none">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            disabled={qty >= stock || out}
            aria-label="Tambah Jumlah"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground font-bold disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-tertiary">
          {out ? "Stok Habis" : `Tersedia ${stock} unit`}
        </span>
      </div>

      {/* Tombol Aksi Tambah ke Keranjang & Beli Sekarang */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleAddToCart(false)}
          disabled={out}
          className="flex-1 py-3.5 px-6 text-sm font-bold rounded-full transition-all border-2 border-accent text-accent hover:bg-accent hover:text-white flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {added ? (
            <>
              <Check size={16} /> Berhasil Ditambahkan
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Tambah ke Keranjang
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleAddToCart(true)}
          disabled={out}
          className="flex-1 py-3.5 px-6 text-sm font-bold rounded-full transition-all bg-accent hover:bg-accent-secondary text-white flex items-center justify-center gap-2 shadow-md shadow-accent/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Zap size={16} /> Beli Sekarang
        </button>
      </div>

      {/* Widget Pengiriman: Digital vs Ongkir Fisik */}
      {isDigital ? (
        <div className="rounded-2xl border border-cyan-500/30 dark:border-cyan-500/20 p-4 space-y-2 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-950/30 dark:to-blue-950/20">
          <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
            <Zap size={16} /> Pengiriman Digital Instan (0 Detik)
          </p>
          <p className="text-xs text-tertiary leading-relaxed">
            Kode lisensi serial key, voucher, atau link unduhan akan langsung diterbitkan di halaman invoice pesanan dan dikirim ke email akun Anda setelah pembayaran terkonfirmasi.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
            <Globe size={13} /> Bebas Ongkos Kirim 100% (Non-Fisik)
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-surface-2/40">
          <p className="text-xs font-bold text-foreground flex items-center gap-2">
            <Truck size={16} className="text-accent" /> Estimasi Ongkos Kirim
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCheckOngkir();
                }
              }}
              placeholder="Ketik nama kota / kecamatan..."
              className="flex-1 px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-xl bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="button"
              onClick={() => handleCheckOngkir()}
              disabled={checking}
              className="px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-secondary transition disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {checking ? <Loader2 size={14} className="animate-spin" /> : "Cek Ongkir"}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          {ongkir && (
            <div className="text-xs space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="font-semibold text-foreground">
                {ongkir.label}: <span className="text-accent font-black text-sm">{fmt(ongkir.cost)}</span>
              </p>
              <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={insur}
                  onChange={(e) => setInsur(e.target.checked)}
                  className="accent-accent w-4 h-4 rounded"
                />
                <ShieldCheck size={14} className="text-accent" /> Asuransi Pengiriman (+Rp 10.000)
              </label>
              {insur && (
                <p className="text-tertiary">
                  Total Estimasi: <span className="font-bold text-foreground">{fmt(ongkir.cost + 10000)}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
