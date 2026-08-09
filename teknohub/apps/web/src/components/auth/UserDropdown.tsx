"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!session?.user) return null;
  const name = session.user.name ?? session.user.email?.split("@")[0] ?? "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-surface transition"
        aria-label="Menu akun"
        aria-expanded={open}
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={name}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
            {initial}
          </span>
        )}
        <span className="hidden sm:block text-sm font-semibold max-w-[8rem] truncate">
          {name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-surface-2 border border-border rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-bold truncate">{name}</p>
            <p className="text-[11px] text-muted truncate">{session.user.email}</p>
          </div>
          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-surface transition"
            >
              👤 Profil Saya
            </Link>
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-surface transition"
            >
              📦 Pesanan
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-surface transition"
            >
              🛒 Keranjang
            </Link>
          </div>
          <div className="border-t border-border py-1.5">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface transition"
            >
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
