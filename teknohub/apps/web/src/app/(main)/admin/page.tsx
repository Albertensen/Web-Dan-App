import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { getUserRole } from "@/lib/admin-auth";
import { Tag, Package, Star, Puzzle, ClipboardList, ShoppingCart, ShieldCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default async function AdminDashboardPage() {
  const role = await getUserRole();
  const isAdmin = role === "admin";
  const db = getServiceClient();

  const [ordersRes, quotesRes, productsRes] = await Promise.all([
    db.from("orders").select("id, status, total_amount, created_at"),
    isAdmin ? db.from("build_quotes").select("id, status") : Promise.resolve({ data: [] }),
    db.from("products").select("id, name, stock, is_active").order("stock", { ascending: true }).limit(5),
  ]);

  const orders = ordersRes.data ?? [];
  const quotes = quotesRes.data ?? [];
  const products = productsRes.data ?? [];

  const revenue = orders
    .filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const activeOrders = orders.filter((o) => ["pending", "paid", "processing", "shipped"].includes(o.status)).length;
  const pendingQuotes = quotes.filter((q) => q.status === "pending").length;
  const criticalStock = products.filter((p) => p.stock <= 5);

  // Tren 7 hari terakhir (jumlah pesanan per hari)
  const days: { label: string; count: number }[] = [];
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("id-ID", { weekday: "short" });
    const count = orders.filter((o) => (o.created_at ?? "").slice(0, 10) === key).length;
    days.push({ label, count });
  }
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  // Modul menu toko
  const modules = [
    { href: "/admin/orders", label: "Pesanan Toko", desc: "Kelola status & resi pengiriman", icon: Package },
    { href: "/admin/products", label: "Katalog Produk", desc: "Kelola stok & harga produk", icon: Tag },
    { href: "/admin/reviews", label: "Ulasan Pembeli", desc: "Monitoring rating & ulasan", icon: Star },
    ...(isAdmin ? [
      { href: "/admin/components", label: "Komponen PC (Admin)", desc: "Database & scraper harga", icon: Puzzle },
      { href: "/admin/quotes", label: "Penawaran Rakit (Admin)", desc: "Quote AI & invoice PDF", icon: ClipboardList },
      { href: "/admin/moderation", label: "Moderasi Forum (Admin)", desc: "Tindak laporan komunitas", icon: ShieldCheck },
      { href: "/admin/users", label: "Pengguna & Role (Admin)", desc: "Manajemen user & ban", icon: Users },
    ] : []),
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* KPI Cards */}
      <div className={`grid gap-4 mb-6 ${isAdmin ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
        <div className="bg-surface rounded-2xl border border-slate-300 p-4 shadow-sm">
          <p className="text-xs text-tertiary font-medium">Total Pendapatan (Revenue)</p>
          <p className="text-lg sm:text-2xl font-extrabold text-foreground mt-1 truncate">{formatIDR(revenue)}</p>
          <p className="text-[11px] text-tertiary mt-1">dari {orders.length} pesanan</p>
        </div>
        <div className="bg-surface rounded-2xl border border-slate-300 p-4 shadow-sm">
          <p className="text-xs text-tertiary font-medium">Pesanan Aktif Berjalan</p>
          <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">{activeOrders}</p>
          <Link href="/admin/orders" className="text-[11px] text-accent hover:underline">Kelola pesanan →</Link>
        </div>
        {isAdmin && (
          <div className="bg-surface rounded-2xl border border-slate-300 p-4 shadow-sm">
            <p className="text-xs text-tertiary font-medium">Quote Rakit Pending</p>
            <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">{pendingQuotes}</p>
            <Link href="/admin/quotes" className="text-[11px] text-accent hover:underline">Review quote →</Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tren Transaksi */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-slate-300 p-4 sm:p-5 shadow-sm">
          <h2 className="font-bold text-foreground mb-4 text-sm sm:text-base">Tren Transaksi Pesanan (7 hari)</h2>
          <div className="flex items-end gap-2 h-32 sm:h-36">
            {days.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-tertiary">{d.count}</span>
                <div
                  className="w-full rounded-t-lg bg-zone-blue/70 hover:bg-zone-blue transition"
                  style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? "4px" : "2px" }}
                />
                <span className="text-[10px] text-tertiary">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Stok Kritis */}
        <div className="bg-surface rounded-2xl border border-slate-300 p-4 sm:p-5 shadow-sm">
          <h2 className="font-bold text-foreground mb-4 text-sm sm:text-base">⚠️ Stok Kritis Produk</h2>
          {criticalStock.length === 0 ? (
            <p className="text-xs text-tertiary">Semua stok produk toko aman.</p>
          ) : (
            <ul className="space-y-2">
              {criticalStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium text-foreground max-w-[140px] sm:max-w-xs">{p.name}</span>
                  <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.stock <= 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {p.stock <= 0 ? "Habis" : `${p.stock} pcs`}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/products" className="inline-block mt-4 text-xs text-accent hover:underline">Kelola stok →</Link>
        </div>
      </div>

      {/* Feed Aktivitas Pesanan Terbaru */}
      <div className="bg-surface rounded-2xl border border-slate-300 p-4 sm:p-5 shadow-sm mb-6">
        <h2 className="font-bold text-foreground mb-3 text-sm sm:text-base">Aktivitas Pesanan Masuk</h2>
        {orders.length === 0 ? (
          <p className="text-xs text-tertiary">Belum ada pesanan masuk.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {[...orders.slice(-5)].reverse().map((o) => (
              <li key={o.id} className="flex items-center gap-2 text-tertiary flex-wrap sm:flex-nowrap">
                <span className="text-xs shrink-0"><ShoppingCart size={16} className="inline mr-1" /></span>
                <span className="truncate">Pesanan <b className="text-foreground">{formatIDR(Number(o.total_amount))}</b></span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  o.status === "delivered" ? "bg-green-100 text-green-700"
                  : o.status === "cancelled" ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
                }`}>{o.status}</span>
                <span className="ml-auto text-[11px] text-tertiary shrink-0">{(o.created_at ?? "").slice(0, 16).replace("T", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick links menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {modules.map((s) => (
          <Link key={s.href} href={s.href} className="bg-surface border border-slate-300 rounded-2xl p-4 hover:border-accent hover:shadow-md transition group">
            <div className="text-accent mb-2 flex justify-center"><s.icon size={22} /></div>
            <p className="font-semibold text-foreground text-xs sm:text-sm group-hover:text-accent">{s.label}</p>
            <p className="text-[11px] text-tertiary mt-0.5">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
