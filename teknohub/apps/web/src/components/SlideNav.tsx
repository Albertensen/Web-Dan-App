"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SLIDE_LINKS = [
  { href: "/#marketplace", label: "Marketplace & Store", active: "/" },
  { href: "/#forum-slide", label: "Forum Komunitas & Reputasi (Slide Disini ➔)", active: "/" },
  { href: "/builder-3d", label: "AI 3D PC Builder (Halaman Terpisah)", active: "/builder-3d" },
];

export default function SlideNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-40 bg-background/95 border-b border-slate-400/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 overflow-x-auto no-scrollbar py-3 text-sm font-semibold">
        {SLIDE_LINKS.map((l) => {
          const isActive =
            l.active === "/" ? pathname === "/" || pathname.startsWith("/#") : pathname.startsWith(l.active);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 pb-1 transition ${
                isActive ? "text-accent border-b-2 border-accent" : "text-muted hover:text-accent"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
