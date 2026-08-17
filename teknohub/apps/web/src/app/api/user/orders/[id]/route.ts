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
    .select("id, product_id, name, price, quantity, is_digital, digital_code")
    .eq("order_id", params.id);

  // Ambil info lisensi / download dari produk untuk item digital
  const digitalItems = (items ?? []).filter((i) => i.is_digital);
  let licenseByProduct: Record<string, { download_url?: string | null; digital_instructions?: string | null; license_type?: string | null }> = {};
  if (digitalItems.length > 0) {
    const ids = digitalItems.map((i) => i.product_id);
    const { data: prodInfo } = await supabase
      .from("products")
      .select("id, download_url, digital_instructions, license_type")
      .in("id", ids);
    if (prodInfo) {
      licenseByProduct = prodInfo.reduce<Record<string, typeof licenseByProduct[string]>>((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {});
    }
  }

  const enrichedItems = (items ?? []).map((i) => {
    const li = licenseByProduct[i.product_id] ?? {};
    return {
      ...i,
      download_url: i.is_digital ? li.download_url : null,
      digital_instructions: i.is_digital ? li.digital_instructions : null,
      license_type: i.is_digital ? li.license_type : null,
    };
  });

  return NextResponse.json({ data: { ...order, items: enrichedItems } });
}
