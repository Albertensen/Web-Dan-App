import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";

export const metadata = {
  title: "Profil Saya — TeknoHub",
  description: "Profil dan riwayat aktivitas pengguna TeknoHub.",
};

export const dynamic = "force-dynamic";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("supabaseKey is required");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user?.id) redirect("/login?callbackUrl=/user/profile");

  const uid = session.user.id;
  const sb = adminClient();

  const [profileRes, ordersRes, threadsRes, buildsRes] = await Promise.all([
    sb.from("profiles").select("username, full_name, avatar_url, bio, reputation, role").eq("id", uid).maybeSingle(),
    sb.from("orders").select("id, status, total_amount, created_at, shipping_address, order_items(id, name, price, quantity)").eq("user_id", uid).order("created_at", { ascending: false }),
    sb.from("threads").select("id, title, is_locked, reply_count, created_at").eq("author_id", uid).order("created_at", { ascending: false }),
    sb.from("pc_builds").select("id", { count: "exact", head: true }).eq("author_id", uid),
  ]);

  const profile = profileRes.data;
  if (!profile) redirect("/");

  const userOrders = (ordersRes.data as unknown as Parameters<typeof ProfileTabs>[0]["orders"]) ?? [];
  const userThreads = (threadsRes.data as unknown as Parameters<typeof ProfileTabs>[0]["threads"]) ?? [];
  const buildsCount = buildsRes.count ?? 0;

  const stats = {
    orders: userOrders.length,
    threads: userThreads.length,
    builds: buildsCount,
    reputation: profile.reputation ?? 0,
  };

  const role = profile.role ?? "member";
    const roleLabel = role === "admin" ? "Super Admin" : role === "marketplace" ? "Staff Toko & Marketplace" : "Moderator Forum";

  return (
    <div className="flex-1 bg-background px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner Akses Seller Dashboard / Portal Toko */}
        <div className="bg-gradient-to-r from-accent via-accent-secondary to-accent text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              <h2 className="font-extrabold text-lg">Seller &amp; Store Portal ({roleLabel})</h2>
            </div>
            <p className="text-xs text-slate-200 mt-1 max-w-xl leading-relaxed">
              {role === "admin"
                ? "Akses pusat kendali toko: pendapatan (revenue), pesanan pembeli, kelola produk/stok, penawaran rakit PC, dan manajemen role pengguna."
                : "Akses pusat penjualan: pantau pesanan masuk, proses pengiriman resi, kelola katalog produk, dan moderasi ulasan."}
            </p>
          </div>
          <Link
            href="/admin"
            className="shrink-0 px-6 py-3 rounded-full bg-white text-accent font-extrabold text-xs hover:bg-slate-100 transition shadow-lg text-center"
          >
            Buka Seller Dashboard →
          </Link>
        </div>

        {/* Info Header & Statistik Akun */}
        <ProfileHeader profile={profile} />
        <ProfileStats stats={stats} />

        {/* Tab Navigasi Aktivitas User (Pesanan, Ulasan, Forum, Edit Profil) */}
        <div className="mt-6">
          <ProfileTabs profile={profile} orders={userOrders} threads={userThreads} />
        </div>
      </div>
    </div>
  );
}
