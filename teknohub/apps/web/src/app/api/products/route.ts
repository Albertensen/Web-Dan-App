import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

const SORT_MAP: Record<string, { col: string; asc: boolean }> = {
  price_asc: { col: "price", asc: true },
  price_desc: { col: "price", asc: false },
  created_desc: { col: "created_at", asc: false },
  created_asc: { col: "created_at", asc: true },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const sort = searchParams.get("sort") || "relevance";
  const limit = Number(searchParams.get("limit")) || 50;

  const COMPONENT_CHILDREN = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooler"];

  let query = supabase
    .from("products")
    .select("id, name, slug, price, stock, image_url, category, brand, description, created_at")
    .eq("is_active", true);

  if (category) {
    const cats = category === "komponen" ? COMPONENT_CHILDREN : [category];
    query = query.in("category", cats);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (minPrice && !isNaN(Number(minPrice))) query = query.gte("price", Number(minPrice));
  if (maxPrice && !isNaN(Number(maxPrice))) query = query.lte("price", Number(maxPrice));

  const s = SORT_MAP[sort] ?? { col: "created_at", asc: false };
  const { data, error } = await query.order(s.col, { ascending: s.asc }).limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const prods = data ?? [];

  // Bawa rating + jumlah ulasan per produk dari product_reviews
  let reviewsByProduct: Record<string, { rating: number }[]> = {};
  if (prods.length > 0) {
    const ids = prods.map((p) => p.id);
    const { data: reviews } = await supabase
      .from("product_reviews")
      .select("product_id, rating")
      .in("product_id", ids);
    if (reviews) {
      reviewsByProduct = reviews.reduce<Record<string, { rating: number }[]>>((acc, r) => {
        (acc[r.product_id] = acc[r.product_id] ?? []).push({ rating: r.rating });
        return acc;
      }, {});
    }
  }

  const enriched = prods.map((p) => ({
    ...p,
    reviews: reviewsByProduct[p.id] ?? [],
  }));

  return NextResponse.json({ data: enriched });
}
