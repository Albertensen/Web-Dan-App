import Link from "next/link";
import { Monitor } from "lucide-react";

export const metadata = {
  title: "AI 3D PC Builder — TeknoHub",
  description:
    "Visualisasi 3D exploded view komponen PC: rakit, periksa kompatibilitas daya, dan cegah bottleneck.",
};

export default function Builder3DPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-[11px] uppercase font-semibold text-accent tracking-widest block mb-3">
          AI 3D PC Builder — Coming Soon
        </span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Rakit PC dalam 3D <span className="text-accent">Exploded View</span>
        </h1>
        <p className="text-sm text-muted leading-relaxed mb-8">
          Halaman ini disiapkan untuk animasi 3D komponen PC yang terpecah-pecah (exploded view) —
          lihat setiap komponen (CPU, GPU, RAM, PSU, pendingin) terpisah dari casing, periksa
          kompatibilitas daya, dan cegah bottleneck secara visual.
        </p>

        <div className="bg-surface border border-border rounded-3xl p-10 shadow-sm mb-8">
          <div className="w-40 h-40 mx-auto mb-6 rounded-3xl bg-surface-2 flex items-center justify-center text-5xl">
            <Monitor size={16} className="inline mr-1" />
          </div>
          <p className="text-xs text-tertiary">
            Visualisasi 3D (Three.js / React Three Fiber) akan ditambahkan di sini.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/builder"
            className="w-full sm:w-auto bg-accent text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-accent-secondary transition shadow-sm"
          >
            Buka AI PC Builder (2D) →
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto bg-surface border border-border text-foreground px-6 py-3 rounded-full text-sm font-medium hover:border-accent transition"
          >
            Kembali ke Marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
