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

const CATEGORIES = ["laptop", "smartphone", "monitor", "cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooler", "aksesoris", "software", "game-voucher", "course"];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkStaff(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.slug || !body.category || !CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: "Data produk tidak valid" }, { status: 400 });
    }

    const { data, error } = await getServiceClient()
      .from("products")
      .insert({
        name: body.name,
        slug: body.slug,
        category: body.category,
        brand: body.brand ?? null,
        price: body.price,
        stock: body.stock ?? 0,
        description: body.description ?? null,
        image_url: body.image_url ?? null,
        is_digital: body.is_digital ?? false,
        license_type: body.is_digital ? (body.license_type ?? null) : null,
        download_url: body.is_digital ? (body.download_url ?? null) : null,
        digital_instructions: body.is_digital ? (body.digital_instructions ?? null) : null,
        created_by: session!.user!.id,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkStaff(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await getUserInfo(session?.user?.id);

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID produk wajib diisi" }, { status: 400 });

    let query = getServiceClient().from("products").update(updates).eq("id", id);

    // Seller hanya boleh mengubah produk miliknya sendiri
    if (role !== "admin") {
      query = query.eq("created_by", session!.user!.id);
    }

    const { data, error } = await query.select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(await checkStaff(session?.user?.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await getUserInfo(session?.user?.id);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID produk wajib" }, { status: 400 });

  // Soft delete / toggle is_active = false
  let query = getServiceClient().from("products").update({ is_active: false }).eq("id", id);

  // Seller hanya boleh nonaktifkan produk miliknya
  if (role !== "admin") {
    query = query.eq("created_by", session!.user!.id);
  }

  const { data, error } = await query.select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data });
}
