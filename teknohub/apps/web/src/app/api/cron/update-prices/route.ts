import { NextRequest, NextResponse } from "next/server";
import { runCamofoxScraper } from "../../../../../scripts/scraper/camofoxScraper";
import { runScraper as runBasicScraper } from "../../../../../scripts/scraper/componentScraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Vercel Cron: update harga tiap 6 jam — /api/cron/update-prices
// Auth: header Authorization = CRON_SECRET (biar tak dipanggil publik)
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing env" }, { status: 500 });
  }

  try {
    let report;
    // Prioritaskan Camofox (anti-bot). Jika Camofox URL reachable → pakai, else basic.
    try {
      report = await runCamofoxScraper({ supabaseUrl, supabaseKey });
    } catch {
      report = await runBasicScraper({ supabaseUrl, supabaseKey });
    }
    return NextResponse.json({ ok: true, engine: "camofox", report });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
