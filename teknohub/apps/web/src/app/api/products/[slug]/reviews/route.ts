import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Paksa runtime query (jangan di-cache build)
export const dynamic = "force-dynamic";

/** GET /api/products/[slug]/reviews — review + tier user per produk */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("slug", params.slug)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  const { data: reviews, error } = await supabase
    .from("product_reviews")
    .select("id, rating, comment, created_at, profiles(id, username, reputation)")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: reviews ?? [] });
}
