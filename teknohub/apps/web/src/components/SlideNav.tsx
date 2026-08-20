"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Bot, MessageSquare, Zap } from "lucide-react";

const NAV_LINKS = [
  { href: "/shop/products", label: "Semua Produk", icon: ShoppingBag },
  { href: "/shop/products?type=digital", label: "Produk Digital", icon: Zap },
  { href: "/builder", label: "PC Builder AI", icon: Bot },
  { href: "/forum", label: "Forum Komunitas", icon: MessageSquare },
];

export default function SlideNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi cepat" className="border-b border-[#CBD5E1] bg-white sticky top-[65px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2.5">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/shop/products" ? pathname === "/shop/products" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  active
                    ? "bg-[#1D4ED8] text-white shadow-sm shadow-accent/20"
                    : "text-[#475569] hover:text-[#0F2A4A] hover:bg-[#F1F5F9]"
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
