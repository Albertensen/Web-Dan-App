"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Partial<ForgotPasswordInput>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      const fieldErrors: Partial<ForgotPasswordInput> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ForgotPasswordInput;
        fieldErrors[key] = issue.message as never;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("loading");
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status === "sent" && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
          ✅ Link reset password sudah dikirim ke <strong>{email}</strong>. Cek inbox
          (dan folder spam) lalu ikuti instruksinya.
        </div>
      )}
      {status === "error" && message && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {message}
        </div>
      )}

      <div>
        <label htmlFor="fp-email" className="block text-sm font-medium text-muted mb-1.5">
          Email
        </label>
        <input
          id="fp-email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading" || status === "sent"}
        className="w-full px-6 py-3 rounded-xl bg-accent hover:bg-accent-secondary text-white font-semibold transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? "Mengirim..."
          : status === "sent"
          ? "Link Terkirim ✓"
          : "Kirim Link Reset"}
      </button>

      <p className="text-center text-sm text-muted">
        Ingat password?{" "}
        <a href="/login" className="text-accent hover:underline font-medium">
          Masuk
        </a>
      </p>
    </form>
  );
}
