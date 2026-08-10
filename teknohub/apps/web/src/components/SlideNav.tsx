"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SLIDE_LINKS = [
  { href: "/#marketplace", label: "Marketplace & Store", anchor: "marketplace" },
  { href: "/#forum-slide", label: "Forum Komunitas", anchor: "forum-slide" },
];

export default function SlideNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-20 z-40 bg-background/90 border-b border-border-soft backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-10 overflow-x-auto no-scrollbar py-3 text-sm font-bold">
        {SLIDE_LINKS.map((l) => {
          const isHome = pathname === "/" || pathname.startsWith("/#");
          const isActive = isHome && l.anchor === "marketplace";
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 pb-1.5 border-b-4 transition ${
                isActive
                  ? "text-accent border-accent"
                  : "text-muted border-transparent hover:text-accent hover:border-slate-500"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
        {/* Tentang TeknoZone — hanya di homepage (anchor #tentang) */}
        {pathname === "/" && (
          <Link
            href="/#tentang"
            className="ml-auto shrink-0 text-sm font-semibold text-muted hover:text-accent transition"
          >
            Tentang TeknoZone
          </Link>
        )}
      </div>
    </div>
  );
}
