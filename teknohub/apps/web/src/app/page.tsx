const features = [
  {
    icon: "🛒",
    title: "E-Commerce",
    desc: "Belanja elektronik & komponen PC dengan harga kompetitif, lengkap dengan spesifikasi detail.",
    cta: "Jelajahi Produk",
    href: "/products",
  },
  {
    icon: "💬",
    title: "Forum Tech & AI",
    desc: "Diskusi hangat seputar teknologi, AI, dan tren terbaru bersama komunitas.",
    cta: "Buka Forum",
    href: "/forum",
  },
  {
    icon: "⚡",
    title: "PC Builder AI",
    desc: "Rakit PC impianmu dengan bantuan AI Agent — rekomendasi build sesuai budget & kebutuhan.",
    cta: "Mulai Rakit",
    href: "/builder",
  },
];

const stats = [
  { value: "34+", label: "Komponen PC" },
  { value: "24/7", label: "AI Support" },
  { value: "100%", label: "Garansi Resmi" },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* ================= HERO — monumental ================= */}
      <section className="relative overflow-hidden">
        {/* Animated background mesh */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-accent-dim" />
          <div className="absolute top-1/3 right-1/5 w-[420px] h-[420px] rounded-full blur-3xl bg-surface-2 opacity-60" />
          <div className="absolute bottom-0 left-1/2 w-[380px] h-[380px] rounded-full blur-3xl bg-accent-dim opacity-50" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 text-center">
          <span
            className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-accent bg-accent-dim border border-accent/20 px-4 py-1.5 rounded-full mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Platform Teknologi All-in-One Indonesia
          </span>

          <h1
            className="font-display font-extralight text-5xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-wide animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Semua Kebutuhan Teknologi,
            <br />
            <span className="gradient-text">Satu Platform.</span>
          </h1>

          <p
            className="mt-8 text-lg text-muted max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            Belanja elektronik, diskusi tech &amp; AI, hingga merakit PC dengan
            bantuan AI Agent — semua di TeknoHub.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <a
              href="/products"
              className="px-8 py-3.5 rounded-full bg-accent text-black font-medium hover:opacity-90 transition-opacity shadow-glow-md"
            >
              Mulai Sekarang
            </a>
            <a
              href="/forum"
              className="px-8 py-3.5 rounded-full border-2 border-white/20 text-white font-medium hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Lihat Demo
            </a>
          </div>
        </div>
      </section>

      {/* ================= FEATURE CARDS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((card, i) => (
            <div
              key={card.title}
              className="glow-card p-8 animate-card-lift"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h2 className="text-xl font-medium mb-2">{card.title}</h2>
              <p className="text-muted text-sm leading-relaxed mb-6">{card.desc}</p>
              <a
                href={card.href}
                className="text-sm font-medium text-accent hover:text-accent-secondary transition-colors"
              >
                {card.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="glass-surface rounded-2xl px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-extralight text-4xl sm:text-5xl gradient-text">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA BOTTOM ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="glow-card p-12 sm:p-16 text-center animate-glow-pulse">
          <h2 className="font-display font-extralight text-3xl sm:text-5xl leading-tight">
            Siap Rakit PC Impianmu?
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            Gabung sekarang — dapatkan rekomendasi build AI, harga real-time, dan
            jasa rakit bergaransi resmi.
          </p>
          <a
            href="/builder"
            className="mt-8 inline-block px-10 py-4 rounded-full bg-accent text-black font-medium hover:opacity-90 transition-opacity shadow-glow-lg"
          >
            Daftar Sekarang
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-link-cool">
          <div className="flex items-center gap-2">
            <span className="font-display font-medium gradient-text">TeknoHub</span>
          </div>
          <p>© 2026 TeknoHub. Dibuat dengan ❤️ di Indonesia.</p>
          <div className="flex gap-6">
            <a href="/products" className="hover:text-white transition-colors">Toko</a>
            <a href="/forum" className="hover:text-white transition-colors">Forum</a>
            <a href="/builder" className="hover:text-white transition-colors">Builder</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
