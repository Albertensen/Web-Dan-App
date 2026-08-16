import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key);
}

async function checkAdmin(userId?: string) {
  if (!userId) return false;
  const { data } = await getServiceClient()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return data?.role === "admin";
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized: butuh role admin" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const banned = searchParams.get("banned");

  let query = getServiceClient()
    .from("profiles")
    .select("id, username, full_name, avatar_url, role, reputation, is_banned, banned_until, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (role && role !== "all") query = query.eq("role", role);
  if (banned === "true") query = query.eq("is_banned", true);
  if (banned === "false") query = query.eq("is_banned", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized: butuh role admin" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, role, is_banned, banned_days, reputation } = body;

    if (!userId) return NextResponse.json({ error: "userId wajib diisi" }, { status: 400 });

    // Jangan izinkan admin mem-ban akunnya sendiri
    if (userId === session!.user!.id && (is_banned || role !== "admin")) {
      return NextResponse.json({ error: "Tidak dapat mengubah role/ban akun sendiri" }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (role && ["member", "moderator", "admin"].includes(role)) updates.role = role;
    if (reputation !== undefined) updates.reputation = Number(reputation);

    if (is_banned !== undefined) {
      updates.is_banned = Boolean(is_banned);
      if (is_banned) {
        // banned_days: null = permanen, number = X hari dari sekarang
        updates.banned_until = banned_days
          ? new Date(Date.now() + Number(banned_days) * 86400000).toISOString()
          : null;
      } else {
        updates.banned_until = null;
      }
    }

    const { data, error } = await getServiceClient()
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
