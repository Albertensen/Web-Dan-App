import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"

// POST /api/pc-builder/builds — { title, build_type, parts: [{component_id, quantity}] }
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const title = String(body?.title ?? "").trim()
  const buildType = String(body?.build_type ?? "gaming")
  const parts = Array.isArray(body?.parts) ? body.parts : []

  if (title.length < 3) {
    return NextResponse.json({ error: "Judul minimal 3 karakter" }, { status: 400 })
  }
  if (parts.length === 0) {
    return NextResponse.json({ error: "Build kosong" }, { status: 400 })
  }
  if (!["gaming", "productivity", "content-creator", "mini-itx", "budget"].includes(buildType)) {
    return NextResponse.json({ error: "build_type tidak valid" }, { status: 400 })
  }

  // Ambil harga tiap komponen utk total
  const componentIds = parts.map((p: { component_id: string }) => p.component_id)
  const { data: comps, error: compErr } = await supabase
    .from("pc_components")
    .select("id, name")
    .in("id", componentIds)

  if (compErr) {
    return NextResponse.json({ error: compErr.message }, { status: 500 })
  }
  if (!comps || comps.length !== componentIds.length) {
    return NextResponse.json({ error: "Ada komponen tidak valid" }, { status: 400 })
  }

  const { data: prices, error: priceErr } = await supabase
    .from("component_prices")
    .select("component_id, price")
    .in("component_id", componentIds)
    .order("created_at", { ascending: false })

  if (priceErr) {
    return NextResponse.json({ error: priceErr.message }, { status: 500 })
  }

  const priceMap = new Map<string, number>()
  for (const p of prices ?? []) {
    if (!priceMap.has(p.component_id)) priceMap.set(p.component_id, Number(p.price) || 0)
  }

  const totalPrice = parts.reduce((sum: number, p: { component_id: string; quantity?: number }) => {
    const qty = Number(p.quantity) || 1
    return sum + (priceMap.get(p.component_id) ?? 0) * qty
  }, 0)

  const { data: build, error: buildErr } = await supabase
    .from("pc_builds")
    .insert({
      author_id: session.user.id,
      title,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Math.random().toString(36).slice(2, 8)}`,
      build_type: buildType,
      total_price: totalPrice,
    })
    .select("id, slug")
    .single()

  if (buildErr) {
    return NextResponse.json({ error: buildErr.message }, { status: 500 })
  }

  const { error: partsErr } = await supabase.from("pc_build_parts").insert(
    parts.map((p: { component_id: string; quantity?: number }) => ({
      build_id: build.id,
      component_id: p.component_id,
      quantity: Number(p.quantity) || 1,
    }))
  )

  if (partsErr) {
    return NextResponse.json({ error: partsErr.message }, { status: 500 })
  }

  return NextResponse.json({ data: { id: build.id, slug: build.slug } }, { status: 201 })
}

// GET /api/pc-builder/builds — list build user (atau ?public=1 utk semua)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const publicOnly = request.nextUrl.searchParams.get("public") === "1"

  let query = supabase
    .from("pc_builds")
    .select("id, title, slug, build_type, total_price, is_public, like_count, created_at")

  if (publicOnly) {
    query = query.eq("is_public", true)
  } else if (session?.user?.id) {
    query = query.eq("author_id", session.user.id)
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(30)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}
