import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rateLimit";

// Paksa runtime — jangan di-cache
export const dynamic = "force-dynamic";

const ip = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

/** Admin client Supabase (service role) — bypass RLS untuk create user */
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: Request) {
  // Rate limit: 5 request/menit per IP (brute force protection)
  if (!rateLimit(ip(req), { limit: 5, windowSec: 60 })) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  }
  try {
    const body = await req.json();
    // Schema register penuh (terms wajib), tapi API cuma butuh 3 field —
    // validasi manual field inti supaya konsisten dgn zod
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username harus 3-20 karakter (huruf, angka, underscore)" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Alamat email tidak valid" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }

    const sb = adminClient();

    // Cek username sudah dipakai
    const { data: existingUser } = await sb
      .from("profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan. Pilih username lain." },
        { status: 409 }
      );
    }

    // Buat user di Supabase Auth
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });
    if (error) {
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan masuk." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, uid: data.user.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi." },
      { status: 500 }
    );
  }
}
