import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ADMIN_SECTIONS = [
  { href: "/admin/orders", label: "Pesanan", desc: "Kelola status & resi", icon: "📦" },
  { href: "/admin/products", label: "Produk", desc: "Katalog & stok", icon: "🏷️" },
  { href: "/admin/components", label: "Komponen PC", desc: "Scraper & harga", icon: "🧩" },
  { href: "/admin/quotes", label: "Penawaran Rakit", desc: "Quote & invoice", icon: "📋" },
  { href: "/admin/moderation", label: "Moderasi Forum", desc: "Report & thread", icon: "🛡️" },
  { href: "/admin/reviews", label: "Ulasan Produk", desc: "Rating & review", icon: "⭐" },
  { href: "/admin/users", label: "Pengguna & Role", desc: "Role, ban, audit", icon: "👥" },
];

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key);
}

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default async function AdminDashboardPage() {
  const db = getServiceClient();

  const [ordersRes, quotesRes, threadsRes, reportsRes, productsRes] = await Promise.all([
    db.from("orders").select("id, status, total_amount, created_at"),
    db.from("build_quotes").select("id, status"),
    db.from("threads").select("id, is_locked, created_at"),
    db.from("reports").select("id, status"),
    db.from("products").select("id, name, stock, is_active").order("stock", { ascending: true }).limit(5),
  ]);

  const orders = ordersRes.data ?? [];
  const quotes = quotesRes.data ?? [];
  const threads = threadsRes.data ?? [];
  const reports = reportsRes.data ?? [];
  const products = productsRes.data ?? [];

  const revenue = orders
    .filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const activeOrders = orders.filter((o) => ["pending", "paid", "processing", "shipped"].includes(o.status)).length;
  const pendingQuotes = quotes.filter((q) => q.status === "pending").length;
  const openReports = reports.filter((r) => r.status === "open").length;
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

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-2xl border border-slate-300 p-4 shadow-sm">
          <p className="text-xs text-tertiary font-medium">Revenue</p>
          <p className="text-xl md:text-2xl font-extrabold text-foreground mt-1">{formatIDR(revenue)}</p>
          <p className="text-[11px] text-tertiary mt-1">dari {orders.length} pesanan</p>
        </div>
        <div className="bg-surface rounded-2xl border border-slate-300 p-4 shadow-sm">
          <p className="text-xs text-tertiary font-medium">Pesanan Aktif</p>
          <p className="text-xl md:text-2xl font-extrabold text-foreground mt-1">{activeOrders}</p>
          <Link href="/admin/orders" className="text-[11px] text-accent hover:underline">Kelola →</Link>
        </div>
        <div className="bg-surface rounded-2xl border border-slate-300 p-4 shadow-sm">
          <p className="text-xs text-tertiary font-medium">Quote Pending</p>
          <p className="text-xl md:text-2xl font-extrabold text-foreground mt-1">{pendingQuotes}</p>
          <Link href="/admin/quotes" className="text-[11px] text-accent hover:underline">Review →</Link>
        </div>
        <div className="bg-surface rounded-2xl border border-slate-300 p-4 shadow-sm">
          <p className="text-xs text-tertiary font-medium">Laporan Forum</p>
          <p className="text-xl md:text-2xl font-extrabold text-foreground mt-1">{openReports}</p>
          <Link href="/admin/moderation" className="text-[11px] text-accent hover:underline">Moderasi →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tren Transaksi */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-slate-300 p-5 shadow-sm">
          <h2 className="font-bold text-foreground mb-4">Tren Transaksi (7 hari)</h2>
          <div className="flex items-end gap-2 h-36">
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
        <div className="bg-surface rounded-2xl border border-slate-300 p-5 shadow-sm">
          <h2 className="font-bold text-foreground mb-4">⚠️ Stok Kritis</h2>
          {criticalStock.length === 0 ? (
            <p className="text-sm text-tertiary">Semua stok aman.</p>
          ) : (
            <ul className="space-y-2">
              {criticalStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-foreground">{p.name}</span>
                  <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold ${
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

      {/* Feed Aktivitas Terbaru */}
      <div className="bg-surface rounded-2xl border border-slate-300 p-5 shadow-sm mb-6">
        <h2 className="font-bold text-foreground mb-4">Aktivitas Terbaru</h2>
        {orders.length === 0 && threads.length === 0 ? (
          <p className="text-sm text-tertiary">Belum ada aktivitas.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {[...orders.slice(-5)].reverse().map((o) => (
              <li key={o.id} className="flex items-center gap-2 text-tertiary">
                <span className="text-xs">🛒</span>
                <span>Pesanan <b className="text-foreground">{formatIDR(Number(o.total_amount))}</b></span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  o.status === "delivered" ? "bg-green-100 text-green-700"
                  : o.status === "cancelled" ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
                }`}>{o.status}</span>
                <span className="ml-auto text-[11px]">{(o.created_at ?? "").slice(0, 16).replace("T", " ")}</span>
              </li>
            ))}
            {threads.slice(-3).reverse().map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-tertiary">
                <span className="text-xs">💬</span>
                <span>Thread {t.is_locked ? "dikunci" : "baru"}</span>
                <span className="ml-auto text-[11px]">{(t.created_at ?? "").slice(0, 16).replace("T", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ADMIN_SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="bg-surface border border-slate-300 rounded-2xl p-4 hover:border-accent hover:shadow-md transition group">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="font-semibold text-foreground text-sm group-hover:text-accent">{s.label}</p>
            <p className="text-xs text-tertiary mt-0.5">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
