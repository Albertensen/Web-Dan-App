import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key);
}

async function checkAdmin(userId?: string) {
  if (!userId) return false;
  const { data } = await getServiceClient()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return !!data?.role;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rating = searchParams.get("rating");

  let query = getServiceClient()
    .from("product_reviews")
    .select(`
      id, product_id, user_id, rating, comment, created_at,
      products:product_id (name, slug),
      profiles:user_id (username, full_name)
    `)
    .order("created_at", { ascending: false });

  if (rating && rating !== "all") {
    query = query.eq("rating", Number(rating));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID ulasan wajib" }, { status: 400 });

  const { error } = await getServiceClient()
    .from("product_reviews")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
