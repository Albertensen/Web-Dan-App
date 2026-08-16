"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { AdminRole } from "@/lib/admin-auth";
import { Tag, Package, Star, Puzzle, ClipboardList, ShieldCheck, Users, LayoutDashboard } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  adminOnly?: boolean;
}

const ALL_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard Toko", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pesanan", icon: Package },
  { href: "/admin/products", label: "Katalog Produk", icon: Tag },
  { href: "/admin/reviews", label: "Ulasan Pembeli", icon: Star },
  // Khusus Super Admin
  { href: "/admin/components", label: "Komponen PC", icon: Puzzle, adminOnly: true },
  { href: "/admin/quotes", label: "Penawaran Rakit", icon: ClipboardList, adminOnly: true },
  { href: "/admin/moderation", label: "Moderasi Forum", icon: ShieldCheck, adminOnly: true },
  { href: "/admin/users", label: "Pengguna & Role", icon: Users, adminOnly: true },
];

export default function AdminSidebar({ userRole }: { userRole?: AdminRole }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const nav = ALL_NAV.filter((item) => {
    if (item.adminOnly) {
      return userRole === "admin";
    }
    return true;
  });

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex shrink-0 border-r border-slate-300 bg-surface flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b border-slate-300">
          <Link href="/admin" className={`font-extrabold tracking-tight flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
            <span className="w-3 h-3 bg-zone-blue rounded-full" />
            {!collapsed && (
              <span className="truncate">
                <span className="text-accent">Tekno</span>
                <span className="text-zone-blue">Zone</span>
                <span className="text-[10px] block font-semibold text-tertiary">
                  {userRole === "admin" ? "SUPER ADMIN" : "PORTAL TOKO"}
                </span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 mx-2 my-0.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-accent text-white"
                    : "text-muted hover:bg-surface-2 hover:text-accent"
                }`}
              >
                <span className="shrink-0 flex"><item.icon size={18} /></span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-300">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted hover:bg-surface-2 hover:text-accent transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {collapsed ? "»" : "« Kolaps"}
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-surface border-b border-slate-300 px-3 py-2 overflow-x-auto flex items-center gap-1.5 shrink-0">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
                active ? "bg-accent text-white" : "bg-surface-2 text-muted border border-slate-300"
              }`}
            >
              <span className="flex"><item.icon size={18} /></span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
