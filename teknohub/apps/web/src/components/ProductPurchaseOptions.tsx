"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { Minus, Plus, Truck, ShieldCheck, Loader2 } from "lucide-react";

interface PurchaseProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  stock?: number;
  brand?: string | null;
  category?: string | null;
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
  const baseStock = product.stock ?? 0;
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);

  // State Ongkir
  const [city, setCity] = useState("");
  const [insur, setInsur] = useState(false);
  const [ongkir, setOngkir] = useState<{ label: string; cost: number } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const cat = (product.category ?? "").toLowerCase();
  const effectiveVariants = DEFAULT_VARIANTS[cat] ?? (cat.includes("laptop") ? DEFAULT_VARIANTS.laptop : cat.includes("smart") || cat.includes("phone") ? DEFAULT_VARIANTS.smartphone : undefined);
  const variant = effectiveVariants?.[variantIdx];
  const base = Number(product.price);
  const price = variant ? base + variant.priceDelta : base;
  const stock = variant?.stock ?? baseStock;

  const dec = (e: React.MouseEvent) => { e.preventDefault(); setQty((q) => Math.max(1, q - 1)); };
  const inc = (e: React.MouseEvent) => { e.preventDefault(); setQty((q) => Math.min(stock, q + 1)); };

  const checkOngkir = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!city.trim()) { setError("Masukkan kota/kecamatan dahulu"); return; }
    setError(""); setChecking(true); setOngkir(null);
    setTimeout(() => {
      const tariff = Math.round(22000 + (city.length % 5) * 5000);
      setOngkir({ label: "Reguler (JNE/SiCepat) 2-3 hari", cost: tariff });
      setChecking(false);
    }, 500);
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const out = stock <= 0;

  return (
    <div className="space-y-4">
      {/* Varian Produk */}
      {effectiveVariants && effectiveVariants.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted mb-2">Pilih Varian Produk</p>
          <div className="flex flex-wrap gap-2">
            {effectiveVariants.map((v, i) => (
              <button
                key={v.label}
                type="button"
                onClick={(e) => { e.preventDefault(); setVariantIdx(i); setQty(1); }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${variantIdx === i ? "border-accent bg-accent-dim text-accent shadow-sm" : "border-slate-300 dark:border-slate-800 text-muted hover:border-accent"}`}
              >
                {v.label}
                {v.priceDelta > 0 && <span className="ml-1.5 text-accent font-bold">+{fmt(v.priceDelta)}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Harga Dinamis + Qty Selector */}
      <div className="flex items-baseline justify-between pt-2">
        <span className="text-3xl sm:text-4xl font-black text-foreground">{fmt(price)}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted">Jumlah</span>
        <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-800 rounded-full p-1 bg-surface">
          <button type="button" onClick={dec} aria-label="Kurangi" disabled={qty <= 1 || out} className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-surface-2/80 font-bold disabled:opacity-40"><Minus size={14} /></button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button type="button" onClick={inc} aria-label="Tambah" disabled={qty >= stock || out} className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-surface-2/80 font-bold disabled:opacity-40"><Plus size={14} /></button>
        </div>
        <span className="text-xs text-tertiary">Maks. {stock} unit</span>
      </div>

      {/* Widget Estimasi Ongkir */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2.5 bg-surface-2/40">
        <p className="text-xs font-bold text-muted flex items-center gap-1.5"><Truck size={15} className="text-accent" /> Estimasi Ongkos Kirim</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); checkOngkir(e); } }}
            placeholder="Contoh: Jakarta Selatan, Surabaya..."
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-800 rounded-lg bg-surface text-sm text-foreground focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={(e) => checkOngkir(e)}
            disabled={checking}
            className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent-secondary transition disabled:opacity-50 flex items-center gap-1 shrink-0"
          >
            {checking ? <Loader2 size={14} className="animate-spin" /> : "Cek Ongkir"}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {ongkir && (
          <div className="text-xs space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
            <p className="font-semibold text-foreground">{ongkir.label}: <span className="text-accent font-bold">{fmt(ongkir.cost)}</span></p>
            <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
              <input type="checkbox" checked={insur} onChange={(e) => setInsur(e.target.checked)} className="accent-accent" />
              <ShieldCheck size={13} className="text-accent" /> Asuransi Pengiriman (+Rp 10.000)
            </label>
            {insur && <p className="text-tertiary">Total Ongkir + Asuransi: <span className="font-bold text-foreground">{fmt(ongkir.cost + 10000)}</span></p>}
          </div>
        )}
      </div>

      <AddToCartButton
        product={{ ...product, price, stock }}
        qty={qty}
      />
    </div>
  );
}
