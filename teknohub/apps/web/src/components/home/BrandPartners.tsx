"use client";

import Link from "next/link";
import { ShieldCheck, Award } from "lucide-react";

const BRANDS = [
  { name: "ASUS ROG", query: "asus", color: "from-red-600 to-rose-700" },
  { name: "NVIDIA", query: "nvidia", color: "from-emerald-600 to-green-700" },
  { name: "Intel", query: "intel", color: "from-blue-600 to-cyan-700" },
  { name: "AMD", query: "amd", color: "from-orange-600 to-red-700" },
  { name: "Lenovo Legion", query: "lenovo", color: "from-cyan-600 to-blue-700" },
  { name: "MSI Gaming", query: "msi", color: "from-rose-600 to-red-800" },
  { name: "Corsair", query: "corsair", color: "from-yellow-600 to-amber-700" },
  { name: "Kingston", query: "kingston", color: "from-red-700 to-slate-800" },
  { name: "Samsung", query: "samsung", color: "from-blue-700 to-indigo-900" },
  { name: "Acer Predator", query: "acer", color: "from-teal-600 to-emerald-800" },
];

export default function BrandPartners() {
  return (
    <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award size={20} className="text-accent" />
            <h3 className="text-lg sm:text-xl font-black text-foreground">Official Authorized Brand Partners</h3>
          </div>
          <p className="text-xs text-tertiary mt-0.5">Produk didistribusikan langsung oleh distributor resmi bergaransi Indonesia.</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
          <ShieldCheck size={13} /> 100% Original Guarantee
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {BRANDS.map((b) => (
          <Link
            key={b.name}
            href={`/shop/products?brands=${encodeURIComponent(b.query)}`}
            className="group flex items-center justify-center p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface-2/60 hover:border-accent hover:shadow-md transition text-center"
          >
            <span className="text-xs sm:text-sm font-black text-foreground group-hover:text-accent transition tracking-tight">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
