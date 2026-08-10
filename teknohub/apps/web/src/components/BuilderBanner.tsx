import Link from "next/link";

/** Banner promosi AI 3D PC Builder — seluruh area klikable ke /builder */
export default function BuilderBanner() {
  return (
    <section>
      <Link
        href="/builder"
        className="block group relative bg-gradient-to-r from-slate-900 via-accent to-blue-950 text-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-xl border border-slate-700 hover:scale-[1.01] transition duration-300"
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
        <div className="relative z-10 max-w-xl">
          <span className="bg-white/10 text-emerald-400 font-semibold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full uppercase border border-white/10 inline-block mb-4">
            Interactive 3D Technology
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            RAKIT PC MUDAH DENGAN BANTUAN AGENT AI
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
            Simulasikan perakitan komponen PC secara 3D interaktif. AI Agent kami mengecek
            kompatibilitas daya dan mencegah bottleneck secara real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-full transition group-hover:translate-x-1">
              Mulai Merakit Sekarang &rarr;
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
