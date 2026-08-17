"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Bot, MessageSquare, Zap, Truck } from "lucide-react";

const NAV_LINKS: { href: string; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> }[] = [
  { href: "/shop/products", label: "Semua Produk", icon: ShoppingBag },
  { href: "/shop/products?type=digital", label: "Produk Digital", icon: Zap },
  { href: "/builder", label: "PC Builder AI", icon: Bot },
  { href: "/forum", label: "Forum Komunitas", icon: MessageSquare },
];

export default function SlideNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 sm:top-20 z-40 bg-surface/95 backdrop-blur border-b border-border-soft shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar py-2.5 text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          {NAV_LINKS.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`pb-1 border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? "text-accent border-accent font-extrabold"
                    : "text-muted border-transparent hover:text-accent hover:border-slate-400"
                }`}
              >
                {l.icon && <l.icon size={16} className="inline-block mr-1.5 -mt-0.5" />}
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Info Layanan Cepat Desktop */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-tertiary shrink-0">
          <span className="flex items-center gap-1.5"><Zap size={14} /> Garansi Resmi 100%</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Truck size={14} /> Bebas Ongkir</span>
        </div>
      </div>
    </div>
  );
}
