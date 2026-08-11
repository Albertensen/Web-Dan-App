// Badge berdasarkan reputation — helper pure, tanpa side effect
export type BadgeInfo = {
  label: string;
  color: string;
  icon: string;
};

export function getBadgeForReputation(reputation: number): BadgeInfo {
  if (reputation >= 500) return { label: "Expert", color: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: "🏆" };
  if (reputation >= 200) return { label: "Contributor", color: "bg-accent-dim text-accent border-accent/30", icon: "⭐" };
  if (reputation >= 50) return { label: "Active Member", color: "bg-blue-500/20 text-accent border-blue-500/40", icon: "💬" };
  return { label: "Member", color: "bg-surface-2/40 text-tertiary border-slate-300/50", icon: "👤" };
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
