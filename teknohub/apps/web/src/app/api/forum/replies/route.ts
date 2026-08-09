import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const threadId = String(body?.thread_id ?? "")
  const content = String(body?.content ?? "")
  const plain = content.replace(/<[^>]*>/g, "").trim()

  if (!threadId) {
    return NextResponse.json({ error: "thread_id wajib" }, { status: 400 })
  }
  if (plain === "") {
    return NextResponse.json({ error: "Balasan tidak boleh kosong" }, { status: 400 })
  }

  // Cek thread ada
  const { data: thread } = await supabase
    .from("threads")
    .select("id, is_locked")
    .eq("id", threadId)
    .single()

  if (!thread) {
    return NextResponse.json({ error: "Thread tidak ditemukan" }, { status: 404 })
  }
  if (thread.is_locked) {
    return NextResponse.json({ error: "Thread terkunci (sudah solved)" }, { status: 403 })
  }

  const { data: reply, error } = await supabase
    .from("replies")
    .insert({
      thread_id: threadId,
      author_id: session.user.id,
      content,
    })
    .select("id, content, is_solution, created_at, author_id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: reply }, { status: 201 })
}
