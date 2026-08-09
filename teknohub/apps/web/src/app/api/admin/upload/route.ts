import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { path } = (await request.json()) as { path?: string; contentType?: string };

  if (!path || !path.startsWith("products/")) {
    return NextResponse.json({ error: "Path tidak valid" }, { status: 400 });
  }

  const { data, error } = await serviceClient.storage
    .from("product-images")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Gagal buat upload URL" }, { status: 500 });
  }

  const publicUrl = serviceClient.storage
    .from("product-images")
    .getPublicUrl(path).data.publicUrl;

  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl });
}
