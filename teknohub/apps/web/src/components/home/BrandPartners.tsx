"use client";

import Link from "next/link";
import { ShieldCheck, Award } from "lucide-react";

const BRANDS = [
  { name: "ASUS ROG", query: "asus" },
  { name: "NVIDIA GeForce", query: "nvidia" },
  { name: "Intel Core", query: "intel" },
  { name: "AMD Ryzen", query: "amd" },
  { name: "Lenovo Legion", query: "lenovo" },
  { name: "MSI Gaming", query: "msi" },
  { name: "Corsair", query: "corsair" },
  { name: "Kingston FURY", query: "kingston" },
  { name: "Samsung SSD", query: "samsung" },
  { name: "Acer Predator", query: "acer" },
];

export default function BrandPartners() {
  return (
    <section className="bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
            <Award size={20} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Official Authorized Brand Partners
            </h3>
            <p className="text-xs text-tertiary">Distributor resmi hardware &amp; software bergaransi Indonesia.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
          <ShieldCheck size={13} /> 100% Original Guaranteed
        </span>
      </div>

      {/* Grid 10 Brand Utuh Tanpa Terpotong */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {BRANDS.map((b) => (
          <Link
            key={b.name}
            href={`/shop/products?brands=${encodeURIComponent(b.query)}`}
            className="group p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface-2/40 hover:border-accent hover:bg-surface-2 hover:shadow-md transition text-center flex items-center justify-center cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-black text-foreground group-hover:text-accent transition">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
