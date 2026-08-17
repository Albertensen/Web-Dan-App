"use client";

import Link from "next/link";
import { Zap, Truck, ShieldCheck, HelpCircle, Package } from "lucide-react";

export default function TopAnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-accent via-slate-900 to-accent text-white text-[11px] font-semibold py-1.5 px-4 sm:px-6 border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Ticker Promo Kiri */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-yellow-300 font-extrabold">
            <Zap size={13} className="fill-yellow-300" /> PROMO SPESIAL:
          </span>
          <span className="text-slate-200">
            Gunakan Kupon <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold text-white">TEKNOHUB10</span> Diskon 10%
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-200">
            <Truck size={13} className="text-cyan-300" /> Bebas Ongkir se-Indonesia
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:flex items-center gap-1 text-slate-200">
            <ShieldCheck size={13} className="text-emerald-300" /> 100% Garansi Resmi Distributor
          </span>
        </div>

        {/* Tautan Bantuan Kanan */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 text-slate-300">
          <Link href="/shop/orders" className="hover:text-white transition flex items-center gap-1">
            <Package size={12} /> Lacak Pesanan
          </Link>
          <span className="text-white/30">|</span>
          <Link href="/terms" className="hover:text-white transition flex items-center gap-1">
            <HelpCircle size={12} /> Bantuan &amp; Garansi
          </Link>
        </div>
      </div>
    </div>
  );
}
