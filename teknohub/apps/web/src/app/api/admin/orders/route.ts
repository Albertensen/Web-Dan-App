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

async function getUserInfo(userId?: string) {
  if (!userId) return { role: null as string | null };
  const { data } = await getServiceClient()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return { role: (data?.role as string) ?? null };
}

async function checkStaff(userId?: string) {
  const { role } = await getUserInfo(userId);
  return !!userId && role !== null;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkStaff(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await getUserInfo(session?.user?.id);
  const isAdmin = role === "admin";

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = getServiceClient()
    .from("orders")
    .select(`
      id, user_id, status, total_amount, currency, shipping_address,
      payment_method, midtrans_order_id, created_at, updated_at,
      profiles:user_id (username, full_name),
      order_items (id, product_id, name, price, quantity, is_digital, digital_code)
    `)
    .order("created_at", { ascending: false });

  // Seller non-admin: hanya pesanan terkait produk miliknya (created_by = seller id)
  if (!isAdmin && session?.user?.id) {
    const { data: sellerProducts } = await getServiceClient()
      .from("products")
      .select("id")
      .eq("created_by", session.user.id);
    const productIds = (sellerProducts ?? []).map((p) => p.id);
    if (productIds.length === 0) {
      return NextResponse.json({ data: [] });
    }
    // ambil order yang punya order_items ber product_id milik seller
    const { data: sellerOrderItemRows } = await getServiceClient()
      .from("order_items")
      .select("order_id")
      .in("product_id", productIds);
    const orderIds = Array.from(new Set((sellerOrderItemRows ?? []).map((r) => r.order_id)));
    if (orderIds.length === 0) {
      return NextResponse.json({ data: [] });
    }
    query = query.in("id", orderIds);
  }

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
  if (!(await checkStaff(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, status, trackingNumber, courier } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId wajib diisi" }, { status: 400 });
    }

    // Seller non-admin: hanya boleh update pesanan yang memuat produk miliknya
    const { role } = await getUserInfo(session?.user?.id);
    if (role !== "admin" && session?.user?.id) {
      const { data: sellerProducts } = await getServiceClient()
        .from("products")
        .select("id")
        .eq("created_by", session.user.id);
      const productIds = (sellerProducts ?? []).map((p) => p.id);
      if (productIds.length === 0) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const { data: rows } = await getServiceClient()
        .from("order_items")
        .select("order_id")
        .in("product_id", productIds)
        .eq("order_id", orderId);
      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
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
