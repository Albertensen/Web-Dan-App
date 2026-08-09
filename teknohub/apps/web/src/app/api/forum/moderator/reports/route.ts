import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"

// GET /api/forum/moderator/reports?status=open — list report (moderator/admin)
// POST /api/forum/moderator/reports — { id, action: 'dismiss'|'ban'|'actioned', target_type, target_id }
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (!profile || !["moderator", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const status = request.nextUrl.searchParams.get("status") ?? "open"
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (!profile || !["moderator", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const id = String(body?.id ?? "")
  const action = String(body?.action ?? "")

  if (!id || !["dismiss", "actioned", "ban"].includes(action)) {
    return NextResponse.json({ error: "id/action wajib" }, { status: 400 })
  }

  const { data: report } = await supabase.from("reports").select("*").eq("id", id).single()
  if (!report) {
    return NextResponse.json({ error: "Report tidak ditemukan" }, { status: 404 })
  }

  // action ban: ban target user (jika target_type=user) atau penulis thread/reply
  if (action === "ban") {
    let targetUserId = report.target_id
    if (report.target_type === "thread") {
      const { data: t } = await supabase.from("threads").select("author_id").eq("id", report.target_id).single()
      targetUserId = t?.author_id ?? report.target_id
    } else if (report.target_type === "reply") {
      const { data: r } = await supabase.from("replies").select("author_id").eq("id", report.target_id).single()
      targetUserId = r?.author_id ?? report.target_id
    }

    const { error: banErr } = await supabase
      .from("profiles")
      .update({ is_banned: true, banned_until: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString() })
      .eq("id", targetUserId)

    if (banErr) {
      return NextResponse.json({ error: banErr.message }, { status: 500 })
    }
  }

  const { error } = await supabase
    .from("reports")
    .update({ status: action === "dismiss" ? "dismissed" : "actioned" })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { id, status: action === "dismiss" ? "dismissed" : "actioned" } })
}
