import type React from "react";
import { Star, MessageSquare, Bot, ShoppingCart } from "lucide-react";

interface Stats {
  orders: number;
  threads: number;
  builds: number;
  reputation: number;
}

const ITEMS: { key: keyof Stats; label: string; icon: React.ComponentType<{ size?: number | string }> }[] = [
  { key: "orders", label: "Pesanan", icon: ShoppingCart },
  { key: "builds", label: "Build Tersimpan", icon: Bot },
  { key: "threads", label: "Thread Forum", icon: MessageSquare },
  { key: "reputation", label: "Reputasi", icon: Star },
];

export default function ProfileStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {ITEMS.map((item) => (
        <div
          key={item.key}
          className="bg-surface-2/60 border border-border rounded-2xl p-4 text-center"
        >
          <div className="text-accent mb-1 flex justify-center"><item.icon size={22} /></div>
          <div className="text-2xl font-extrabold">{stats[item.key]}</div>
          <div className="text-xs text-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
