import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import {
  getMidtransConfig,
  verifyMidtransSignature,
  isPaidStatus,
  type MidtransNotification,
} from "@/lib/midtrans";

export async function POST(request: NextRequest) {
  const config = getMidtransConfig();

  // Midtrans belum dikonfigurasi — feature pending, ack saja
  if (!config.isEnabled || !config.serverKey) {
    return NextResponse.json({ received: true, pending: true });
  }

  let notification: MidtransNotification;
  try {
    notification = (await request.json()) as MidtransNotification;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Verifikasi signature
  if (!verifyMidtransSignature(notification, config.serverKey)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  // Update status order
  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id")
    .eq("id", notification.order_id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (isPaidStatus(notification.transaction_status)) {
    await supabase
      .from("orders")
      .update({ status: "paid", payment_method: notification.payment_type })
      .eq("id", order.id);
  }

  return NextResponse.json({ received: true });
}
