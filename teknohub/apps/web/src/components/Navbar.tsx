"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import NavbarSearch from "./NavbarSearch";
import MobileDrawer from "./MobileDrawer";
import { useCartStore, selectTotalItems } from "@/store/cartStore";
import UserDropdown from "./auth/UserDropdown";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status } = useSession();
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

        {/* Area kanan: cart + auth (auth hidden di mobile — di drawer) */}
        <div className="flex items-center gap-2.5 shrink-0">
            {/* PC Builder — desktop nav */}
            <Link
              href="/builder"
              className="hidden md:block text-foreground hover:text-accent transition text-sm font-semibold"
            >
              PC Builder AI
            </Link>
            {/* Cart SVG — ikon lebih rapi */}
            <Link
              href="/cart"
              className="w-9 h-9 rounded-full bg-surface border border-slate-300 flex items-center justify-center text-accent hover:border-accent transition shadow-sm relative"
              title="Keranjang Belanja"
            >
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M2.5 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22.5 7H6.1" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth: skeleton saat loading (FIX BUG 1 — cegah FOUC) */}
            {status === "loading" ? (
              <div className="hidden md:block w-40 h-9 rounded-full animate-pulse bg-slate-200" />
            ) : status === "authenticated" ? (
              <div className="hidden md:block">
                <UserDropdown />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2.5">
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
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground hover:text-accent transition w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200/60"
              aria-label="Menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
        </div>
      </div>

      {/* Mobile drawer (slide-in) */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}