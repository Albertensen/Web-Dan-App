"use client";

import { useEffect, useState, useCallback } from "react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  currency: string;
  shipping_address: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    courier?: string;
    tracking_number?: string;
  };
  payment_method?: string;
  midtrans_order_id?: string;
  created_at: string;
  profiles?: { username?: string; full_name?: string };
  order_items?: OrderItem[];
}

const STATUS_LIST = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  paid: "bg-blue-100 text-blue-800 border-blue-300",
  processing: "bg-purple-100 text-purple-800 border-purple-300",
  shipped: "bg-cyan-100 text-cyan-800 border-cyan-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  refunded: "bg-slate-100 text-slate-800 border-slate-300",
};

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [courierInput, setCourierInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${filter}`);
      const json = await res.json();
      if (res.ok) setOrders(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function openDetail(order: Order) {
    setSelectedOrder(order);
    setStatusInput(order.status);
    setTrackingInput(order.shipping_address?.tracking_number ?? "");
    setCourierInput(order.shipping_address?.courier ?? "JNE");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: statusInput,
          trackingNumber: trackingInput,
          courier: courierInput,
        }),
      });
      if (res.ok) {
        setSelectedOrder(null);
        fetchOrders();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manajemen Pesanan</h1>
          <p className="text-xs text-tertiary">Kelola status transaksi, pengiriman &amp; nomor resi</p>
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {STATUS_LIST.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                filter === s
                  ? "bg-accent text-white"
                  : "bg-surface border border-slate-300 text-muted hover:border-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-tertiary">Memuat pesanan...</div>
      ) : orders.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-tertiary text-sm">Tidak ada pesanan dengan filter ini.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-2 text-xs text-tertiary uppercase border-b border-slate-300">
                <tr>
                  <th className="p-3">Order ID / Tanggal</th>
                  <th className="p-3">Pembeli</th>
                  <th className="p-3">Item</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Resi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <p className="font-mono text-xs font-semibold text-foreground">{o.id.slice(0, 8)}...</p>
                      <p className="text-[11px] text-tertiary">
                        {(o.created_at ?? "").slice(0, 10)}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-foreground">{o.shipping_address?.name || o.profiles?.username || "—"}</p>
                      <p className="text-[11px] text-tertiary">{o.shipping_address?.phone || "—"}</p>
                    </td>
                    <td className="p-3 text-xs text-tertiary">
                      {o.order_items?.map((item) => (
                        <p key={item.id} className="truncate max-w-xs">
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </td>
                    <td className="p-3 text-right font-bold text-foreground">
                      {formatIDR(Number(o.total_amount))}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLOR[o.status] ?? "bg-slate-100"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-tertiary">
                      {o.shipping_address?.tracking_number ? (
                        <span>{o.shipping_address.courier}: {o.shipping_address.tracking_number}</span>
                      ) : (
                        <span className="text-slate-400 italic">Belum ada</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => openDetail(o)}
                        className="px-3 py-1.5 rounded-lg bg-surface-2 border border-slate-300 hover:border-accent hover:text-accent text-xs font-semibold transition"
                      >
                        Detail / Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail & Update */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-300">
              <div>
                <h2 className="font-bold text-foreground text-lg">Detail Pesanan</h2>
                <p className="font-mono text-xs text-tertiary">ID: {selectedOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Info Alamat */}
            <div className="bg-surface-2 rounded-xl p-3 mb-4 text-xs space-y-1">
              <p className="font-bold text-foreground">Alamat Pengiriman:</p>
              <p className="text-tertiary">{selectedOrder.shipping_address?.name} ({selectedOrder.shipping_address?.phone})</p>
              <p className="text-tertiary">{selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.city} {selectedOrder.shipping_address?.postal_code}</p>
            </div>

            {/* Item List */}
            <div className="mb-4">
              <p className="text-xs font-bold text-foreground mb-2">Item ({selectedOrder.order_items?.length ?? 0}):</p>
              <ul className="space-y-1.5 text-xs">
                {selectedOrder.order_items?.map((item) => (
                  <li key={item.id} className="flex justify-between border-b border-slate-100 pb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold">{formatIDR(Number(item.price) * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-slate-300">
                <span>Total</span>
                <span className="text-accent">{formatIDR(Number(selectedOrder.total_amount))}</span>
              </div>
            </div>

            {/* Form Update */}
            <form onSubmit={handleUpdate} className="space-y-3 pt-3 border-t border-slate-300">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Status Pesanan</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full p-2 text-sm bg-surface border border-slate-300 rounded-lg"
                >
                  <option value="pending">Pending (Belum Bayar)</option>
                  <option value="paid">Paid (Sudah Bayar)</option>
                  <option value="processing">Processing (Sedang Dikemas)</option>
                  <option value="shipped">Shipped (Dalam Pengiriman)</option>
                  <option value="delivered">Delivered (Selesai/Sampai)</option>
                  <option value="cancelled">Cancelled (Dibatalkan)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Kurir</label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={(e) => setCourierInput(e.target.value)}
                    placeholder="JNE / J&T"
                    className="w-full p-2 text-sm bg-surface border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted mb-1">Nomor Resi</label>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Contoh: JNE123456789"
                    className="w-full p-2 text-sm bg-surface border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 text-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-accent text-white hover:bg-accent-secondary disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
