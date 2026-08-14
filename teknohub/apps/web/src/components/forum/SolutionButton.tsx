"use client";

import { useState } from "react";

interface SolutionButtonProps {
  replyId: string;
  isSolution: boolean;
  onMarked: () => void;
}

export default function SolutionButton({ replyId, isSolution, onMarked }: SolutionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/forum/replies/${replyId}/solution`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal menandai solusi");
        return;
      }
      onMarked();
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={loading || isSolution}
        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
          isSolution
            ? "bg-green-600/20 text-green-400 border-green-700 cursor-default"
            : "bg-surface-2 text-muted border-slate-300 hover:border-green-600 hover:text-green-400"
        } disabled:opacity-50`}
      >
        {isSolution ? "✅ Solusi" : loading ? "Menandai..." : "✓ Tandai Solusi"}
      </button>
      {error && <span className="text-red-600 text-xs">{error}</span>}
    </div>
  );
}
