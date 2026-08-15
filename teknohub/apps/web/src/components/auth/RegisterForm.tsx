"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import PasswordStrengthBar from "./PasswordStrengthBar";

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Partial<RegisterInput>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<RegisterInput> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RegisterInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message as never;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mendaftar. Coba lagi.");
        setLoading(false);
        return;
      }
      // Auto login setelah daftar sukses
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reg-username" className="block text-sm font-medium text-muted mb-1.5">
          Username
        </label>
        <input
          id="reg-username"
          type="text"
          autoComplete="username"
          placeholder="misal: rakitmaster"
          value={values.username}
          onChange={(e) => setValues({ ...values, username: e.target.value })}
          className={inputCls}
        />
        {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-muted mb-1.5">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className={inputCls}
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-muted mb-1.5">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          className={inputCls}
        />
        <PasswordStrengthBar password={values.password} />
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-muted mb-1.5">
          Konfirmasi Password
        </label>
        <input
          id="reg-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Ulangi password"
          value={values.confirmPassword}
          onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
          className={inputCls}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={values.terms}
            onChange={(e) => setValues({ ...values, terms: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded border-border accent-accent"
          />
          <span>
            Saya menyetujui{" "}
            <a href="/terms" className="text-accent hover:underline">
              Syarat &amp; Ketentuan
            </a>{" "}
            dan{" "}
            <a href="/privacy" className="text-accent hover:underline">
              Kebijakan Privasi
            </a>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-600 mt-1">{errors.terms}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-accent hover:bg-accent-secondary text-white font-semibold transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Mendaftarkan..." : "Daftar"}
      </button>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex-1 h-px bg-border" />
        atau
        <span className="flex-1 h-px bg-border" />
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-surface border border-border hover:border-accent text-foreground font-semibold transition shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-60"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Daftar dengan Google
      </button>

      <p className="text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <a
          href="/login"
          className="group inline-flex items-center gap-1 text-accent font-medium hover:text-accent-secondary transition-colors"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Masuk
        </a>
      </p>
    </form>
  );
}
