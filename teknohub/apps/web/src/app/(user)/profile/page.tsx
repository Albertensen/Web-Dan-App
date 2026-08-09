import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import EditProfileForm from "@/components/profile/EditProfileForm";

export const metadata = {
  title: "Profil Saya — TeknoZone",
  description: "Profil pengguna TeknoZone.",
};

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/profile");

  const sb = adminClient();
  const { data: profile } = await sb
    .from("profiles")
    .select("username, full_name, avatar_url, bio, reputation")
    .eq("id", session.user.id)
    .maybeSingle();

  if (!profile) redirect("/");

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
