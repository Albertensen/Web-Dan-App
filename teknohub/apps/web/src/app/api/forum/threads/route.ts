import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  let query = supabase.from("thread_details").select("*")
  const category = searchParams.get("category")
  const sort = searchParams.get("sort")

  if (category) {
    query = query.eq("category_slug", category)
  }

  if (sort === "popular") {
    query = query.order("reply_count", { ascending: false })
  } else {
    query = query.order("last_reply_at", { ascending: false, nullsFirst: false })
  }

  const { data, error } = await query.limit(30)

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}