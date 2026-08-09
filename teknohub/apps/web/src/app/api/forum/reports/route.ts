import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"

// POST /api/forum/reports — { target_type, target_id, reason }
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const targetType = String(body?.target_type ?? "")
  const targetId = String(body?.target_id ?? "")
  const reason = String(body?.reason ?? "").trim()

  if (!["thread", "reply", "user"].includes(targetType) || !targetId) {
    return NextResponse.json({ error: "target_type/target_id wajib" }, { status: 400 })
  }
  if (reason.length < 5) {
    return NextResponse.json({ error: "Alasan minimal 5 karakter" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({ reporter_id: session.user.id, target_type: targetType, target_id: targetId, reason })
    .select("id")
    .single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Sudah pernah melaporkan item ini" }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
