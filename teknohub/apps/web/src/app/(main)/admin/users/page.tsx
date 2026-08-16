"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "member" | "moderator" | "admin";
  reputation: number;
  is_banned: boolean;
  banned_until: string | null;
  created_at: string;
}

const ROLES = ["all", "member", "moderator", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [banDuration, setBanDuration] = useState("7");
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?role=${roleFilter}`);
      const json = await res.json();
      if (res.ok) setUsers(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleRoleChange(user: UserProfile, newRole: string) {
    if (!confirm(`Ubah role @${user.username} menjadi ${newRole}?`)) return;
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, role: newRole }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, role: newRole as UserProfile["role"] } : u)));
    }
  }

  async function handleBanSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    try {
      const isPermanent = banDuration === "permanent";
      const days = isPermanent ? null : Number(banDuration);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          is_banned: true,
          banned_days: days,
        }),
      });
      if (res.ok) {
        setSelectedUser(null);
        fetchUsers();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleUnban(user: UserProfile) {
    if (!confirm(`Cabut sanksi Ban untuk @${user.username}?`)) return;
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, is_banned: false }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, is_banned: false, banned_until: null } : u)));
    }
  }

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    return u.username.toLowerCase().includes(s) || (u.full_name ?? "").toLowerCase().includes(s);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manajemen Pengguna &amp; Role</h1>
          <p className="text-xs text-tertiary">Kelola hak akses pengguna, reputasi, dan sanksi Ban/Suspend</p>
        </div>
        {/* Role Filter */}
        <div className="flex items-center gap-1">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                roleFilter === r
                  ? "bg-accent text-white"
                  : "bg-surface border border-slate-300 text-muted hover:border-accent"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari username / nama lengkap..."
          className="w-full sm:max-w-md px-4 py-2 text-sm bg-surface border border-slate-300 rounded-xl"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-tertiary">Memuat data pengguna...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-tertiary text-sm">Tidak ada pengguna ditemukan.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-2 text-xs text-tertiary uppercase border-b border-slate-300">
                <tr>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Reputasi</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Terdaftar</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <Image src={u.avatar_url} alt={u.username} width={36} height={36} sizes="36px" className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <span className="w-9 h-9 rounded-full bg-accent text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {u.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">@{u.username}</p>
                          <p className="text-xs text-tertiary truncate">{u.full_name || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : u.role === "moderator"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : "bg-surface-2 text-muted border-slate-300"
                        }`}
                      >
                        <option value="member">Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3 text-center font-bold text-foreground">
                      {u.reputation}
                    </td>
                    <td className="p-3">
                      {u.is_banned ? (
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                            Banned
                          </span>
                          {u.banned_until && (
                            <p className="text-[10px] text-tertiary mt-0.5">
                              s/d {u.banned_until.slice(0, 10)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800 border border-green-300">
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-tertiary whitespace-nowrap">
                      {(u.created_at ?? "").slice(0, 10)}
                    </td>
                    <td className="p-3 text-center">
                      {u.is_banned ? (
                        <button
                          type="button"
                          onClick={() => handleUnban(u)}
                          className="px-3 py-1 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 text-xs font-semibold"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold"
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Ban */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-300">
              <h2 className="font-bold text-foreground text-lg">Sanksi Ban Pengguna</h2>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-tertiary mb-4">
              Terapkan sanksi penangguhan akun untuk <b className="text-foreground">@{selectedUser.username}</b>.
            </p>

            <form onSubmit={handleBanSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Durasi Penangguhan</label>
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                  className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                >
                  <option value="3">3 Hari</option>
                  <option value="7">7 Hari (1 Minggu)</option>
                  <option value="30">30 Hari (1 Bulan)</option>
                  <option value="permanent">Permanen</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 text-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? "Memproses..." : "Terapkan Ban"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
