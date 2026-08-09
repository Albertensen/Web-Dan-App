"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: "/products", label: "Store" },
  { href: "/forum", label: "Forum Komunitas" },
  { href: "/builder-3d", label: "AI 3D PC Builder" },
];

/** Drawer slide-in dari kiri utk mobile (<768px) — dgn overlay backdrop */
export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { status } = useSession();

  return (
    <>
      {/* Overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-[80vw] bg-surface z-50 md:hidden shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu navigasi"
      >
        {/* Header drawer: logo + close */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-300">
          <Link href="/" onClick={onClose} className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 bg-zone-blue rounded-full" />
            <span>
              <span className="text-accent">Tekno</span>
              <span className="text-zone-blue">Zone</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Tutup menu"
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-foreground hover:text-accent transition"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-slate-100 hover:text-accent transition"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={onClose}
            className="px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-slate-100 hover:text-accent transition"
          >
            🛒 Keranjang
          </Link>
        </nav>

        {/* Footer drawer: auth */}
        <div className="px-4 py-4 border-t border-slate-300 flex flex-col gap-2">
          {status === "authenticated" ? (
            <>
              <Link
                href="/profile"
                onClick={onClose}
                className="bg-accent text-white px-4 py-2.5 rounded-full text-center text-sm font-semibold"
              >
                👤 Profil Saya
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="text-center text-xs text-muted"
              >
                Kelola akun
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="bg-accent text-white px-4 py-2.5 rounded-full text-center text-sm font-semibold"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="bg-surface border border-slate-300 text-foreground px-4 py-2.5 rounded-full text-center text-sm font-semibold"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
