"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Tag, Check } from "lucide-react";

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const COUPONS: Record<string, { type: "percent" | "shipping"; value: number }> = {
  TEKNOHUB10: { type: "percent", value: 10 },
  GRATISONGKIR: { type: "shipping", value: 0.02 }, // represent: free shipping -> we apply credit later
};

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<null | { label: string; discount: number }>(null);
  const [couponErr, setCouponErr] = useState("");

  const allSelected = items.length > 0 && items.every((i) => selected[i.id]);
  const toggleAll = () => {
    const next = !allSelected;
    const sel: Record<string, boolean> = {};
    items.forEach((i) => (sel[i.id] = next));
    setSelected(sel);
  };
  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const subtotal = items.reduce((sum, i) => (selected[i.id] ? sum + i.price * i.quantity : sum), 0);
  const totalSelected = items.reduce((sum, i) => (selected[i.id] ? sum + i.quantity : sum), 0);
  const shipping = subtotal > 0 ? 25000 : 0;
  const discount = coupon ? coupon.discount : 0;
  const grand = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = () => {
    setCouponErr("");
    const c = code.trim().toUpperCase();
    if (COUPONS[c]?.type === "percent") {
      const dis = Math.round(subtotal * COUPONS[c].value / 100);
      setCoupon({ label: `Diskon ${COUPONS[c].value}% (${c})`, discount: dis });
    } else if (c === "GRATISONGKIR") {
      setCoupon({ label: "Gratis Ongkir (GRATISONGKIR)", discount: shipping });
    } else {
      setCouponErr("Kode promo tidak valid");
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 min-h-[60vh]">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <ShoppingBag size={48} className="text-slate-300 mx-auto mb-1" />
          <h2 className="text-2xl font-bold tracking-tight">Keranjang Belanjamu Masih Kosong</h2>
          <p className="text-muted text-sm max-w-sm">Racik PC impianmu lewat PC Builder AI atau jelajahi katalog komponen terbaik.</p>
          <Link href="/shop/products" className="mt-2 bg-accent hover:bg-accent-secondary text-white px-8 py-3 rounded-full font-semibold transition shadow-sm">
            Mulai Belanja Komputer
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>

      <div className="flex items-center gap-3 mb-3 px-1">
        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-accent w-4 h-4" />
          Pilih Semua ({items.length})
        </label>
        <button onClick={() => { items.forEach((i) => remove(i.id)); }} className="ml-auto text-xs text-red-600 hover:text-red-400">Hapus Semua</button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-surface" key={item.id}>
            <input type="checkbox" checked={!!selected[item.id]} onChange={() => toggle(item.id)} className="accent-accent w-4 h-4 shrink-0" />
            <Link href={`/shop/products/${item.slug}`} className="w-14 h-14 rounded-xl overflow-hidden bg-surface-2 border border-slate-200 shrink-0">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} width={160} height={160} sizes="56px" className="w-full h-full object-cover" />
              ) : null}
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/shop/products/${item.slug}`} className="font-semibold line-clamp-1 hover:text-accent">{item.name}</Link>
              <p className="text-sm text-tertiary">{formatIDR(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-surface-2/60 font-bold">−</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-surface-2/60 font-bold disabled:opacity-40 disabled:cursor-not-allowed">+</button>
            </div>
            <div className="text-right w-24">
              <p className="font-semibold">{formatIDR(item.price * item.quantity)}</p>
              <button onClick={() => remove(item.id)} className="text-xs text-red-600 hover:text-red-400 mt-1">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher */}
      <div className="mt-6 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-surface">
        <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Tag size={14} className="text-accent" /> Kode Promo / Voucher</p>
        <div className="flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="TEKNOHUB10 / GRATISONGKIR" className="flex-1 p-2.5 border border-slate-300 dark:border-slate-800 rounded-lg bg-surface text-sm" />
          <button onClick={applyCoupon} className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent-secondary transition">Terapkan</button>
        </div>
        {couponErr && <p className="text-xs text-red-600 mt-1">{couponErr}</p>}
        {coupon && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><Check size={12} /> {coupon.label}</p>}
      </div>

      {/* Ringkasan */}
      <div className="mt-6 glow-card p-5 sm:p-6">
        <p className="text-sm text-tertiary">Subtotal ({totalSelected} item): <span className="font-bold text-foreground">{formatIDR(subtotal)}</span></p>
        <p className="text-sm text-tertiary mt-1">Ongkir (estimasi): <span className="font-bold text-foreground">{coupon && coupon.label.includes("Gratis") ? "GRATIS" : formatIDR(shipping)}</span></p>
        {discount > 0 && <p className="text-sm text-emerald-600 mt-1">Diskon: −{formatIDR(discount)}</p>}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3 flex items-center justify-between">
          <span className="font-bold text-foreground">Total yang Dibayar</span>
          <span className="text-2xl font-black">{formatIDR(grand)}</span>
        </div>
        <Link
          href="/shop/checkout"
          className="mt-4 w-full flex items-center justify-center px-8 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Checkout
        </Link>
      </div>
    </main>
  );
}
