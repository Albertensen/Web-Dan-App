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
  return data?.role === "admin" || data?.role === "moderator";
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = getServiceClient()
    .from("orders")
    .select(`
      id, user_id, status, total_amount, currency, shipping_address,
      payment_method, midtrans_order_id, created_at, updated_at,
      profiles:user_id (username, full_name),
      order_items (id, product_id, name, price, quantity)
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkAdmin(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, status, trackingNumber, courier } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId wajib diisi" }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;

    if (trackingNumber !== undefined || courier !== undefined) {
      // Ambil shipping_address lama untuk di-merge
      const { data: existing } = await getServiceClient()
        .from("orders")
        .select("shipping_address")
        .eq("id", orderId)
        .single();

      const currentAddr = (existing?.shipping_address as Record<string, unknown>) ?? {};
      updates.shipping_address = {
        ...currentAddr,
        ...(courier ? { courier } : {}),
        ...(trackingNumber !== undefined ? { tracking_number: trackingNumber } : {}),
      };
    }

    const { data, error } = await getServiceClient()
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Format request tidak valid" }, { status: 400 });
  }
}
