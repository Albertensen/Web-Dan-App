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
    <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-2 shrink-0">
        <Award size={18} className="text-accent" />
        <span className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
          Official Brand Partners
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck size={11} /> 100% Original
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
        {BRANDS.map((b) => (
          <Link
            key={b.name}
            href={`/shop/products?brands=${encodeURIComponent(b.query)}`}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-surface-2/60 text-xs font-bold text-muted hover:text-accent hover:border-accent whitespace-nowrap transition"
          >
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
