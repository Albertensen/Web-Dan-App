import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

const SORT_MAP: Record<string, { col: string; asc: boolean }> = {
  price_asc: { col: "price", asc: true },
  price_desc: { col: "price", asc: false },
  rating_desc: { col: "rating", asc: false },
  latest: { col: "created_at", asc: false },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const brandsParam = searchParams.get("brands");
  const inStock = searchParams.get("in_stock");
  const sort = searchParams.get("sort") || "relevance";
  const type = searchParams.get("type");
  const limit = Number(searchParams.get("limit")) || 50;

  const COMPONENT_CHILDREN = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooler"];

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (type === "digital") {
    query = query.eq("is_digital", true);
  } else if (type === "physical") {
    query = query.eq("is_digital", false);
  }

  if (category) {
    const cats = category === "komponen" ? COMPONENT_CHILDREN : [category];
    query = query.in("category", cats);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (minPrice && !isNaN(Number(minPrice))) query = query.gte("price", Number(minPrice));
  if (maxPrice && !isNaN(Number(maxPrice))) query = query.lte("price", Number(maxPrice));
  if (brandsParam) {
    const brands = brandsParam.split(",").map((b) => b.trim()).filter(Boolean);
    if (brands.length) query = query.in("brand", brands);
  }
  if (inStock === "1") query = query.gt("stock", 0);

  const s = SORT_MAP[sort] ?? { col: "created_at", asc: false };

  // rating_desc: fetch all then sort applied post-hoc (rating computed after)
  // handled below; intermediate order harmless.
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

  const enriched = prods.map((p) => {
    const rs = reviewsByProduct[p.id] ?? [];
    return {
      ...p,
      reviews: rs,
      avg_rating: rs.length ? Number((rs.reduce((sum, r) => sum + r.rating, 0) / rs.length).toFixed(1)) : 0,
    };
  });

  if (sort === "rating_desc") {
    enriched.sort((a, b) => b.avg_rating - a.avg_rating);
  }

  return NextResponse.json({ data: enriched });
}
