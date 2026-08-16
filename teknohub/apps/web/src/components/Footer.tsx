import Link from "next/link";
import { ShieldCheck, Truck, Zap } from "lucide-react";

const COLS = [
  {
    title: "Belanja",
    links: [
      { href: "/shop/products", label: "Semua Produk" },
      { href: "/shop/products?category=laptop", label: "Laptop" },
      { href: "/shop/products?category=gpu", label: "VGA / GPU" },
      { href: "/shop/products?category=cpu", label: "Processor" },
      { href: "/shop/cart", label: "Keranjang" },
    ],
  },
  {
    title: "Layanan",
    links: [
      { href: "/builder", label: "PC Builder AI" },
      { href: "/builder/saved", label: "Rakitan Tersimpan" },
      { href: "/forum", label: "Forum Komunitas" },
      { href: "/shop/orders", label: "Lacak Pesanan" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { href: "/terms", label: "Syarat & Ketentuan" },
      { href: "/privacy", label: "Kebijakan Privasi" },
      { href: "/user/profile", label: "Akun Saya" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="text-xl font-black tracking-tight flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-zone-blue rounded-full" />
              <span>
                <span className="text-accent">Tekno</span>
                <span className="text-zone-blue">Hub</span>
              </span>
            </Link>
            <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed max-w-xs">
              Pusat hardware & AI builder terpercaya. Komponen PC, laptop, dan periferal bergaransi resmi.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-tertiary">
              <span className="px-2.5 py-1 rounded-full border border-border bg-background flex items-center gap-1"><ShieldCheck size={12} /> Garansi Resmi</span>
              <span className="px-2.5 py-1 rounded-full border border-border bg-background flex items-center gap-1"><Truck size={12} /> Bebas Ongkir</span>
              <span className="px-2.5 py-1 rounded-full border border-border bg-background flex items-center gap-1"><Zap size={12} /> Support 24/7</span>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-xs sm:text-sm text-muted hover:text-accent transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges — metode pembayaran & jasa pengiriman */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border pt-6">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">Metode Pembayaran</h3>
            <div className="flex flex-wrap items-center gap-2">
              {["QRIS","BCA","Mandiri","BNI","GoPay","OVO","DANA"].map((b) => (
                <span key={b} className="h-8 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">Jasa Pengiriman</h3>
            <div className="flex flex-wrap items-center gap-2">
              {["JNE","SiCepat","GoSend"].map((b) => (
                <span key={b} className="h-8 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-tertiary">
            © {new Date().getFullYear()} TeknoHub. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link href="/terms" className="text-[11px] text-tertiary hover:text-accent transition">
              Syarat &amp; Ketentuan
            </Link>
            <span className="text-tertiary">•</span>
            <Link href="/privacy" className="text-[11px] text-tertiary hover:text-accent transition">
              Kebijakan Privasi
            </Link>
            <span className="text-tertiary">•</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Operasional 100% Aktif
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
