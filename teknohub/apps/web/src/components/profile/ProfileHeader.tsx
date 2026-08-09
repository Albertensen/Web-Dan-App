interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  reputation: number | null;
}

/** Tier badge berdasarkan reputasi */
function tierOf(rep: number | null): { name: string; icon: string; cls: string } {
  if (rep === null) return { name: "Member", icon: "👤", cls: "bg-slate-500" };
  if (rep > 50) return { name: "Diamond", icon: "💎", cls: "bg-accent" };
  if (rep >= 10) return { name: "Gold", icon: "🥇", cls: "bg-amber-500" };
  return { name: "Silver", icon: "🥈", cls: "bg-slate-500" };
}

export default function ProfileHeader({ profile }: { profile: Profile }) {
  const tier = tierOf(profile.reputation);
  const initial = (profile.username ?? "?").charAt(0).toUpperCase();

  return (
    <div className="bg-surface-2/60 border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar_url}
          alt={profile.username ?? "avatar"}
          className="w-20 h-20 rounded-full object-cover border-2 border-border"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-3xl font-extrabold">
          {initial}
        </div>
      )}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
          <h1 className="text-2xl font-extrabold tracking-tight">{profile.username ?? "Pengguna"}</h1>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white ${tier.cls}`}
            title={`Reputasi ${profile.reputation ?? 0}`}
          >
            {tier.icon} {tier.name} Member
          </span>
        </div>
        <p className="text-sm text-muted mt-1">
          {profile.bio || "Belum ada bio. Edit profil untuk menambahkan."}
        </p>
      </div>
    </div>
  );
}
