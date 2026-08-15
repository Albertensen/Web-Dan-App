"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/store/cartStore";

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  if (items.length === 0) {
      return (
        <main className="flex-1 flex items-center justify-center px-6 min-h-[60vh]">
          <div className="flex flex-col items-center justify-center gap-5 text-center">
            <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center text-5xl shadow-sm border border-slate-300">
              🛒
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Keranjangmu kosong</h2>
            <p className="text-muted text-sm">Temukan produk terbaik di katalog kami</p>
            <Link
              href="/shop/products"
              className="bg-accent hover:bg-accent-secondary text-white px-8 py-3 rounded-full font-semibold transition shadow-sm"
            >
              Mulai Belanja →
            </Link>
          </div>
        </main>
      );
    }

  return (
    <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap" key={item.id}>
            <div className="w-20 h-20 bg-surface-2 rounded-xl flex items-center justify-center text-3xl shrink-0">
              {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                width={160}
                                height={160}
                                sizes="80px"
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                "🖥️"
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/shop/products/${item.slug}`} className="font-semibold line-clamp-1 hover:text-accent">
                {item.name}
              </Link>
              <p className="text-sm text-tertiary">{formatIDR(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-surface-2/60 font-bold"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-surface-2/60 font-bold"
              >
                +
              </button>
            </div>

            <div className="text-right w-32">
              <p className="font-semibold">{formatIDR(item.price * item.quantity)}</p>
              <button
                onClick={() => remove(item.id)}
                className="text-xs text-red-600 hover:text-red-300 mt-1"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-tertiary">
            Total ({totalItems} item)
          </p>
          <p className="text-2xl font-bold">{formatIDR(totalPrice)}</p>
        </div>
        <Link
          href="/shop/checkout"
          className="px-8 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Checkout
        </Link>
      </div>
    </main>
  );
}
