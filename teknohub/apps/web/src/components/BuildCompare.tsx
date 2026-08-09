"use client";

import { useState } from "react";

interface ComparePart {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface BuildSummary {
  label: string;
  total: number;
  parts: ComparePart[];
}

const TYPE_LABEL: Record<string, string> = {
  cpu: "CPU", gpu: "GPU", ram: "RAM", storage: "Storage",
  motherboard: "Motherboard", psu: "PSU", case: "Casing", cooler: "Cooler",
};

export default function BuildCompare() {
  const [builds, setBuilds] = useState<BuildSummary[]>([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addBuild = async () => {
    if (builds.length >= 3) {
      setError("Maksimal 3 build");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const useCase = ["gaming", "productivity", "content-creator"][builds.length] ?? "gaming";
      const budget = [15000000, 20000000, 25000000][builds.length] ?? 15000000;
      const res = await fetch("/api/pc-builder/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, budget }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal");
        return;
      }
      setBuilds([
        ...builds,
        {
          label: label || `${useCase} ${new Intl.NumberFormat("id-ID").format(budget)}`,
          total: json.total,
          parts: json.parts,
        },
      ]);
      setLabel("");
    } catch {
      setError("Gagal terhubung");
    } finally {
      setLoading(false);
    }
  };

  const removeBuild = (idx: number) => setBuilds(builds.filter((_, i) => i !== idx));

  // Semua tipe part yang ada di semua build
  const allTypes = Array.from(new Set(builds.flatMap((b) => b.parts.map((p) => p.type))));

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Bandingkan Build</h2>
        <p className="text-sm text-slate-400 mb-4">
          Tambahkan hingga 3 build rekomendasi untuk dibandingkan komponen per komponen.
        </p>
        <div className="flex gap-2 mb-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={`Label build ${builds.length + 1} (opsional)`}
            className="flex-1 px-4 py-2 bg-[#0a0a0f] border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-500"
          />
          <button
            onClick={addBuild}
            disabled={loading || builds.length >= 3}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "..." : `+ Tambah Build ${builds.length + 1}`}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {builds.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-400 font-medium">Komponen</th>
                {builds.map((b, i) => (
                  <th key={i} className="p-4 text-left">
                    <div className="text-white font-semibold">{b.label}</div>
                    <div className="text-xs text-slate-400 font-normal">{fmt(b.total)}</div>
                    <button onClick={() => removeBuild(i)} className="text-xs text-red-400 hover:text-red-300 mt-1">
                      ✕ Hapus
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTypes.map((type) => (
                <tr key={type} className="border-b border-slate-800">
                  <td className="p-4 text-slate-400 font-medium whitespace-nowrap">{TYPE_LABEL[type] ?? type}</td>
                  {builds.map((b, i) => {
                    const part = b.parts.find((p) => p.type === type);
                    return (
                      <td key={i} className="p-4 text-slate-200">
                        {part ? (
                          <>
                            <div>{part.name}</div>
                            <div className="text-xs text-slate-500">{fmt(part.price)}</div>
                          </>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-4 text-slate-400 font-medium">Total</td>
                {builds.map((b, i) => (
                  <td key={i} className="p-4 font-bold text-blue-400">{fmt(b.total)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
