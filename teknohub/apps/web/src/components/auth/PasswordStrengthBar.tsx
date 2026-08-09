"use client";

/** Indikator kekuatan password: lemah / sedang / kuat */
function scorePassword(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

export default function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const score = scorePassword(password);
  const pct = [20, 40, 60, 80, 100][Math.min(score, 5) - 1] ?? 20;
  const label =
    score <= 1 ? "Lemah" : score <= 3 ? "Sedang" : score >= 4 ? "Kuat" : "Cukup";
  const color =
    score <= 1 ? "bg-red-500" : score <= 3 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= Math.max(score, 1) ? color : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted mt-1">
        Kekuatan password: <span className="font-semibold">{label}</span> ({pct}%)
      </p>
    </div>
  );
}
