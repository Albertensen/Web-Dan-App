import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/** GET /api/user/profile — profil user sendiri (dari session) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = adminClient();
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Profil tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ profile: data });
}

/** PATCH /api/user/profile — update username/bio/avatar */
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = adminClient();
  const body = await req.json();

  const updates: Record<string, string> = {};
  if (typeof body.username === "string") {
    const username = body.username.trim();
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username harus 3-20 karakter" },
        { status: 400 }
      );
    }
    // Cek username dipakai user lain
    const { data: taken } = await sb
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", session.user.id)
      .maybeSingle();
    if (taken) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 409 }
      );
    }
    updates.username = username;
  }
  if (typeof body.bio === "string") {
    updates.bio = body.bio.slice(0, 200);
  }
  if (typeof body.avatar_url === "string") {
    updates.avatar_url = body.avatar_url.slice(0, 500);
  }

  const { data, error } = await sb
    .from("profiles")
    .update(updates)
    .eq("id", session.user.id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: data });
}
