import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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

// GET /api/admin/quotes?status=requested
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? "requested";
  let query = getServiceClient()
    .from("build_quotes")
    .select("*, user:profiles(username, avatar_url), build:pc_builds(name, total_price, use_case, budget)")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/admin/quotes — actions: draft | send | accept | reject | convert_to_order
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, action, final_quote, total_price } = await request.json();
    if (!id || !action) {
      return NextResponse.json({ error: "ID dan action wajib" }, { status: 400 });
    }

    const db = getServiceClient();

    // Action: konversi quote ke pesanan resmi di tabel orders
    if (action === "convert_to_order") {
      const { data: quote, error: qErr } = await db
        .from("build_quotes")
        .select("*, build:pc_builds(name, total_price)")
        .eq("id", id)
        .single();

      if (qErr || !quote) {
        return NextResponse.json({ error: "Quote tidak ditemukan" }, { status: 404 });
      }

      const orderTotal = Number(quote.total_price || quote.build?.total_price || 0);

      // 1. Insert order baru
      const { data: newOrder, error: oErr } = await db
        .from("orders")
        .insert({
          user_id: quote.user_id,
          status: "pending",
          total_amount: orderTotal,
          currency: "IDR",
          shipping_address: {
            name: quote.user_id,
            address: "Dari Penawaran Rakit PC #" + id.slice(0, 8),
          },
          payment_method: "quote_conversion",
        })
        .select()
        .single();

      if (oErr) return NextResponse.json({ error: oErr.message }, { status: 500 });

      // 2. Insert order_item
      await db.from("order_items").insert({
        order_id: newOrder.id,
        name: `Paket Rakit PC: ${quote.build?.name || "Kustom"}`,
        price: orderTotal,
        quantity: 1,
      });

      // 3. Update status quote jadi accepted
      await db.from("build_quotes").update({ status: "accepted", updated_at: new Date().toISOString() }).eq("id", id);

      return NextResponse.json({ success: true, orderId: newOrder.id });
    }

    // Action biasa: update status quote
    const map: Record<string, string> = {
      draft: "drafted",
      send: "sent",
      accept: "accepted",
      reject: "rejected",
    };

    const nextStatus = map[action];
    if (!nextStatus) return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 });

    const updates: Record<string, unknown> = {
      status: nextStatus,
      updated_at: new Date().toISOString(),
    };
    if (final_quote !== undefined) updates.final_quote = final_quote;
    if (total_price !== undefined) updates.total_price = Number(total_price);

    const { data, error } = await db
      .from("build_quotes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
