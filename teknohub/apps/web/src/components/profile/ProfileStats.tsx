interface Stats {
  orders: number;
  threads: number;
  builds: number;
  reputation: number;
}

const ITEMS: { key: keyof Stats; label: string; icon: string }[] = [
  { key: "orders", label: "Pesanan", icon: "🛒" },
  { key: "builds", label: "Build Tersimpan", icon: "🤖" },
  { key: "threads", label: "Thread Forum", icon: "💬" },
  { key: "reputation", label: "Reputasi", icon: "⭐" },
];

export default function ProfileStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {ITEMS.map((item) => (
        <div
          key={item.key}
          className="bg-surface-2/60 border border-border rounded-2xl p-4 text-center"
        >
          <div className="text-xl mb-1">{item.icon}</div>
          <div className="text-2xl font-extrabold">{stats[item.key]}</div>
          <div className="text-xs text-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
