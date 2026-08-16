"use client";

import { useState } from "react";
import Link from "next/link";
import UserReviewsTab from "./UserReviewsTab";
import EditProfileForm from "./EditProfileForm";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface UserOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_address?: {
    courier?: string;
    tracking_number?: string;
  };
  order_items?: OrderItem[];
}

interface UserThread {
  id: string;
  title: string;
  is_locked: boolean;
  reply_count: number;
  created_at: string;
}

interface ProfileTabsProps {
  profile: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    role?: string | null;
  };
  orders: UserOrder[];
  threads: UserThread[];
}

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  paid: "bg-blue-100 text-blue-800 border-blue-300",
  processing: "bg-purple-100 text-purple-800 border-purple-300",
  shipped: "bg-cyan-100 text-cyan-800 border-cyan-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function ProfileTabs({ profile, orders, threads }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "reviews" | "forum" | "edit">("orders");

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "orders" ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
          }`}
        >
          📦 Pesanan Saya ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "reviews" ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
          }`}
        >
          ⭐ Ulasan Produk Saya
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("forum")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "forum" ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
          }`}
        >
          💬 Aktivitas Forum ({threads.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "edit" ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
          }`}
        >
          ⚙️ Edit Profil
        </button>
      </div>

      {/* Tab Content: Pesanan Saya */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-surface-2/40 border border-dashed border-border rounded-2xl">
              <p className="text-sm text-muted">Belum ada riwayat pesanan.</p>
              <Link href="/shop/products" className="inline-block mt-3 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold">
                Mulai Belanja
              </Link>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/60 gap-2">
                  <div>
                    <span className="font-mono text-xs text-tertiary">Order #{o.id.slice(0, 8)}</span>
                    <span className="text-xs text-tertiary ml-2">· {(o.created_at ?? "").slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[o.status] ?? "bg-slate-100"}`}>
                      {o.status}
                    </span>
                    {o.shipping_address?.tracking_number && (
                      <span className="text-xs font-mono text-accent bg-accent-dim px-2 py-0.5 rounded-md">
                        {o.shipping_address.courier}: {o.shipping_address.tracking_number}
                      </span>
                    )}
                  </div>
                </div>
                <div className="py-2.5 space-y-1 text-xs">
                  {o.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{formatIDR(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/60 text-sm">
                  <span className="font-medium text-tertiary">Total Belanja</span>
                  <span className="font-bold text-foreground">{formatIDR(Number(o.total_amount))}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Ulasan Saya (Bisa diedit bintang & review-nya) */}
      {activeTab === "reviews" && <UserReviewsTab />}

      {/* Tab Content: Forum */}
      {activeTab === "forum" && (
        <div className="space-y-3">
          {threads.length === 0 ? (
            <div className="p-8 text-center bg-surface-2/40 border border-dashed border-border rounded-2xl">
              <p className="text-sm text-muted">Anda belum pernah membuat thread di forum.</p>
              <Link href="/forum/new" className="inline-block mt-3 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold">
                + Buat Thread Baru
              </Link>
            </div>
          ) : (
            threads.map((t) => (
              <div key={t.id} className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <Link href={`/forum/${t.id}`} className="font-bold text-foreground hover:text-accent text-sm line-clamp-1">
                    {t.title}
                  </Link>
                  <p className="text-xs text-tertiary mt-1">
                    💬 {t.reply_count} balasan · {(t.created_at ?? "").slice(0, 10)}
                  </p>
                </div>
                <Link href={`/forum/${t.id}`} className="shrink-0 px-3 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold hover:bg-slate-200">
                  Lihat →
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Edit Profil */}
      {activeTab === "edit" && (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-base font-bold mb-4">Ubah Data Profil</h2>
          <EditProfileForm profile={profile} />
        </div>
      )}
    </div>
  );
}
