import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";

export const dynamic = "force-dynamic";

// GET /api/admin/quotes/[id]/pdf — download invoice PDF (admin)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: quote } = await supabase
    .from("build_quotes")
    .select("*, user:profiles(username)")
    .eq("id", params.id)
    .single();

  if (!quote) {
    return NextResponse.json({ error: "Quote tidak ditemukan" }, { status: 404 });
  }

  const items = [
    { label: "Jasa Rakit PC", value: quote.total_price != null ? `Rp ${Number(quote.total_price).toLocaleString("id-ID")}` : "—" },
    { label: "Garansi", value: "Resmi 1 tahun" },
    { label: "Estimasi Selesai", value: "1-2 hari kerja" },
  ];

  const pdf = generateInvoicePDF({
    invoiceNo: `INV-TKH-${String(quote.id).slice(0, 8).toUpperCase()}`,
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    customerName: quote.user?.username ?? "Pelanggan",
    items,
    total: quote.total_price != null ? `Rp ${Number(quote.total_price).toLocaleString("id-ID")}` : "—",
    status: quote.status,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${String(quote.id).slice(0, 8)}.pdf"`,
      "Content-Length": String(pdf.length),
    },
  });
}
