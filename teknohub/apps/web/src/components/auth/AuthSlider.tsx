"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/**
 * AuthSlider — split-screen sliding auth (TikTok-style).
 * Kiri: panel ajakan "Daftar", kanan: form Masuk.
 * Klik "Daftar"/"Masuk" -> overlay panel geser, form lawan masuk dari sisi.
 */
export default function AuthSlider() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-300 bg-surface shadow-2xl">
      <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
        {/* Kiri: form login (tampil saat mode=login) */}
        <div
          className={`order-1 p-8 sm:p-10 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === "login"
              ? "opacity-100 translate-x-0 z-10"
              : "opacity-0 translate-x-[-40px] pointer-events-none z-0"
          }`}
        >
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Selamat datang kembali</h1>
          <p className="text-sm text-muted mb-6">Masuk untuk lanjut ke marketplace, forum, dan PC Builder.</p>
          <LoginForm />
        </div>

        {/* Kanan: form register (tampil saat mode=register) */}
        <div
          className={`order-2 p-8 sm:p-10 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === "register"
              ? "opacity-100 translate-x-0 z-10"
              : "opacity-0 translate-x-[40px] pointer-events-none z-0"
          }`}
        >
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Buat akun baru</h1>
          <p className="text-sm text-muted mb-6">Bergabung dengan komunitas TeknoZone — gratis, 1 menit.</p>
          <RegisterForm />
        </div>

        {/* Overlay panel geser */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 hidden lg:flex flex-col justify-center items-center text-white p-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === "login" ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ background: "linear-gradient(135deg, #0B1F45 0%, #1E3A6E 60%, #2563EB 100%)" }}
        >
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-56 h-56 rounded-full bg-zone-blue/40 blur-3xl" />
          <div className="relative z-10 text-center max-w-sm">
            <h2 className="text-3xl font-extrabold mb-3">
              {mode === "login" ? "Halo, Sobat Tekno!" : "Sudah punya akun?"}
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed mb-8">
              {mode === "login"
                ? "Belum punya akun? Daftar gratis dan mulai rakit PC, belanja komponen, dan diskusi di forum."
                : "Masuk kembali untuk melanjutkan aktivitasmu di TeknoZone."}
            </p>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white hover:text-accent transition-colors duration-300"
            >
              {mode === "login" ? "Daftar" : "Masuk"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-transform duration-500 ${mode === "login" ? "" : "rotate-180"}`}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile toggle (lg:hidden) */}
      <div className="lg:hidden flex border-t border-slate-300">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "login" ? "bg-accent text-white" : "text-muted"}`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "register" ? "bg-accent text-white" : "text-muted"}`}
        >
          Daftar
        </button>
      </div>
    </div>
  );
}
