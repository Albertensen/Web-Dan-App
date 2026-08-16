import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("supabaseKey is required");
  }
  return createClient(url, key);
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await getServiceClient()
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "moderator", "marketplace"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { path, contentType } = (await request.json()) as { path?: string; contentType?: string };

  // Validasi path: hanya di dalam products/, tanpa traversal (.. / .), tanpa leading slash atau backslash
  if (
    !path ||
    !path.startsWith("products/") ||
    path.includes("..") ||
    path.startsWith("/") ||
    path.includes("\\") ||
    path.includes("%2e%2e")
  ) {
    return NextResponse.json({ error: "Path tidak valid atau mengandung karakter dilarang" }, { status: 400 });
  }

  // Validasi ekstensi file
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ error: "Ekstensi file tidak diizinkan. Hanya .jpg, .jpeg, .png, .webp, .gif" }, { status: 400 });
  }

  // Validasi MIME type server-side
  if (contentType && !ALLOWED_MIME_TYPES.includes(contentType.toLowerCase())) {
    return NextResponse.json({ error: "MIME type tidak diizinkan" }, { status: 400 });
  }

  const { data, error } = await getServiceClient().storage
    .from("product-images")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Gagal buat upload URL" }, { status: 500 });
  }

  const publicUrl = getServiceClient().storage
    .from("product-images")
    .getPublicUrl(path).data.publicUrl;

  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl });
}
