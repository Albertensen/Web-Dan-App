import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"

// POST /api/forum/follows — { target_type: 'user'|'thread', target_id }
// DELETE /api/forum/follows?target_type=..&target_id=..
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const targetType = String(body?.target_type ?? "")
  const targetId = String(body?.target_id ?? "")

  if (!["user", "thread"].includes(targetType) || !targetId) {
    return NextResponse.json({ error: "target_type/target_id wajib" }, { status: 400 })
  }
  if (targetType === "user" && targetId === session.user.id) {
    return NextResponse.json({ error: "Tidak bisa follow diri sendiri" }, { status: 400 })
  }

  const { error } = await supabase.from("follows").insert({
    follower_id: session.user.id,
    target_type: targetType,
    target_id: targetId,
  })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ data: { followed: true, already: true } })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { followed: true } }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const targetType = request.nextUrl.searchParams.get("target_type") ?? ""
  const targetId = request.nextUrl.searchParams.get("target_id") ?? ""

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", session.user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { followed: false } })
}
