"use client";

import { useState, useEffect, useCallback } from "react";
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
  category_id?: string;
}

interface ForumNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
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
  const [activeTab, setActiveTab] = useState<"orders" | "reviews" | "forum" | "notifications" | "edit">("orders");
  const [notifications, setNotifications] = useState<ForumNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const fetchNotifs = useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/forum/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data ?? []);
      }
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifs();
    }
  }, [activeTab, fetchNotifs]);

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/forum/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      }
    } catch {
      // silent
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
          💬 Riwayat Thread ({threads.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "notifications" ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
          }`}
        >
          <span>🔔 Notifikasi Forum</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white">
              {unreadCount}
            </span>
          )}
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

      {/* Tab Content: Riwayat Thread Forum yang Dibuat User */}
      {activeTab === "forum" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-foreground">Daftar Thread Diskusi Anda</h3>
            <Link href="/forum/new" className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-secondary transition">
              + Buat Thread Baru
            </Link>
          </div>

          {threads.length === 0 ? (
            <div className="p-8 text-center bg-surface-2/40 border border-dashed border-border rounded-2xl">
              <p className="text-sm text-muted">Anda belum pernah membuat thread diskusi di forum.</p>
              <Link href="/forum/new" className="inline-block mt-3 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold">
                Mulai Diskusi Sekarang
              </Link>
            </div>
          ) : (
            threads.map((t) => (
              <div key={t.id} className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-accent transition">
                <div className="min-w-0 flex-1">
                  <Link href={`/forum/all/${t.id}`} className="font-bold text-foreground hover:text-accent text-sm line-clamp-1">
                    {t.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-tertiary mt-1">
                    <span>💬 {t.reply_count} balasan</span>
                    <span>· {(t.created_at ?? "").slice(0, 10)}</span>
                    {t.is_locked && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/forum/all/${t.id}`} className="shrink-0 px-3.5 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-white transition">
                  Buka Thread →
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Notifikasi Forum & Balasan Diskusi */}
      {activeTab === "notifications" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-foreground">Notifikasi Balasan &amp; Komunitas</h3>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-accent font-semibold hover:underline"
              >
                Tandai Semua Sudah Dibaca
              </button>
            )}
          </div>

          {notifLoading ? (
            <div className="p-8 text-center text-sm text-tertiary">Memuat notifikasi...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center bg-surface-2/40 border border-dashed border-border rounded-2xl">
              <p className="text-sm text-muted">Belum ada notifikasi forum untuk Anda.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`border rounded-2xl p-4 flex items-center justify-between gap-3 transition ${
                  n.is_read
                    ? "bg-surface border-border opacity-75"
                    : "bg-blue-50/50 border-blue-200 shadow-sm"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🔔</span>
                    <p className="font-bold text-foreground text-xs">{n.title}</p>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  {n.body && <p className="text-xs text-muted mt-0.5 line-clamp-1">{n.body}</p>}
                  <span className="text-[10px] text-tertiary mt-1 block">{(n.created_at ?? "").slice(0, 16).replace("T", " ")}</span>
                </div>
                {n.link && (
                  <Link
                    href={n.link}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-secondary transition"
                  >
                    Buka
                  </Link>
                )}
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
