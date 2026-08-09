import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"

// GET /api/forum/follows/status?target_type=..&target_id=.. — apakah user follow target?
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ data: { following: false } })
  }

  const targetType = request.nextUrl.searchParams.get("target_type") ?? ""
  const targetId = request.nextUrl.searchParams.get("target_id") ?? ""

  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", session.user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: { following: !!data } })
}
