import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

// GET /api/admin/quotes?status=requested — list quotes (admin)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? "requested";
  const { data, error } = await supabase
    .from("build_quotes")
    .select("*, user:profiles(username, avatar_url)")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

// POST /api/admin/quotes — { id, action: 'send'|'accept'|'reject', final_quote }
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? "");
  const action = String(body?.action ?? "");
  const finalQuote = String(body?.final_quote ?? "").trim();

  if (!id || !["send", "accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "id/action wajib" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (action === "send") {
    updates.status = "sent";
    if (finalQuote) updates.final_quote = finalQuote;
  } else if (action === "accept") {
    updates.status = "accepted";
  } else {
    updates.status = "rejected";
  }

  const { error } = await supabase.from("build_quotes").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { id, status: updates.status } });
}
