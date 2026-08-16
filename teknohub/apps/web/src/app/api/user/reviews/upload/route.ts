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

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/user/reviews/upload — signed upload foto unboxing utk ulasan
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path, contentType } = (await request.json()) as { path?: string; contentType?: string };
    if (
      !path ||
      !path.startsWith("reviews/") ||
      path.includes("..") ||
      path.startsWith("/") ||
      path.includes("\\") ||
      path.includes("%2e%2e")
    ) {
      return NextResponse.json({ error: "Path tidak valid" }, { status: 400 });
    }

    const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ error: "Ekstensi tidak diizinkan" }, { status: 400 });
    }
    if (contentType && !ALLOWED_MIME.includes(contentType.toLowerCase())) {
      return NextResponse.json({ error: "MIME tidak diizinkan" }, { status: 400 });
    }

    const client = getServiceClient();
    const { data, error } = await client.storage.from("review-images").createSignedUploadUrl(path);
    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Gagal buat upload URL" }, { status: 500 });
    }
    const publicUrl = client.storage.from("review-images").getPublicUrl(path).data.publicUrl;
    return NextResponse.json({ signedUrl: data.signedUrl, publicUrl });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
