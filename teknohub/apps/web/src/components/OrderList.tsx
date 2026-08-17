"use client";

import Link from "next/link";
import { useState } from "react";
import OrderInvoiceModal from "@/components/OrderInvoiceModal";
import { Package, ReceiptText } from "lucide-react";

interface OrderRow { id: string; status: string; total_amount: number; created_at: string; }

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-300",
  paid: "bg-green-100 text-green-700 border-green-300",
  processing: "bg-blue-100 text-blue-700 border-blue-300",
  shipped: "bg-cyan-100 text-cyan-700 border-cyan-300",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  refunded: "bg-slate-100 text-slate-600 border-slate-300",
};

const formatIDR = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function OrderList({ orders }: { orders: OrderRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5">
        <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center text-5xl shadow-sm border border-border">
          <Package size={16} className="inline mr-1" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Belum ada pesanan</h2>
        <p className="text-muted text-sm">Pesananmu akan muncul di sini setelah checkout</p>
        <Link href="/shop/products" className="bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-accent-secondary transition shadow-sm">Lihat Produk →</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="glow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-sm text-tertiary">#{order.id.slice(0, 8).toUpperCase()}</span>
            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${STATUS_STYLES[order.status] ?? "bg-slate-100 text-muted border-slate-300"}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-tertiary">{formatDate(order.created_at)}</span>
            <span className="font-semibold text-foreground">{formatIDR(Number(order.total_amount))}</span>
          </div>
          <button
            onClick={() => setOpenId(order.id)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-foreground hover:border-accent hover:text-accent transition"
          >
            <ReceiptText size={14} /> Lihat Invoice / Cetak
          </button>
        </div>
      ))}

      {openId && <OrderInvoiceModal orderId={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
