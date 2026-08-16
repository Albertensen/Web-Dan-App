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

// GET /api/user/reviews — ambil semua ulasan milik user login
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getServiceClient()
    .from("product_reviews")
    .select(`
      id, product_id, rating, comment, created_at,
      products:product_id (name, slug, image_url, price)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

// PATCH /api/user/reviews — edit rating / komentar ulasan milik sendiri
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { reviewId, rating, comment } = await request.json();
    if (!reviewId || !rating) {
      return NextResponse.json({ error: "reviewId dan rating wajib diisi" }, { status: 400 });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating harus antara 1 sampai 5" }, { status: 400 });
    }

    const { data, error } = await getServiceClient()
      .from("product_reviews")
      .update({
        rating: numRating,
        comment: comment ?? null,
      })
      .eq("id", reviewId)
      .eq("user_id", session.user.id) // Pastikan hanya bisa edit milik sendiri
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
