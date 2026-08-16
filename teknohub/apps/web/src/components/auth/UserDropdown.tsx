"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
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
  const role = session.user.role ?? "member";

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("") || name.charAt(0).toUpperCase();

  const roleBadge = role === "admin" ? "Admin" : role === "marketplace" ? "Staff Toko" : role === "moderator" ? "Moderator" : null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-surface transition"
        aria-label="Menu akun"
        aria-expanded={open}
      >
        {imgError ? (
          <span className="w-8 h-8 shrink-0 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold tracking-wide">
            {initials}
          </span>
        ) : session.user.image ? (
          <span className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-border">
            <Image
              src={session.user.image}
              alt={name}
              width={32}
              height={32}
              sizes="32px"
              onError={() => setImgError(true)}
              className="w-full h-full rounded-full object-cover"
            />
          </span>
        ) : (
          <span className="w-8 h-8 shrink-0 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold tracking-wide">
            {initials}
          </span>
        )}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-semibold max-w-[8rem] truncate leading-tight">
            {name}
          </span>
          {roleBadge && (
            <span className="text-[10px] font-bold text-accent tracking-wide uppercase">
              {roleBadge}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface-2 border border-border rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border bg-surface">
            <p className="text-sm font-bold truncate">{name}</p>
            <p className="text-[11px] text-muted truncate">{session.user.email}</p>
            {roleBadge && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent-dim text-accent uppercase">
                {roleBadge}
              </span>
            )}
          </div>

          <div className="py-1.5">
            {/* Link Portal Toko / Admin untuk semua user login */}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-accent-dim/60 text-accent hover:bg-accent hover:text-white transition"
            >
              <span>⚙️</span> Portal {role === "admin" ? "Admin" : "Toko & Pesanan"}
            </Link>

            <Link
              href="/user/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-surface transition"
            >
              👤 Profil Saya
            </Link>
            <Link
              href="/shop/orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-surface transition"
            >
              📦 Pesanan Saya
            </Link>
            <Link
              href="/shop/cart"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-surface transition"
            >
              🛒 Keranjang Belanja
            </Link>
          </div>

          <div className="border-t border-border py-1.5">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-surface transition"
            >
              🚪 Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
