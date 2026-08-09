"use client";

import Link from "next/link";
import { useState } from "react";
import NavbarSearch from "./NavbarSearch";
import NotificationBell from "./forum/NotificationBell";
import { useCartStore, selectTotalItems } from "@/store/cartStore";

const NAV_LINKS = [
  { href: "/products", label: "Store" },
  { href: "/builder", label: "AI PC Builder" },
  { href: "/forum", label: "Forum Komunitas" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore(selectTotalItems);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-accent rounded-full" />
          Tekno Zone
        </Link>

        <NavbarSearch />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent transition">
              {l.label}
            </Link>
          ))}
          <Link href="/builder/saved" className="hover:text-accent transition">
            Build Saya
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-foreground hover:text-accent transition" aria-label="Keranjang">
            <span className="text-lg">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <NotificationBell />
          <Link
            href="/login"
            className="hidden sm:inline-block bg-foreground hover:bg-accent text-white px-4 py-2 rounded-full text-xs font-medium transition shadow-sm"
          >
            Masuk
          </Link>

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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden backdrop-blur-xl bg-background/90 border-t border-border/50 px-8 py-4 flex flex-col gap-3 text-sm">
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
            href="/builder/saved"
            onClick={() => setMobileOpen(false)}
            className="text-muted hover:text-accent transition"
          >
            Build Saya
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
