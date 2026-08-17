"use client";

import { useEffect, useState } from "react";
import { X, Printer, Loader2, Truck, Copy, Check, Download, KeyRound } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  is_digital?: boolean;
  digital_code?: string | null;
  download_url?: string | null;
  digital_instructions?: string | null;
  license_type?: string | null;
}
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

function LicenseCodeBox({ code, downloadUrl, instructions, licenseType }: { code: string; downloadUrl?: string | null; instructions?: string | null; licenseType?: string | null }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-2 rounded-xl border border-cyan-500/50 bg-cyan-50 p-3">
      <p className="text-[11px] font-bold text-cyan-700 flex items-center gap-1.5 mb-1.5">
        <KeyRound size={13} /> 🔑 Kode Lisensi / Serial Key{licenseType ? ` · ${licenseType}` : ""}
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 font-mono text-sm font-bold text-slate-900 bg-white border border-cyan-300 rounded-lg px-3 py-2 break-all select-all">
          {code}
        </code>
        <button
          onClick={copy}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
            copied ? "bg-emerald-600 text-white" : "bg-cyan-600 text-white hover:bg-cyan-700"
          }`}
        >
          {copied ? <><Check size={14} /> Tersalin!</> : <><Copy size={14} /> Salin Kode</>}
        </button>
      </div>
      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
        >
          <Download size={14} /> Unduh File Digital
        </a>
      )}
      {instructions && (
        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
          <span className="font-semibold">Panduan aktivasi: </span>
          {instructions}
        </p>
      )}
    </div>
  );
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
                <p className="font-bold text-slate-900 mb-1">{addr.is_all_digital ? "Data Penerima Lisensi" : "Alamat Pengiriman"}</p>
                <p>{addr.name || "-"}</p>
                {addr.email && <p>{addr.email}</p>}
                <p>{addr.phone || ""}</p>
                {!addr.is_all_digital && <p className="text-slate-500">{addr.address || ""}, {addr.city || ""} {addr.province || ""}</p>}
                {!addr.is_all_digital && <p className="text-slate-500">Kode Pos: {addr.postal_code || "-"}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 mb-1">Pembayaran & Pengiriman</p>
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
                  <tr key={it.id}>
                    <td className="p-2 border border-slate-300 align-top">
                      <p>{it.name}</p>
                      {it.is_digital && it.digital_code && (
                        <LicenseCodeBox
                          code={it.digital_code}
                          downloadUrl={it.download_url}
                          instructions={it.digital_instructions}
                          licenseType={it.license_type}
                        />
                      )}
                    </td>
                    <td className="p-2 border border-slate-300 text-center align-top">{it.quantity}</td>
                    <td className="p-2 border border-slate-300 text-right align-top">{fmt(Number(it.price))}</td>
                    <td className="p-2 border border-slate-300 text-right font-semibold align-top">{fmt(Number(it.price) * it.quantity)}</td>
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
