"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Profile {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (username.trim().length < 3) {
      setError("Username minimal 3 karakter.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), bio: bio.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan profil.");
        setLoading(false);
        return;
      }
      router.refresh();
      setLoading(false);
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-600">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="ep-username" className="block text-sm font-medium text-muted mb-1.5">
          Username
        </label>
        <input
          id="ep-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="ep-bio" className="block text-sm font-medium text-muted mb-1.5">
          Bio
        </label>
        <textarea
          id="ep-bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Ceritakan tentang dirimu..."
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-accent hover:bg-accent-secondary text-white font-semibold transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
