// Badge berdasarkan reputation — helper pure, tanpa side effect
export type BadgeInfo = {
  label: string;
  color: string;
  icon: string;
};

export function getBadgeForReputation(reputation: number): BadgeInfo {
  if (reputation >= 500) return { label: "Expert", color: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: "🏆" };
  if (reputation >= 200) return { label: "Contributor", color: "bg-violet-500/20 text-violet-300 border-violet-500/40", icon: "⭐" };
  if (reputation >= 50) return { label: "Active Member", color: "bg-blue-500/20 text-blue-300 border-blue-500/40", icon: "💬" };
  return { label: "Member", color: "bg-slate-700/40 text-slate-400 border-slate-600/50", icon: "👤" };
}

export function UserBadge({ reputation }: { reputation: number | null | undefined }) {
  const badge = getBadgeForReputation(reputation ?? 0);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${badge.color}`}
      title={`Reputasi: ${reputation ?? 0}`}
    >
      {badge.icon} {badge.label}
    </span>
  );
}
