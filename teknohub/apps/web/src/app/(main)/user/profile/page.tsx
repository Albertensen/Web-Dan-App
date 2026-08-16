import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import EditProfileForm from "@/components/profile/EditProfileForm";

export const metadata = {
  title: "Profil Saya — TeknoZone",
  description: "Profil pengguna TeknoZone.",
};

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/user/profile");

  const sb = adminClient();
  const { data: profile } = await sb
    .from("profiles")
    .select("username, full_name, avatar_url, bio, reputation, role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (!profile) redirect("/");

  const roleLabel = profile.role === "admin" ? "Super Admin" : profile.role === "marketplace" ? "Staff Toko & Marketplace" : "Moderator Forum";

  // Statistik
  const uid = session.user.id;
  const [{ count: orders }, { count: threads }, { count: builds }] = await Promise.all([
    sb.from("orders").select("id", { count: "exact", head: true }).eq("user_id", uid),
    sb.from("threads").select("id", { count: "exact", head: true }).eq("author_id", uid),
    sb.from("pc_builds").select("id", { count: "exact", head: true }).eq("author_id", uid),
  ]);

  const stats = {
    orders: orders ?? 0,
    threads: threads ?? 0,
    builds: builds ?? 0,
    reputation: profile.reputation ?? 0,
  };

  return (
    <div className="flex-1 bg-background px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner Akses Portal Toko & Back-Office */}
        <div className="bg-gradient-to-r from-accent via-accent-secondary to-accent text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <h2 className="font-extrabold text-base">Portal Manajemen Toko ({roleLabel})</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {profile.role === "admin"
                ? "Kontrol penuh: pesanan, produk, komponen PC, penawaran rakit AI, dan hak akses pengguna."
                : "Akses kelola pesanan, katalog produk toko, moderasi forum, dan ulasan produk."}
            </p>
          </div>
          <Link
            href="/admin"
            className="shrink-0 px-5 py-2.5 rounded-full bg-white text-accent font-bold text-xs hover:bg-slate-100 transition shadow"
          >
            Buka Portal {profile.role === "admin" ? "Admin" : "Toko"} →
          </Link>
        </div>

        <ProfileHeader profile={profile} />
        <ProfileStats stats={stats} />

        <div className="bg-surface-2/60 border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Edit Profil</h2>
          <EditProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
