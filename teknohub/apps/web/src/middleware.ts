import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiting middleware – per‑route limits (POST/PUT/DELETE only).
 * Lightweight in‑memory store (good for single‑instance dev).
 * In production swap for Redis/Upstash.
 * ponytail: add Redis/Upstash when deploying multi‑instance.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(
  ip: string,
  route: string,
  limit: number,
  windowSec = 60,
): boolean {
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

// Auto‑expire old buckets every 10 min (prevent memory leak)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of Array.from(buckets.entries())) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }, 10 * 60 * 1000).unref?.();
}

/* --------------------------------------------------------------
   API LIMITS – max requests per minute per route group
   -------------------------------------------------------------- */
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
  "/api/*": 60, // fallback
};

/**
 * Extract the top‑level API segment from the pathname,
 * so we can look‑up the correct limit (e.g. /api/forum/threads → "forum").
 */
function getRouteKey(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return "/api/" + (parts[1] || ""); // "/api/forum/threads" → "/api/forum"
}

/* --------------------------------------------------------------
   Main middleware – runs for every request
   -------------------------------------------------------------- */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Apply rate limiting only for mutating API routes
  if (pathname.startsWith("/api/") && ["POST", "PUT", "DELETE"].includes(method)) {
    const limit = API_LIMITS[getRouteKey(pathname)] ?? 60;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!rateLimit(ip, pathname, limit)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests – please try again later." }),
        { status: 429, headers: { "Retry-After": "30" } }
      );
    }
  }

  // All other routes pass through unchanged
  return NextResponse.next();
}

/* --------------------------------------------------------------
   NextConfig – match only the API routes we care about
   -------------------------------------------------------------- */
export const config = {
  matcher: ["/api/:path*"],
};