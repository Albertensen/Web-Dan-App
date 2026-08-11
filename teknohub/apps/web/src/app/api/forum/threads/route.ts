import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"
import { rateLimit } from "@/lib/rateLimit"
import { sanitizeHtml } from "@/lib/sanitize"

const ip = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  let query = supabase.from("thread_details").select("*")
  const category = searchParams.get("category")
  const sort = searchParams.get("sort")
  const tag = searchParams.get("tag")
  const search = searchParams.get("search")

  if (category) {
    query = query.eq("category_slug", category)
  }

  if (tag) {
    query = query.contains("tags", [tag])
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
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

export async function POST(request: NextRequest) {
  // Rate limit: 10 POST/menit per IP
  if (!rateLimit(ip(request), { limit: 10, windowSec: 60 })) {
    return NextResponse.json({ error: "Terlalu banyak request. Coba lagi nanti." }, { status: 429 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const title = String(body?.title ?? "").trim()
  const content = sanitizeHtml(String(body?.content ?? ""))
  const categorySlug = String(body?.category_slug ?? "")
  const plainContent = content.replace(/<[^>]*>/g, "").trim()
  const rawTags = Array.isArray(body?.tags) ? body.tags : []
  const tags = rawTags
    .map((t: unknown) => String(t).trim())
    .filter((t: string) => t.length > 0)
    .slice(0, 5)

  if (title.length < 5) {
    return NextResponse.json({ error: "Judul minimal 5 karakter" }, { status: 400 })
  }
  if (plainContent.length < 10) {
    return NextResponse.json({ error: "Konten minimal 10 karakter" }, { status: 400 })
  }

  // Cari category_id dari slug
  const { data: cat, error: catError } = await supabase
    .from("forum_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (catError || !cat) {
    return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 400 })
  }

  const { data: thread, error } = await supabase
    .from("threads")
    .insert({
      title,
      content,
      category_id: cat.id,
      author_id: session.user.id,
      tags,
    })
    .select("id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: thread }, { status: 201 })
}
