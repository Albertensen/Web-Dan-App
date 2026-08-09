import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"

// GET /api/pc-builder/builds/[slug] — detail build + parts
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)

  const { data: build, error } = await supabase
    .from("pc_builds")
    .select("*, author:profiles(username, avatar_url)")
    .eq("slug", params.slug)
    .single()

  if (error || !build) {
    return NextResponse.json({ error: "Build tidak ditemukan" }, { status: 404 })
  }

  // Private build: hanya author
  if (!build.is_public && (!session?.user?.id || session.user.id !== build.author_id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: parts, error: partsErr } = await supabase
    .from("pc_build_parts")
    .select("component_id, quantity, component:pc_components(id, name, brand, component_type)")
    .eq("build_id", build.id)

  if (partsErr) {
    return NextResponse.json({ error: partsErr.message }, { status: 500 })
  }

  return NextResponse.json({
    data: {
      ...build,
      parts: parts ?? [],
    },
  })
}
