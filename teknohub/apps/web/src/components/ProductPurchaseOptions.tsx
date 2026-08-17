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
}

interface Variant {
  label: string;
  priceDelta: number; // selisih harga dari base
  stock?: number;
}

interface Props {
  product: PurchaseProduct;
  variants?: Variant[];
}

// Varian default utk laptop/smartphone bila parent tak kasi
const DEFAULT_VARIANTS: Record<string, Variant[]> = {
  laptop: [
    { label: "RAM 16GB / 512GB", priceDelta: 0, stock: 10 },
    { label: "RAM 32GB / 1TB", priceDelta: 2500000, stock: 8 },
  ],
  smartphone: [
    { label: "128GB", priceDelta: 0, stock: 20 },
    { label: "256GB", priceDelta: 1800000, stock: 15 },
  ],
};

export default function ProductPurchaseOptions({ product }: Props) {
  const baseStock = product.stock ?? 0;
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  // ongkir
  const [city, setCity] = useState("");
  const [insur, setInsur] = useState(false);
  const [ongkir, setOngkir] = useState<{ label: string; cost: number } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const variants = DEFAULT_VARIANTS[product.slug.startsWith("laptop") ? "laptop" : (product.slug.startsWith("galaxy") || product.slug.startsWith("iphone") || product.slug.startsWith("redmi") ? "smartphone" : "")];
  const cat = variants && variants.length ? "laptop" : (DEFAULT_VARIANTS["smartphone"] && (product.slug.includes("galaxy")||product.slug.includes("iphone")||product.slug.includes("redmi")) ? "smartphone" : "");
  const effectiveVariants = (!variants || variants.length===0) ? (cat ? DEFAULT_VARIANTS[cat] : undefined) : variants;
  const variant = effectiveVariants?.[variantIdx];
  const base = Number(product.price);
  const price = variant ? base + variant.priceDelta : base;
  const stock = variant?.stock ?? baseStock;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(stock, q + 1));

  const checkOngkir = () => {
    if (!city.trim()) { setError("Masukkan kota/kecamatan dahulu"); return; }
    setError(""); setChecking(true); setOngkir(null);
    // estimasi deterministik
    setTimeout(() => {
      const tariff = Math.round(20000 + Math.random() * 25000);
      setOngkir({ label: "Reguler (JNE/SiCepat) 2-4 hari", cost: tariff });
      setChecking(false);
    }, 600);
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const out = stock <= 0;

  return (
    <div className="space-y-4">
      {/* Varian */}
      {effectiveVariants && effectiveVariants.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted mb-2">Varian Produk</p>
          <div className="flex flex-wrap gap-2">
            {effectiveVariants.map((v, i) => (
              <button
                key={v.label}
                onClick={() => { setVariantIdx(i); setQty(1); }}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${variantIdx === i ? "border-accent bg-accent-dim text-accent" : "border-slate-300 text-muted hover:border-accent"}`}
              >
                {v.label}
                {v.priceDelta > 0 && <span className="ml-1 text-accent">+{fmt(v.priceDelta)}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Harga varian + qty */}
      <div className="flex items-center justify-between">
        <span className="text-3xl sm:text-4xl font-black text-foreground">{fmt(price)}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted">Jumlah</span>
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-full p-1">
          <button onClick={dec} aria-label="Kurangi" disabled={qty <= 1 || out} className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-surface-2/60 font-bold disabled:opacity-40"><Minus size={14} /></button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button onClick={inc} aria-label="Tambah" disabled={qty >= stock || out} className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 hover:bg-surface-2/60 font-bold disabled:opacity-40"><Plus size={14} /></button>
        </div>
        <span className="text-xs text-tertiary">Maks {stock}</span>
      </div>

      {/* Ongkir */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2">
        <p className="text-xs font-bold text-muted flex items-center gap-1"><Truck size={14} className="text-accent" /> Estimasi Ongkos Kirim</p>
        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Kota / Kecamatan"
            className="flex-1 p-2.5 border border-slate-300 dark:border-slate-800 rounded-lg bg-surface text-sm text-foreground"
          />
          <button onClick={checkOngkir} disabled={checking} className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-bold disabled:opacity-50">
            {checking ? <Loader2 size={14} className="animate-spin" /> : "Cek Ongkir"}
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {ongkir && (
          <div className="text-xs space-y-1">
            <p className="font-semibold text-foreground">{ongkir.label}: {fmt(ongkir.cost)}</p>
            <label className="flex items-center gap-2 text-muted cursor-pointer">
              <input type="checkbox" checked={insur} onChange={(e) => setInsur(e.target.checked)} className="accent-accent" />
              <ShieldCheck size={12} className="text-accent" /> Asuransi Pengiriman (+Rp 10.000)
            </label>
            {insur && <p className="text-tertiary">Total ongkir + asuransi: {fmt(ongkir.cost + 10000)}</p>}
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
