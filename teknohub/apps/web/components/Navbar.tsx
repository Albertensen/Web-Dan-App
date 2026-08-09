import Link from "next/link";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
  { href: "/forum", label: "Forum" },
  { href: "/pc-builds", label: "Rakitan PC" },
];

export default function Navbar() {
  return (
    <header className="bg-dark text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Tekno<span className="text-primary">Hub</span>
        </Link>
        <ul className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/login"
              className="bg-primary px-4 py-2 rounded-lg text-white hover:bg-blue-600 transition-colors"
            >
              Masuk
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="border border-white/30 px-4 py-2 rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              Daftar
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
