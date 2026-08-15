"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Drawer slide-in dari kiri utk mobile (<768px) — dgn overlay backdrop */
export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { data: session, status } = useSession();

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
        className={`fixed top-0 left-0 h-full w-72 max-w-[80vw] bg-surface z-50 md:hidden shadow-2xl transition-transform duration-300 ease-out flex flex-col overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu navigasi"
      >
        {/* Header drawer: logo + close */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-300 shrink-0">
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

        {/* Footer drawer: auth — loading state + layout vertikal rapi */}
        <div className="px-4 py-4 border-t border-slate-300 flex flex-col justify-center gap-2.5 flex-1">
          {status === "loading" ? (
            <div className="h-10 rounded-full animate-pulse bg-slate-200" />
          ) : status === "authenticated" ? (
            <>
              <div className="flex items-center gap-3 px-2 py-1.5">
                <span className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session?.user?.image ?? "/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {session?.user?.name}
                </span>
              </div>
              <Link
                href="/user/profile"
                onClick={onClose}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-100 hover:text-accent transition"
              >
                👤 Profil Saya
              </Link>
              <Link
                href="/shop/orders"
                onClick={onClose}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-100 hover:text-accent transition"
              >
                📦 Pesanan
              </Link>
              <button
                onClick={() => signOut()}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition text-left"
              >
                🚪 Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="w-full text-center py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-foreground hover:border-accent transition"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full text-center py-2.5 rounded-full bg-accent hover:bg-accent-secondary text-white text-sm font-semibold transition"
              >
                Daftar Gratis
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}