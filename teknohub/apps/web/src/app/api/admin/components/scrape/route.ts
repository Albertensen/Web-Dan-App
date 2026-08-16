import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";
import { runCamofoxScraper } from "../../../../../../scripts/scraper/camofoxScraper";
import { runScraper as runBasicScraper } from "../../../../../../scripts/scraper/componentScraper";

export const maxDuration = 60;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key);
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await getServiceClient()
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing env" }, { status: 500 });
  }

  try {
    let report;
    try {
      report = await runCamofoxScraper({ supabaseUrl, supabaseKey });
    } catch {
      report = await runBasicScraper({ supabaseUrl, supabaseKey });
    }
    return NextResponse.json({ success: true, report });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Scraper error" },
      { status: 500 }
    );
  }
}
