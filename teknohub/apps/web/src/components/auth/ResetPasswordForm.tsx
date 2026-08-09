"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<ResetPasswordInput>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Token reset ada di URL (?code=... atau access_token hash)
    const hash = window.location.hash;
    const code = params.get("code");
    const accessToken = new URLSearchParams(hash.replace("#", "?")).get("access_token");

    async function applySession() {
      if (accessToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: new URLSearchParams(hash.replace("#", "?")).get("refresh_token") ?? "",
        });
        if (error) {
          setTokenError("Token reset tidak valid atau sudah kedaluwarsa.");
          return;
        }
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setTokenError("Token reset tidak valid atau sudah kedaluwarsa.");
          return;
        }
      } else {
        setTokenError("Link reset tidak lengkap. Minta link baru.");
        return;
      }
      setReady(true);
    }
    applySession();
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = resetPasswordSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<ResetPasswordInput> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ResetPasswordInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message as never;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: values.password });
    setLoading(false);
    if (error) {
      setTokenError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1800);
  }

  if (tokenError) {
    return (
      <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
        {tokenError}
        <div className="mt-3">
          <a href="/forgot-password" className="text-accent hover:underline font-medium">
            Minta link reset baru
          </a>
        </div>
      </div>
    );
  }

  if (!ready && !tokenError) {
    return <p className="text-sm text-muted">Memverifikasi token...</p>;
  }

  if (done) {
    return (
      <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
        ✅ Password berhasil diubah. Mengalihkan ke halaman masuk...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="rp-password" className="block text-sm font-medium text-muted mb-1.5">
          Password Baru
        </label>
        <input
          id="rp-password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
        />
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
      </div>
      <div>
        <label htmlFor="rp-confirm" className="block text-sm font-medium text-muted mb-1.5">
          Konfirmasi Password Baru
        </label>
        <input
          id="rp-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Ulangi password baru"
          value={values.confirmPassword}
          onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-accent hover:bg-accent-secondary text-white font-semibold transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Menyimpan..." : "Simpan Password Baru"}
      </button>
    </form>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Memuat...</p>}>
      <ResetForm />
    </Suspense>
  );
}
