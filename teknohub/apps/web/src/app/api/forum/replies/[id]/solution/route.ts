import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

// POST /api/forum/replies/[id]/solution — tandai reply sebagai solusi
// Hanya pemilik thread yang bisa. Trigger DB +50 reputation ke penulis reply + kunci thread.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ambil reply + thread-nya
  const { data: reply, error: replyError } = await supabase
    .from("replies")
    .select("id, thread_id, author_id, is_solution")
    .eq("id", params.id)
    .single();

  if (replyError || !reply) {
    return NextResponse.json({ error: "Reply tidak ditemukan" }, { status: 404 });
  }

  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("author_id, is_locked")
    .eq("id", reply.thread_id)
    .single();

  if (threadError || !thread) {
    return NextResponse.json({ error: "Thread tidak ditemukan" }, { status: 404 });
  }

  // Hanya pemilik thread
  if (thread.author_id !== session.user.id) {
    return NextResponse.json({ error: "Hanya pemilik thread yang bisa menandai solusi" }, { status: 403 });
  }

  // Unmark semua solusi lain di thread, tandai yang ini
  const { error: resetError } = await supabase
    .from("replies")
    .update({ is_solution: false })
    .eq("thread_id", reply.thread_id);

  if (resetError) {
    return NextResponse.json({ error: resetError.message }, { status: 500 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("replies")
    .update({ is_solution: true })
    .eq("id", params.id)
    .select("id, is_solution")
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: updateError?.message ?? "Gagal menandai solusi" }, { status: 500 });
  }

  return NextResponse.json({ data: updated });
}
