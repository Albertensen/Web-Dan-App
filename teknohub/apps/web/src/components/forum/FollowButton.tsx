"use client";

import { useState, useEffect } from "react";

interface FollowButtonProps {
  targetType: "user" | "thread";
  targetId: string;
}

export default function FollowButton({ targetType, targetId }: FollowButtonProps) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/forum/follows/status?target_type=${targetType}&target_id=${targetId}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.data) setFollowing(j.data.following);
      })
      .catch(() => {});
  }, [targetType, targetId]);

  const toggle = async () => {
    setLoading(true);
    setError("");
    try {
      const method = following ? "DELETE" : "POST";
      const url = following
        ? `/api/forum/follows?target_type=${targetType}&target_id=${targetId}`
        : "/api/forum/follows";
      const res = await fetch(url, {
        method,
        headers: following ? {} : { "Content-Type": "application/json" },
        body: following ? undefined : JSON.stringify({ target_type: targetType, target_id: targetId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal");
        return;
      }
      setFollowing(!following);
    } catch {
      setError("Gagal terhubung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={toggle}
        disabled={loading}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition disabled:opacity-50 ${
          following
            ? "bg-slate-800 text-slate-300 border-slate-600"
            : "bg-blue-500/20 text-blue-300 border-blue-500/50 hover:bg-blue-500/30"
        }`}
      >
        {loading ? "..." : following ? "✓ Mengikuti" : "+ Follow"}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
