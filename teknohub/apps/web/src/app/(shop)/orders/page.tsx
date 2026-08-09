import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";

export const metadata = {
  title: "Riwayat Pesanan — TeknoHub",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-700/50",
  paid: "bg-green-500/20 text-green-300 border-green-700/50",
  processing: "bg-blue-500/20 text-accent border-blue-700/50",
  shipped: "bg-accent-dim text-accent border-accent/30",
  delivered: "bg-emerald-500/20 text-emerald-300 border-emerald-700/50",
  cancelled: "bg-red-500/20 text-red-300 border-red-700/50",
  refunded: "bg-slate-500/20 text-muted border-slate-300/50",
};

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Riwayat Pesanan</h1>
      <p className="text-tertiary mb-8">Semua transaksi kamu di TeknoHub</p>

      {!orders || orders.length === 0 ? (
        <div className="p-8 bg-surface-2/60 border border-dashed border-slate-300 rounded-xl text-center">
          <p className="text-lg font-medium text-tertiary">Belum ada pesanan</p>
          <p className="text-sm text-slate-500 mt-1">Yuk belanja dulu!</p>
          <Link
            href="/products"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-accent font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Lihat Produk
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glow-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm text-tertiary">{order.id.slice(0, 8)}</span>
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${STATUS_STYLES[order.status] ?? "bg-slate-500/20 text-muted border-slate-300/50"}`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-tertiary">{formatDate(order.created_at)}</span>
                <span className="font-semibold text-slate-100">{formatIDR(Number(order.total_amount))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
