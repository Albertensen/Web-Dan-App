import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const limit = Number(searchParams.get("limit")) || 50;

  // Parent kategori "komponen" = semua sub-komponen
  const COMPONENT_CHILDREN = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooler"];

  let query = supabase
    .from("products")
    .select("name, slug, price, stock, image_url, category, brand, description")
    .eq("is_active", true);

  if (category) {
    const cats = category === "komponen" ? COMPONENT_CHILDREN : [category];
    query = query.in("category", cats);
  }
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
