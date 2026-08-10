"use client";

/**
 * Hero 3D ambience untuk PC Builder — pure CSS, tanpa library.
 * Neon grid perspektif + particle field + floating spec bars.
 */

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 53) % 100}%`,
  delay: `${(i * 0.7) % 5}s`,
  duration: `${6 + (i % 5)}s`,
}));

const SPEC_BARS = [
  { label: "CPU Performance", value: 85, target: "85%" },
  { label: "GPU Power", value: 92, target: "92%" },
  { label: "RAM Utilization", value: 68, target: "68%" },
];

export default function BuilderHero3D() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-700 bg-slate-950 text-white">
      {/* Neon grid perspektif */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,200,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          transform: "perspective(600px) rotateX(30deg) scale(1.6)",
          transformOrigin: "center top",
        }}
      />

      {/* Particle field */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: "60%",
            width: 3,
            height: 3,
            background: "var(--color-accent, #2563eb)",
            opacity: 0.4,
            animation: `particleFloat ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Konten hero */}
      <div className="relative z-10 px-6 py-10 md:px-10 md:py-12">
        <span className="text-[11px] uppercase font-semibold text-cyan-300 tracking-widest">
          AI 3D PC Builder
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
          Rakit PC Impianmu
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-lg">
          AI Agent kami menganalisis kompatibilitas &amp; harga real-time — anti bottleneck, anti overbudget.
        </p>

        {/* Floating spec bars */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
          {SPEC_BARS.map((b) => (
            <div
              key={b.label}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                <span className="text-slate-300">{b.label}</span>
                <span className="text-cyan-300">{b.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: 0,
                    background: "linear-gradient(90deg, var(--color-accent, #2563eb), #00ffff)",
                    animation: "barFill 1.5s ease-out forwards",
                    ["--target-width" as string]: b.target,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}