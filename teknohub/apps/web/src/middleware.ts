import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

/**
 * Rate limiter in-memory per IP+route untuk semua API mutation.
 * Layer kedua di atas rateLimit() per-route — proteksi seragam di middleware.
 * ponytail: in-memory (single-instance dev/Hobby) — pindah ke Redis/Upstash
 * saat deploy multi-instance; limiter per-route tetap jalan sebagai lapis dalam.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, route: string, limit: number, windowSec = 60): boolean {
  const now = Date.now();
  const key = `${ip}|${route}`;
  const cur = buckets.get(key);
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  if (cur.count >= limit) return false;
  cur.count += 1;
  return true;
}

// Bersihkan bucket expired tiap 10 menit (cegah memory leak)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of Array.from(buckets.entries())) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }, 10 * 60 * 1000).unref?.();
}

// Batas per kategori route API
const API_LIMITS: Record<string, number> = {
  "/api/auth": 30,
  "/api/checkout": 20,
  "/api/forum": 40,
  "/api/pc-builder": 60,
  "/api/support": 20,
  "/api/user": 30,
  "/api/admin": 60,
  "/api/products": 60,
  "/api/webhooks": 120,
  "/api/cron": 30,
};

const DEFAULT_LIMIT = 60;

// Proteksi halaman yang butuh login (dari next-auth/middleware)
const authMiddleware = withAuth({
  pages: { signIn: "/login" },
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Rate limit API — semua route /api/*
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    let limit = DEFAULT_LIMIT;
    for (const [prefix, l] of Object.entries(API_LIMITS)) {
      if (pathname.startsWith(prefix)) {
        limit = l;
        break;
      }
    }
    if (!rateLimit(ip, pathname, limit)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi nanti." },
        { status: 429 }
      );
    }
  }

  // 2) Auth guard halaman (cart/checkout/profile/orders)
  if (["/cart", "/checkout", "/profile", "/orders"].some((p) => pathname.startsWith(p))) {
    return authMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/cart/:path*", "/checkout/:path*", "/profile/:path*", "/orders/:path*"],
};