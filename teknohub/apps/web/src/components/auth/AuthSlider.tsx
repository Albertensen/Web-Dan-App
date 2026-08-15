"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/**
 * AuthSlider — sliding auth split-screen (TikTok style).
 * Container relatif, dua form absolute inset-0, geser dengan translate-x-full (100% kontainer).
 * Overlay gradient absolute w-1/2 menutupi form aktif; klik tombol => overlay geser, form lawan tampil.
 */
export default function AuthSlider({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const registerActive = mode === "register";

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-300 bg-surface shadow-2xl">
      {/* Viewport slide: kedua form absolute penuh, geser 100% kontainer */}
      <div className="relative h-[600px] lg:h-[560px]">
        {/* Form login */}
        <div
          className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            registerActive ? "opacity-0 -translate-x-full pointer-events-none" : "opacity-100 translate-x-0"
          }`}
        >
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1">Selamat datang kembali</h1>
            <p className="text-sm text-muted mb-6">Masuk untuk lanjut ke marketplace, forum, dan PC Builder.</p>
            <LoginForm />
          </div>
        </div>

        {/* Form register */}
        <div
          className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            registerActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1">Buat akun baru</h1>
            <p className="text-sm text-muted mb-6">Bergabung dengan komunitas TeknoZone — gratis, 1 menit.</p>
            <RegisterForm />
          </div>
        </div>

        {/* Overlay gradient (desktop): geser menutupi form lawan */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 hidden lg:flex flex-col justify-center items-center text-white px-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            registerActive ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ background: "linear-gradient(135deg, #0B1F45 0%, #1E3A6E 60%, #2563EB 100%)" }}
        >
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-56 h-56 rounded-full bg-zone-blue/40 blur-3xl" />
          <div className="relative z-10 text-center max-w-sm">
            <h2 className="text-3xl font-extrabold mb-3">
              {registerActive ? "Sudah punya akun?" : "Halo, Sobat Tekno!"}
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed mb-8">
              {registerActive
                ? "Masuk kembali untuk melanjutkan aktivitasmu di TeknoZone."
                : "Belum punya akun? Daftar gratis dan mulai rakit PC, belanja komponen, dan diskusi di forum."}
            </p>
            <button
              type="button"
              onClick={() => setMode(registerActive ? "login" : "register")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white hover:text-accent transition-colors duration-300"
            >
              {registerActive ? "Masuk" : "Daftar"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-transform duration-500 ${registerActive ? "rotate-180" : ""}`}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile toggle */}
      <div className="lg:hidden flex border-t border-slate-300">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${registerActive ? "text-muted" : "bg-accent text-white"}`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${registerActive ? "bg-accent text-white" : "text-muted"}`}
        >
          Daftar
        </button>
      </div>
    </div>
  );
}
