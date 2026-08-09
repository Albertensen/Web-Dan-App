import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma4:e4b";

// Knowledge base toko
const KB = [
  { keywords: ["rakit", "lama", "durasi", "berapa hari"], answer: "⏱️ Layanan rakit PC kami umumnya selesai dalam 1-2 hari kerja (tergantung antrian). Rakit express tersedia dengan biaya tambahan." },
  { keywords: ["garansi", "rusak", "claim"], answer: "🛡️ Semua komponen bergaransi resmi 1 tahun (sesuai brand). Jasa rakit gratis biaya perbaikan selama 3 bulan pertama jika ada kerusakan non-fisik." },
  { keywords: ["kirim", "pengiriman", "ongkir", "jne", "gojek", "kurir"], answer: "🚚 Kami melayani pengiriman JNE (seluruh Indonesia) dan GoSend/Gojek Same Day (Jabodetabek). Packing aman dengan bubble wrap + dus tebal." },
  { keywords: ["bayar", "pembayaran", "midtrans", "transfer", "qris"], answer: "💳 Pembayaran via Midtrans: transfer bank (BCA/BRI/Mandiri), e-wallet (GoPay/OVO/DANA), QRIS, dan kartu kredit. Pembayaran aman & terverifikasi." },
  { keywords: ["pesanan", "status", "order", "tracking", "dimana pesanan"], answer: "📦 Cek status pesanan di menu /orders (login dulu). Status: pending → paid → processing → shipped → delivered. Jika butuh bantuan, hubungi admin." },
  { keywords: ["harga", "murah", "diskon", "promo"], answer: "💰 Harga di update berkala dari marketplace. Cek /products untuk promo terbaru. Untuk penawaran khusus build, gunakan fitur minta penawaran di PC Builder." },
  { keywords: ["buka", "jam operasional", "alamat", "lokasi", "dimana"], answer: "🏪 TeknoHub online 24/7. Konsultasi via chat ini kapan saja. Untuk kunjungan langsung, hubungi admin untuk jadwal & alamat." },
  { keywords: ["refund", "retur", "komplain"], answer: "↩️ Retur/refund maksimal 7 hari setelah barang diterima, dengan syarat barang tidak rusak fisik & masih lengkap. Hubungi admin untuk proses komplain." },
];

const KB_DEFAULT = "Terima kasih sudah menghubungi TeknoHub CS 🤖. Pertanyaan: lama rakit, garansi, pengiriman, pembayaran, status pesanan, atau harga? Ketik pertanyaanmu, atau hubungi admin untuk bantuan lebih lanjut.";

export async function POST(request: NextRequest) {
  // Rate limit: 20 POST/menit per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip, { limit: 20, windowSec: 60 })) {
    return NextResponse.json({ error: "Terlalu banyak pesan. Coba lagi nanti." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const message = String(body?.message ?? "").trim();

  if (!message) {
    return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });
  }

  // Context user (session)
  const session = await getServerSession(authOptions);
  let userContext = "";
  if (session?.user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, role")
      .eq("id", session.user.id)
      .single();
    if (profile) {
      userContext = `User: ${profile.username} (${profile.role})`;
    }
  }

  // 1) Rule-based KB dulu (fast, deterministik)
  const lower = message.toLowerCase();
  for (const item of KB) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return NextResponse.json({ reply: item.answer });
    }
  }

  // 2) Fallback: Ollama (jika reachable)
  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah Customer Service TeknoHub, toko rakit PC online Indonesia. " +
              "Fakta toko: rakit 1-2 hari kerja, garansi resmi 1 tahun, kirim JNE/Gojek, bayar Midtrans, retur 7 hari. " +
              (userContext ? userContext + ". " : "") +
              "Jawab singkat & ramah dalam Bahasa Indonesia. Jika tak tahu, arahkan ke admin.",
          },
          { role: "user", content: message },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (ollamaRes.ok) {
      const json = await ollamaRes.json();
      const reply = String(json?.message?.content ?? "").trim();
      if (reply) {
        return NextResponse.json({ reply });
      }
    }
  } catch {
    // Ollama down — default
  }

  return NextResponse.json({ reply: KB_DEFAULT });
}
