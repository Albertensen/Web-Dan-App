import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";
import { checkoutSchema } from "@/lib/validations/checkout";
import { requestSnapToken } from "@/lib/midtrans";

interface CartItemInput {
  product_id: string;
  quantity: number;
  is_digital?: boolean;
}

function randSegment(len: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function generateDigitalCode(product: { name: string; category: string }): string {
  const n = (product.name || "").toLowerCase();
  const c = (product.category || "").toLowerCase();
  if (n.includes("windows") || c.includes("os") || c.includes("software")) {
    return `W11P-${randSegment(5)}-${randSegment(5)}-${randSegment(5)}`;
  }
  if (n.includes("steam")) {
    return `STM-IDR${randSegment(4)}-${randSegment(4)}-${randSegment(4)}`;
  }
  if (n.includes("xbox")) {
    return `XBOX-3M-${randSegment(5)}-${randSegment(5)}`;
  }
  if (n.includes("365") || n.includes("office")) {
    return `M365-1YR-${randSegment(5)}-${randSegment(5)}`;
  }
  if (n.includes("bitdefender")) {
    return `BDTS-1YR-${randSegment(5)}-${randSegment(5)}`;
  }
  if (c.includes("course") || n.includes("ebook") || n.includes("e-book")) {
    return `TKN-EBOOK-${randSegment(4)}-${randSegment(4)}`;
  }
  return `TKNDIG-${randSegment(5)}-${randSegment(5)}`;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, phone, email, address, city, postal_code, courier, notes } = parsed.data;
  const items = (body as { items?: CartItemInput[] }).items ?? [];

  if (items.length === 0) {
    return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
  }

  const isAllDigital = Boolean(
    items.length > 0 && items.every((i) => i.is_digital)
  );

  // Fetch produk berdasarkan id
  const productIds = items.map((i) => i.product_id);
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, price, stock, slug, category, is_digital, license_type, download_url, digital_instructions")
    .in("id", productIds);

  if (prodErr || !products || products.length !== productIds.length) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 400 });
  }

  // Cek stock
  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Stok tidak cukup untuk ${product?.name ?? "produk"}` },
        { status: 400 }
      );
    }
  }

  const totalAmount = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id)!;
    return sum + product.price * item.quantity;
  }, 0);

  const COURIER_LABEL: Record<string, string> = {
    jne: "JNE Reguler",
    jnt: "J&T Express",
    sicepat: "SiCepat BEST",
    grab: "GrabExpress",
    gosend: "GoSend SameDay",
    digital: "⚡ Pengiriman Digital Instan (Email & Akun)",
  };
  const shippingCourier = isAllDigital
    ? COURIER_LABEL.digital
    : (COURIER_LABEL[courier] ?? courier);
  const trackingNumber = isAllDigital
    ? `DIG-${Date.now().toString().slice(-8)}`
    : `TKNHUB-${Date.now().toString().slice(-8)}`;

  // Insert order (sertakan kolom top-level shipping_courier & tracking_number)
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: session.user.id,
      status: "pending",
      total_amount: totalAmount,
      currency: "IDR",
      shipping_address: {
        name,
        phone,
        email: email || "",
        address: isAllDigital ? "" : (address || ""),
        city: isAllDigital ? "Digital" : (city || ""),
        postal_code: postal_code || "",
        courier: isAllDigital ? "digital" : courier,
        notes: notes ?? "",
        is_all_digital: isAllDigital,
      },
      shipping_courier: shippingCourier,
      tracking_number: trackingNumber,
    })
    .select()
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Gagal membuat order" }, { status: 500 });
  }

  // Insert order items + kurangi stock
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.product_id)!;
    const digital = Boolean(product.is_digital);
    return {
      order_id: order.id,
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      is_digital: digital,
      digital_code: digital ? generateDigitalCode({ name: product.name, category: product.category }) : null,
    };
  });

  const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
  if (itemsErr) {
    return NextResponse.json({ error: "Gagal menyimpan item order" }, { status: 500 });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id)!;
    await supabase
      .from("products")
      .update({ stock: product.stock - item.quantity })
      .eq("id", product.id);
  }

  // Minta Snap Token (mock jika Midtrans belum dikonfigurasi)
  let snapToken: string;
  try {
    snapToken = await requestSnapToken({
      order_id: order.id,
      gross_amount: totalAmount,
      customer: { name, phone },
    });
  } catch {
    return NextResponse.json({ error: "Gagal inisialisasi pembayaran" }, { status: 500 });
  }

  return NextResponse.json({
    order_id: order.id,
    snap_token: snapToken,
    total_amount: totalAmount,
  });
}
