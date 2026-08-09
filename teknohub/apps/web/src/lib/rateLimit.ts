/**
 * Rate limiter in-memory per IP (Hobby Vercel — tanpa Redis).
 * Window sliding: Map<ip, {count, resetAt}>.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  /** Max request per window */
  limit: number;
  /** Window dalam detik */
  windowSec?: number;
}

/** Cek & catat request. Return true kalau dizinkan. */
export function rateLimit(ip: string, { limit, windowSec = 60 }: RateLimitConfig): boolean {
  const now = Date.now();
  const key = ip || "unknown";
  const cur = buckets.get(key);

  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  if (cur.count >= limit) return false;
  cur.count += 1;
  return true;
}

/** Bersihkan bucket expired (dipanggil sekali-sekali, mencegah memory leak) */
export function clearExpiredBuckets(): void {
  const now = Date.now();
  for (const [k, v] of Array.from(buckets.entries())) {
    if (v.resetAt <= now) buckets.delete(k);
  }
}

/** Bersihkan otomatis tiap 10 menit (interval non-blocking) */
if (typeof setInterval !== "undefined") {
  setInterval(clearExpiredBuckets, 10 * 60 * 1000).unref?.();
}
