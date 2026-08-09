const heroCards = [
  {
    icon: "🛒",
    title: "E-Commerce",
    desc: "Belanja elektronik & komponen PC dengan harga kompetitif, lengkap dengan spesifikasi detail.",
    glow: "glow-cyan",
    cta: "Jelajahi Produk",
  },
  {
    icon: "💬",
    title: "Forum Tech & AI",
    desc: "Diskusi hangat seputar teknologi, AI, dan tren terbaru bersama komunitas.",
    glow: "glow-violet",
    cta: "Buka Forum",
  },
  {
    icon: "⚡",
    title: "PC Builder AI",
    desc: "Rakit PC impianmu dengan bantuan AI Agent — rekomendasi build sesuai budget & kebutuhan.",
    glow: "glow-emerald",
    cta: "Mulai Rakit",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-gradient">TeknoHub</span>
          </a>
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Produk</a>
            <a href="#" className="hover:text-white transition-colors">Forum</a>
            <a href="#" className="hover:text-white transition-colors">PC Builder</a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Masuk
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-6">
            Platform Teknologi All-in-One Indonesia
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Semua Kebutuhan Teknologi,
            <br />
            <span className="text-gradient">Satu Platform.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Belanja elektronik, diskusi tech & AI, hingga merakit PC dengan
            bantuan AI Agent — semua di TeknoHub.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:opacity-90 transition-opacity"
            >
              Mulai Sekarang
            </a>
            <a
              href="#"
              className="px-8 py-3 rounded-xl border border-white/15 font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Lihat Demo
            </a>
          </div>
        </div>
      </section>

      {/* 3 Hero Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {heroCards.map((card) => (
            <div key={card.title} className={`glow-card p-8 ${card.glow}`}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <h2 className="text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {card.desc}
              </p>
              <a
                href="#"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                {card.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 TeknoHub. Dibuat dengan ❤️ di Indonesia.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Tentang</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Kontak</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
