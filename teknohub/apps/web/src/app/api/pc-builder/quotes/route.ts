import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

// POST /api/pc-builder/quotes — { build_id?, title, note }
// Submit quote request + estimasi biaya rakit (150rb-300rb)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const buildId = String(body?.build_id ?? "");
  const note = String(body?.note ?? "").trim();

  // Hitung total dari build (jika ada) + estimasi jasa rakit
  let totalPrice: number | null = null;
  let aiDraft = "Permintaan penawaran rakit PC diterima. Admin akan mengirimkan penawaran resmi segera.";

  if (buildId) {
    const { data: build } = await supabase
      .from("pc_builds")
      .select("total_price, title")
      .eq("id", buildId)
      .eq("author_id", session.user.id)
      .single();

    if (!build) {
      return NextResponse.json({ error: "Build tidak ditemukan" }, { status: 404 });
    }

    const buildTotal = Number(build.total_price ?? 0);
    const buildFee = buildTotal >= 20000000 ? 300000 : 150000;
    totalPrice = buildTotal + buildFee;
    aiDraft = `Penawaran untuk build "${build.title}": total komponen ${new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", maximumFractionDigits: 0,
    }).format(buildTotal)} + jasa rakit ${buildFee >= 300000 ? "Rp 300.000 (build ≥ 20jt)" : "Rp 150.000"} = ${new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", maximumFractionDigits: 0,
    }).format(totalPrice)}. Garansi resmi 1 tahun, rakit 1-2 hari kerja.${note ? `\nCatatan: ${note}` : ""}`;
  } else {
    aiDraft = `Permintaan penawaran rakit PC (tanpa build tersimpan).${note ? `\nCatatan: ${note}` : ""} Estimasi jasa rakit: Rp 150.000 - Rp 300.000.`;
  }

  const { data, error } = await supabase
    .from("build_quotes")
    .insert({
      build_id: buildId || null,
      user_id: session.user.id,
      status: "requested",
      ai_draft: aiDraft,
      total_price: totalPrice,
    })
    .select("id, status, ai_draft, total_price")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

// GET /api/pc-builder/quotes — list quote milik user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("build_quotes")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
