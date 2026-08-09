"use client";

import Link from "next/link";
import { useState } from "react";
import NavbarSearch from "./NavbarSearch";
import NotificationBell from "./forum/NotificationBell";
import { useCartStore, selectTotalItems } from "@/store/cartStore";

const NAV_LINKS = [
  { href: "/products", label: "Store" },
  { href: "/forum", label: "Forum Komunitas" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore(selectTotalItems);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-slate-400/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* Logo 2 warna + tagline di bawahnya */}
        <div className="flex flex-col shrink-0">
          <Link href="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 bg-zone-blue rounded-full" />
            <span>
              <span className="text-accent">Tekno</span>
              <span className="text-zone-blue">Zone</span>
            </span>
          </Link>
          <span className="text-[10px] font-semibold text-muted tracking-wide mt-0.5">
            Pusat Hardware &amp; Komunitas Terpercaya
          </span>
        </div>

        <NavbarSearch />

        {/* Area kanan: cart + auth */}
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Cart SVG */}
            <Link
              href="/cart"
              className="w-9 h-9 rounded-full bg-surface border border-slate-300 flex items-center justify-center text-accent hover:border-accent transition shadow-sm relative"
              title="Keranjang Belanja"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 2.354l6 6c.63.63 1.707.184 1.707-.707V13H7z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Masuk */}
            <Link
              href="/login"
              className="bg-surface border border-slate-300 hover:border-accent text-foreground px-4 py-1.5 rounded-full text-xs font-semibold transition shadow-sm"
            >
              Masuk
            </Link>
            {/* Daftar */}
            <Link
              href="/register"
              className="bg-accent hover:bg-accent-secondary text-white px-4 py-1.5 rounded-full text-xs font-semibold transition shadow-sm"
            >
              Daftar
            </Link>
            <NotificationBell />

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground hover:text-accent transition"
              aria-label="Menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden backdrop-blur-xl bg-background/90 border-t border-slate-400/50 px-6 py-4 flex flex-col gap-3 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-muted hover:text-accent transition"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/builder-3d"
            onClick={() => setMobileOpen(false)}
            className="text-muted hover:text-accent transition"
          >
            AI 3D PC Builder
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="bg-accent text-white px-4 py-2 rounded-full text-center text-xs font-medium"
          >
            Masuk
          </Link>
        </div>
      )}
    </header>
  );
}
