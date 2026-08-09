"use client";

import Link from "next/link";
import { useState } from "react";
import NavbarSearch from "./NavbarSearch";
import NotificationBell from "./forum/NotificationBell";
import { useCartStore, selectTotalItems } from "@/store/cartStore";

const NAV_LINKS = [
  { href: "/products", label: "Toko" },
  { href: "/forum", label: "Forum" },
  { href: "/builder", label: "PC Builder" },
  { href: "/builder/compare", label: "Bandingkan" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore(selectTotalItems);

  return (
    <header className="sticky top-0 z-50 glass-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-medium text-xl gradient-text whitespace-nowrap"
        >
          TeknoHub
        </Link>

        <NavbarSearch />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm whitespace-nowrap">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted hover:text-white transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/builder/saved"
            className="text-muted hover:text-white transition-colors"
          >
            Build Saya
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/cart" className="relative text-muted hover:text-white transition-colors" aria-label="Keranjang">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-black text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <NotificationBell />
          <Link
            href="/login"
            className="hidden sm:inline-block px-5 py-2 rounded-full bg-accent text-black text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Masuk
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-muted hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden glass-surface border-t border-border px-6 py-4 flex flex-col gap-3 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-muted hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/builder/saved"
            onClick={() => setMobileOpen(false)}
            className="text-muted hover:text-white transition-colors"
          >
            Build Saya
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="px-5 py-2 rounded-full bg-accent text-black text-center font-medium"
          >
            Masuk
          </Link>
        </div>
      )}
    </header>
  );
}
