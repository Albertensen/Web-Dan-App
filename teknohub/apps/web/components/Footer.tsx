export default function Footer() {
  return (
    <footer className="bg-dark text-slate-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p>© 2026 TeknoHub — Komunitas Teknologi Indonesia</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Tentang
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Kontak
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Kebijakan Privasi
          </a>
        </div>
      </div>
    </footer>
  );
}
