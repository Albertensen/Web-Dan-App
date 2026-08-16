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
  return data?.role === "admin";
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let query = getServiceClient()
    .from("pc_components")
    .select(`
      id, name, brand, component_type, socket, specs, image_url, marketplace_url, created_at,
      component_prices (id, source, url, price, currency, fetched_at)
    `)
    .order("component_type", { ascending: true });

  if (type && type !== "all") {
    query = query.eq("component_type", type);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, brand, marketplace_url, socket, specs, price } = body;
    if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (brand !== undefined) updates.brand = brand;
    if (marketplace_url !== undefined) updates.marketplace_url = marketplace_url;
    if (socket !== undefined) updates.socket = socket;
    if (specs !== undefined) updates.specs = specs;

    const db = getServiceClient();
    const { data, error } = await db
      .from("pc_components")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Jika ada update harga manual, simpan ke component_prices
    if (price !== undefined && price !== null) {
      await db.from("component_prices").insert({
        component_id: id,
        source: "admin_manual",
        price: Number(price),
        currency: "IDR",
        fetched_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
