"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/forum/notifications");
      if (res.ok) {
        const json = await res.json();
        setItems(json.data ?? []);
      }
    } catch {
      // silent — guest
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = items.filter((n) => !n.is_read).length;

  const markAll = async () => {
    await fetch("/api/forum/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setItems(items.map((n) => ({ ...n, is_read: true })));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}j`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-muted hover:text-accent transition"
        aria-label="Notifikasi"
      >
        <Bell size={16} className="inline mr-1" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-surface border border-slate-300 rounded-xl shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-300">
            <span className="text-sm font-semibold text-foreground">Notifikasi</span>
            {unread > 0 && (
              <button onClick={markAll} className="text-xs text-accent hover:text-accent">
                Tandai semua dibaca
              </button>
            )}
          </div>

          {loading ? (
            <p className="p-4 text-sm text-slate-500 text-center">Memuat...</p>
          ) : items.length === 0 ? (
            <p className="p-4 text-sm text-slate-500 text-center">Belum ada notifikasi</p>
          ) : (
            items.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "#"}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 border-b border-slate-300/50 hover:bg-surface-2/60 transition ${
                  n.is_read ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{n.title}</span>
                  <span className="text-[10px] text-slate-500 flex-shrink-0">{formatTime(n.created_at)}</span>
                </div>
                {n.body && <p className="text-xs text-tertiary mt-1 line-clamp-2">{n.body}</p>}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
