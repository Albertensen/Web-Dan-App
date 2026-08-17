import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, status, total_amount, payment_method, shipping_address, shipping_courier, tracking_number, created_at")
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, name, price, quantity")
    .eq("order_id", params.id);

  return NextResponse.json({ data: { ...order, items: items ?? [] } });
}
