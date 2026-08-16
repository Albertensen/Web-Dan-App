"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center px-6 min-h-[60vh] text-center">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl mx-auto mb-4 border border-red-300">
          ⚠️
        </div>
        <h1 className="text-xl font-extrabold text-foreground mb-2">Terjadi Kendala Sistem</h1>
        <p className="text-xs text-tertiary mb-6 leading-relaxed">
          Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba muat ulang halaman.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-accent text-white font-semibold text-xs hover:bg-accent-secondary transition"
          >
            Coba Lagi ↺
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-surface-2 border border-border text-foreground font-semibold text-xs hover:border-accent transition"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
