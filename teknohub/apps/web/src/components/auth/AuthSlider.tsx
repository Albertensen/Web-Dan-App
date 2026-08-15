"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/**
 * AuthSlider — split-screen auth, kartu tinggi tetap (min-h), panel biru geser,
 * tanpa elemen ganda. Mobile: stack rapi.
 */
export default function AuthSlider({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const loginActive = mode === "login";

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[640px] lg:min-h-[560px] overflow-hidden rounded-3xl border border-slate-300 shadow-2xl">
      {/* Panel kanan (form) */}
      <section className="order-1 lg:order-2 bg-surface flex items-stretch">
        <div className="w-full overflow-y-auto max-h-[640px] lg:max-h-[560px] p-6 sm:p-10 lg:p-12">
          <div key={mode} className={`w-full max-w-md mx-auto ${loginActive ? "animate-page-in-right" : "animate-page-in-left"}`}>
            {loginActive ? (
              <>
                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Selamat datang kembali</h1>
                <p className="text-sm text-muted mb-6">Masuk untuk lanjut ke marketplace, forum, dan PC Builder.</p>
                <LoginForm />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Buat akun baru</h1>
                <p className="text-sm text-muted mb-6">Bergabung dengan komunitas TeknoZone — gratis, 1 menit.</p>
                <RegisterForm />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Panel kiri (biru) */}
      <aside className="order-2 lg:order-1 flex flex-col justify-center p-8 sm:p-10 lg:p-14 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B1F45 0%, #1E3A6E 60%, #2563EB 100%)" }}>
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-zone-blue/40 blur-3xl" />
        <div className="relative z-10 text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            {loginActive ? "Halo, Sobat Tekno!" : "Sudah punya akun?"}
          </h2>
          <p className="text-slate-200 text-sm leading-relaxed mb-8">
            {loginActive
              ? "Belum punya akun? Daftar gratis dan mulai rakit PC, belanja komponen, dan diskusi di forum."
              : "Masuk kembali untuk melanjutkan aktivitasmu di TeknoZone."}
          </p>
          <button
            type="button"
            onClick={() => setMode(loginActive ? "register" : "login")}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white hover:text-accent transition-colors duration-300"
          >
            {loginActive ? "Daftar" : "Masuk"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-transform duration-500 ${loginActive ? "" : "rotate-180"}`}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>
    </div>
  );
}
