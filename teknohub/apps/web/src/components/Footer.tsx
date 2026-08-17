import Link from "next/link";
import { ShieldCheck, Truck, Zap, Headphones, CheckCircle2, Lock, Award } from "lucide-react";

const COLS = [
  {
    title: "Belanja",
    links: [
      { href: "/shop/products", label: "Semua Produk" },
      { href: "/shop/products?category=laptop", label: "Laptop Gaming" },
      { href: "/shop/products?category=gpu", label: "VGA / GPU" },
      { href: "/shop/products?category=cpu", label: "Processor" },
      { href: "/shop/products?category=storage", label: "SSD & Storage" },
      { href: "/shop/cart", label: "Keranjang Belanja" },
    ],
  },
  {
    title: "Layanan & AI",
    links: [
      { href: "/builder", label: "PC Builder AI 3D" },
      { href: "/builder/saved", label: "Rakitan Tersimpan" },
      { href: "/forum", label: "Forum Komunitas Tech" },
      { href: "/shop/orders", label: "Lacak Pesanan Realtime" },
      { href: "/forum/new", label: "Konsultasi Hardware" },
    ],
  },
  {
    title: "Bantuan & Legal",
    links: [
      { href: "/terms", label: "Syarat & Ketentuan" },
      { href: "/privacy", label: "Kebijakan Privasi" },
      { href: "/terms", label: "Klaim Garansi & Retur" },
      { href: "/user/profile", label: "Pusat Akun Saya" },
    ],
  },
];

const PAYMENTS = [
  "BCA", "Mandiri", "BNI", "BRI", "Permata", "QRIS", "GoPay", "OVO", "DANA", "ShopeePay", "Visa", "Mastercard"
];

const COURIERS = [
  "JNE Express", "SiCepat", "J&T Express", "Anteraja", "GoSend Instant", "GrabExpress", "Ninja Xpress"
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-surface">
      {/* 4 Keunggulan Utama Belanja */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-surface-2/40 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">100% Garansi Resmi</p>
              <p className="text-[11px] text-tertiary">Distributor resmi Indonesia</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">Bebas Ongkir se-Indonesia</p>
              <p className="text-[11px] text-tertiary">Pengiriman cepat &amp; berasuransi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Zap size={22} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">AI PC Builder Pintar</p>
              <p className="text-[11px] text-tertiary">Rakit PC bebas bottleneck 24/7</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Headphones size={22} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">Customer Service Responsif</p>
              <p className="text-[11px] text-tertiary">Bantuan teknis &amp; konsultasi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Info Brand & Tagline */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span className="w-4 h-4 bg-zone-blue rounded-full shadow-sm" />
              <span>
                <span className="text-accent">Tekno</span>
                <span className="text-zone-blue">Hub</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-tertiary leading-relaxed max-w-sm">
              Platform e-commerce hardware komputer, laptop gaming, dan AI PC Builder terdepan di Indonesia. Menyediakan produk original bergaransi resmi distributor dengan integrasi forum komunitas tech.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted font-bold">
              <Lock size={14} className="text-emerald-500" /> Transaksi Terenkripsi SSL 256-Bit Aman
            </div>
          </div>

          {/* Kolom Navigasi */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-xs sm:text-sm text-tertiary hover:text-accent transition font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mitra Pembayaran & Jasa Pengiriman */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mitra Pembayaran */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
              <Award size={14} className="text-accent" /> Mitra Pembayaran Resmi
            </h4>
            <div className="flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 bg-surface border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-foreground shadow-2xs hover:border-accent transition"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Mitra Pengiriman */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
              <Truck size={14} className="text-accent" /> Mitra Logistik &amp; Pengiriman
            </h4>
            <div className="flex flex-wrap gap-2">
              {COURIERS.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 bg-surface border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-foreground shadow-2xs hover:border-accent transition"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & Legal Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-tertiary text-center sm:text-left">
            © {new Date().getFullYear()} PT TeknoHub Indonesia. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-tertiary">
            <Link href="/terms" className="hover:text-accent transition">Syarat &amp; Ketentuan</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-accent transition">Kebijakan Privasi</Link>
            <span>•</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> Server Operasional 100%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
