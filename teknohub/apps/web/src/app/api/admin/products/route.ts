import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";

// Service role client (server-only) untuk insert produk
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProductInput {
  name: string;
  slug: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string | null;
}

const CATEGORIES = ["laptop", "smartphone", "monitor", "cpu", "gpu", "ram", "storage", "motherboard", "psu", "case", "cooler", "aksesoris"];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // Admin check: role dari profiles
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden: butuh role admin" }, { status: 403 });
  }

  let body: ProductInput;
  try {
    body = (await request.json()) as ProductInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name || !body.slug || !body.category || !CATEGORIES.includes(body.category)) {
    return NextResponse.json({ error: "Data produk tidak valid" }, { status: 400 });
  }

  const { data, error } = await serviceClient
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
      created_by: session.user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
