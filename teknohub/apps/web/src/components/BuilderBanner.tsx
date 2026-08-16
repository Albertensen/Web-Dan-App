import Link from "next/link";

/** Hero banner AI PC Builder — seluruh area klikable ke /builder */
export default function BuilderBanner() {
  return (
    <section>
      <Link
        href="/builder"
        className="block group relative bg-gradient-to-br from-accent via-accent-secondary to-zone-blue text-white rounded-3xl p-8 md:p-14 overflow-hidden shadow-xl hover:shadow-2xl transition duration-300"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-zone-blue/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-300 font-bold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full uppercase border border-white/15 mb-5">
            ⚡ AI PC Builder 3D
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
            Rakit PC Impian dengan Bantuan AI
          </h2>
          <p className="text-slate-200 text-xs md:text-sm leading-relaxed mb-7 max-w-md">
            Simulasi perakitan 3D interaktif. AI mengecek kompatibilitas komponen dan
            mencegah bottleneck secara real-time.
          </p>
          <span className="inline-flex items-center gap-2 bg-white text-accent font-extrabold text-xs px-6 py-3.5 rounded-full shadow-lg group-hover:gap-3 transition-all">
            Mulai Merakit Sekarang →
          </span>
        </div>
      </Link>
    </section>
  );
}
