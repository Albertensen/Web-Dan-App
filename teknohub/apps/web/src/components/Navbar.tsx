"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Menu, X } from "lucide-react";
import NavbarSearch from "./NavbarSearch";
import MobileDrawer from "./MobileDrawer";
import { useCartStore, selectTotalItems } from "@/store/cartStore";
import UserDropdown from "./auth/UserDropdown";
import NotificationBell from "./forum/NotificationBell";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { status } = useSession();
  const cartCount = useCartStore(selectTotalItems);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border-soft transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo 2 warna + tagline */}
          <div className="flex flex-col shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-zone-blue rounded-full shrink-0 shadow-sm" />
              <span>
                <span className="text-accent">Tekno</span>
                <span className="text-zone-blue">Hub</span>
              </span>
            </Link>
            <span className="hidden md:block text-[10px] font-bold text-muted tracking-wide mt-0.5">
              Pusat Hardware &amp; AI Builder Terpercaya
            </span>
          </div>

          {/* Desktop Search Bar */}
          <NavbarSearch className="hidden md:block max-w-lg" />

          {/* Area Kanan: Mobile Search Toggle + Notif + Cart + Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Button Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-surface-2 border border-slate-300 flex items-center justify-center text-muted hover:text-accent transition"
              aria-label="Toggle Pencarian"
            >
              <Search size={18} />
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Cart SVG */}
            <Link
              href="/shop/cart"
              className="w-9 h-9 rounded-full bg-surface border border-slate-300 flex items-center justify-center text-accent hover:border-accent hover:shadow transition relative"
              title="Keranjang Belanja"
            >
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M2.5 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22.5 7H6.1" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button Desktop */}
            {status === "loading" ? (
              <div className="hidden md:flex items-center gap-2" aria-hidden="true">
                <div className="w-[64px] h-[32px] rounded-full animate-pulse bg-slate-200" />
                <div className="w-[64px] h-[32px] rounded-full animate-pulse bg-slate-200" />
              </div>
            ) : status === "authenticated" ? (
              <div className="hidden md:block">
                <UserDropdown />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="bg-surface border border-slate-300 hover:border-accent text-foreground px-4 py-2 rounded-full text-xs font-bold transition shadow-sm"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-accent hover:bg-accent-secondary text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md shadow-accent/20"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Hamburger Button Mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground hover:text-accent transition w-9 h-9 flex items-center justify-center rounded-full bg-surface-2 border border-slate-300"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-200/60 bg-surface/95">
            <NavbarSearch className="block w-full" />
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
