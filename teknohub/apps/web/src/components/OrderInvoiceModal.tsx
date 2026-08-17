"use client";

import { useEffect, useState } from "react";
import { X, Printer, Loader2, Truck } from "lucide-react";

interface OrderItem { id: string; name: string; price: number; quantity: number; }
interface OrderDetail {
  id: string;
  status: string;
  total_amount: number;
  payment_method: string | null;
  created_at: string;
  shipping_address: Record<string, string>;
  shipping_courier?: string;
  tracking_number?: string;
  items: OrderItem[];
}

interface Props {
  orderId: string;
  onClose: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

function invoiceNumber(id: string): string {
  if (!id) return `#TKN-202608-${Math.floor(1000 + Math.random() * 9000)}`;
  return `#TKN-202608-${id.slice(0, 4).toUpperCase()}`;
}

export default function OrderInvoiceModal({ orderId, onClose }: Props) {
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/user/orders/${orderId}`)
      .then((r) => r.json())
      .then((j) => { if (!alive) return; setDetail(j.data ?? null); if (!j.data) setError(j.error || "Gagal memuat invoice"); })
      .catch(() => !alive || setError("Gagal memuat invoice"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [orderId]);

  const addr = detail?.shipping_address ?? {};
  const storeItems = detail?.items ?? [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-6 my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h3 className="font-bold text-lg">Invoice Pesanan</h3>
          <button onClick={onClose} aria-label="Tutup" className="text-slate-500 hover:text-slate-800"><X size={20} /></button>
        </div>

        {loading ? (
          <p className="text-slate-500 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Memuat invoice...</p>
        ) : error || !detail ? (
          <p className="text-red-600 text-sm">{error || "Data tidak ditemukan"}</p>
        ) : (
          <div className="print-area">
            {/* Kop */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
              <div>
                <p className="text-2xl font-black">TeknoHub</p>
                <p className="text-xs text-slate-500">Invoice resmi — Pusat Hardware & AI Builder</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold">{invoiceNumber(detail.id)}</p>
                <p className="text-xs text-slate-500">{fmtDate(detail.created_at)}</p>
              </div>
            </div>

            {/* Alamat */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="font-bold text-slate-900 mb-1">Alamat Pengiriman</p>
                <p>{addr.name || "-"}</p>
                <p>{addr.phone || ""}</p>
                <p className="text-slate-500">{addr.address || ""}, {addr.city || ""} {addr.province || ""}</p>
                <p className="text-slate-500">Kode Pos: {addr.postal_code || "-"}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 mb-1">Pembayaran & Kurir</p>
                <p>Metode: {detail.payment_method || "-"}</p>
                <p>Status: <span className="font-semibold uppercase">{detail.status}</span></p>
                <p className="flex items-center justify-end gap-1"><Truck size={12} /> {detail.shipping_courier || "Regular"} · Resi: {detail.tracking_number || "-"}</p>
              </div>
            </div>

            {/* Items */}
            <table className="w-full text-sm border border-slate-300 mb-4">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-2 border border-slate-300">Produk</th>
                  <th className="p-2 border border-slate-300 text-center">Qty</th>
                  <th className="p-2 border border-slate-300 text-right">Harga</th>
                  <th className="p-2 border border-slate-300 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {storeItems.length === 0 ? (
                  <tr><td className="p-3 text-slate-500" colSpan={4}>Tidak ada rincian item (pesanan mungkin dari jasa rakit).</td></tr>
                ) : storeItems.map((it) => (
                  <tr key={it.id} className="border-t border-slate-200">
                    <td className="p-2 border border-slate-300">{it.name}</td>
                    <td className="p-2 border border-slate-300 text-center">{it.quantity}</td>
                    <td className="p-2 border border-slate-300 text-right">{fmt(Number(it.price))}</td>
                    <td className="p-2 border border-slate-300 text-right font-semibold">{fmt(Number(it.price) * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="text-sm space-y-1 w-56">
                <div className="flex justify-between"><span>Subtotal</span><span>{fmt(Number(detail.total_amount))}</span></div>
                <div className="border-t border-slate-300 pt-1 flex justify-between font-black text-base"><span>Total</span><span>{fmt(Number(detail.total_amount))}</span></div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-2 justify-end print:hidden">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">Tutup</button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold flex items-center gap-2"><Printer size={14} /> Cetak Invoice (PDF)</button>
        </div>
      </div>
    </div>
  );
}
