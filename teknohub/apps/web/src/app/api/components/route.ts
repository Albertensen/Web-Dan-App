import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || undefined;
  const socket = searchParams.get("socket") || undefined;

  let query = supabase
    .from("pc_components")
    .select(
      "id, name, brand, component_type, socket, specs, " +
        "component_prices(price, source, fetched_at)"
    )
    .order("name");

  if (type) query = query.eq("component_type", type);
  if (socket) query = query.eq("socket", socket);

interface ComponentRow {
  id: string;
  name: string;
  brand: string | null;
  component_type: string;
  socket: string | null;
  specs: Record<string, unknown>;
  component_prices?: { price: number; source: string; fetched_at: string }[];
}

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as ComponentRow[];

  // Ambil harga terbaru per komponen
  const items = rows.map((c) => {
    const prices = c.component_prices ?? [];
    const latest = prices.length > 0 ? prices[0] : null;
    return {
      ...c,
      price: latest?.price ?? null,
      price_source: latest?.source ?? null,
    };
  });

  return NextResponse.json({ data: items });
}
