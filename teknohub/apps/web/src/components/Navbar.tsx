import Link from "next/link";
import NavbarSearch from "./NavbarSearch";
import NotificationBell from "./forum/NotificationBell";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent whitespace-nowrap">
          TeknoHub
        </Link>

        <NavbarSearch />

        <nav className="flex items-center gap-4 text-sm whitespace-nowrap">
          <Link href="/products" className="text-slate-300 hover:text-blue-400 transition">
            Produk
          </Link>
          <Link href="/forum" className="text-slate-300 hover:text-blue-400 transition">
            Forum
          </Link>
          <Link href="/builder" className="text-slate-300 hover:text-blue-400 transition">
            Builder
          </Link>
          <Link href="/builder/compare" className="text-slate-300 hover:text-blue-400 transition">
            Bandingkan
          </Link>
          <Link href="/builder/saved" className="text-slate-300 hover:text-blue-400 transition">
            Build Saya
          </Link>
          <Link href="/cart" className="text-slate-300 hover:text-blue-400 transition">
            🛒
          </Link>
          <NotificationBell />
          <Link href="/login" className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity">
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}
