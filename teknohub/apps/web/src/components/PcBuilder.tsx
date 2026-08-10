"use client";

import { useState } from "react";
import Link from "next/link";
import SaveBuildButton from "./SaveBuildButton";
import RequestQuoteModal from "./builder/RequestQuoteModal";
import { useBuilderStore, type SelectedComponents, type RecommendedBuild } from "@/store/builderStore";

interface BuildPart {
  id: string;
  name: string;
  type: string;
  price: number;
}

interface RecommendResult {
  useCase: string;
  budget: number;
  build: Record<string, string | null>;
  total: number;
  within_budget: boolean;
  bottleneck: string | null;
  compatibility_issues: string[];
  parts: BuildPart[];
}

const USE_CASES = [
  { value: "gaming", label: "🎮 Gaming", desc: "FPS tinggi, 1440p/4K" },
  { value: "productivity", label: "💼 Productivity", desc: "Office, coding, multitask" },
  { value: "content-creator", label: "🎬 Content Creator", desc: "Video editing, streaming, 3D" },
  { value: "budget", label: "💰 Budget", desc: "Hemat, value terbaik" },
];

const TYPE_LABEL: Record<string, string> = {
  cpu: "CPU", gpu: "GPU", ram: "RAM", storage: "Storage",
  motherboard: "Motherboard", psu: "PSU", case: "Casing", cooler: "Cooler",
};

const COMP_TYPE_LABELS: [keyof SelectedComponents, string][] = [
  ["cpu", "CPU"],
  ["gpu", "GPU"],
  ["ram", "RAM"],
  ["storage", "Storage"],
  ["psu", "PSU"],
  ["motherboard", "Motherboard"],
  ["casing", "Casing"],
  ["cooler", "Cooler"],
];

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default function PcBuilder() {
  const [useCase, setUseCase] = useState("gaming");
  const [budget, setBudget] = useState(15000000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [error, setError] = useState("");
  // Store: single source of truth (sync dari AI chat / recommend button)
  const { selectedComponents, totalEstimasi, applyRecommendation, updateBudget } = useBuilderStore();

  const hasAnyComponent = Object.values(selectedComponents).some(Boolean);

  // parts utk SaveBuildButton dari store
  const partsFromStore = COMP_TYPE_LABELS
    .filter(([key]) => selectedComponents[key])
    .map(([key]) => ({
      id: `ai-${key}`,
      name: selectedComponents[key] ?? "",
      type: key,
      price: 0,
    }));

  const recommend = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pc-builder/recommend?stream=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, budget }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Terjadi kesalahan");
        setLoading(false);
        return;
      }

      // Baca SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let analysisData: { bottleneck: string | null; compatibility_issues: string[] } | null = null;
      let partsData: { parts: BuildPart[]; total: number } | null = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const ev of events) {
          const lines = ev.split("\n");
          const dataLine = lines.find((l) => l.startsWith("data: "));
          if (!dataLine) continue;
          const payload = JSON.parse(dataLine.slice(6));
          if (payload.bottleneck !== undefined || payload.compatibility_issues) {
            analysisData = payload;
          }
          if (payload.parts) {
            partsData = payload;
          }
        }
      }
      if (partsData) {
        const rec: RecommendedBuild = {};
        const byType: Record<string, BuildPart> = {};
        for (const p of partsData.parts) byType[p.type] = p;
        if (byType.cpu) rec.cpu = byType.cpu.name;
        if (byType.gpu) rec.gpu = byType.gpu.name;
        if (byType.ram) rec.ram = byType.ram.name;
        if (byType.storage) rec.storage = byType.storage.name;
        if (byType.psu) rec.psu = byType.psu.name;
        if (byType.motherboard) rec.motherboard = byType.motherboard.name;
        if (byType.case) rec.casing = byType.case.name;
        if (byType.cooler) rec.cooler = byType.cooler.name;
        rec.totalEstimasi = partsData.total;
        // Sync ke store — single source of truth
        applyRecommendation(rec);
        updateBudget(budget);
        setResult({
          useCase,
          budget,
          build: {},
          total: partsData.total,
          within_budget: partsData.total <= budget,
          bottleneck: analysisData?.bottleneck ?? null,
          compatibility_issues: analysisData?.compatibility_issues ?? [],
          parts: partsData.parts,
        });
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface-2/60 p-6 rounded-xl shadow-lg border border-slate-300">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Rakit PC dengan AI</h2>

        {/* Step 1: use case */}
        <label className="block text-sm font-medium mb-2 text-muted">Pilih kebutuhan</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {USE_CASES.map((uc) => (
            <button
              key={uc.value}
              onClick={() => setUseCase(uc.value)}
              className={`p-3 rounded-xl border text-left transition ${
                useCase === uc.value
                  ? "border-accent bg-accent-dim text-accent"
                  : "border-slate-300 bg-surface-2 hover:border-slate-300"
              }`}
            >
              <div className="font-medium">{uc.label}</div>
              <div className="text-xs text-tertiary">{uc.desc}</div>
            </button>
          ))}
        </div>

        {/* Step 2: budget */}
        <label className="block text-sm font-medium mb-2 text-muted">
          Budget: <span className="text-accent">{formatIDR(budget)}</span>
        </label>
        <input
          type="range"
          min={3000000}
          max={50000000}
          step={1000000}
          value={budget}
          onChange={(e) => { setBudget(Number(e.target.value)); updateBudget(Number(e.target.value)); }}
          className="w-full mb-6 accent-accent"
        />

        <button
          onClick={recommend}
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-accent font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Menghitung..." : "🚀 Buat Rekomendasi"}
        </button>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          {/* Build summary (lokal — dari tombol Rekomendasi) */}
          <div className="bg-surface-2/60 p-6 rounded-xl shadow-lg border border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Build Rekomendasi</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  result.within_budget
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {result.within_budget ? "✓ Dalam budget" : "⚠ Melebihi budget"}
              </span>
            </div>

            <div className="space-y-2">
              {result.parts.map((p) => (
                <div key={p.id} className="flex justify-between text-sm py-1.5 border-b border-slate-300/50 last:border-0">
                  <span className="text-tertiary">{TYPE_LABEL[p.type] ?? p.type}</span>
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-muted font-medium">{formatIDR(p.price)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t border-slate-300">
              <span className="font-semibold text-foreground">Total</span>
              <span className={`font-bold ${result.within_budget ? "text-emerald-400" : "text-amber-400"}`}>
                {formatIDR(result.total)}
              </span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <SaveBuildButton parts={result.parts} buildType={result.useCase} />
              <RequestQuoteModal />
            </div>
          </div>

          {/* AI analysis */}
          <div className="bg-surface-2/60 p-6 rounded-xl shadow-lg border border-slate-300">
            <h4 className="font-semibold text-foreground mb-3">Analisis AI</h4>
            {result.bottleneck ? (
              <div className="flex gap-2 text-sm mb-3">
                <span>⚠️</span>
                <p className="text-amber-300">{result.bottleneck}</p>
              </div>
            ) : (
              <div className="flex gap-2 text-sm mb-3">
                <span>✅</span>
                <p className="text-emerald-300">CPU dan GPU seimbang — tidak ada bottleneck signifikan.</p>
              </div>
            )}
            {result.compatibility_issues.length > 0 ? (
              <div className="flex gap-2 text-sm">
                <span>🔧</span>
                <ul className="text-red-300 space-y-1">
                  {result.compatibility_issues.map((iss, i) => (
                    <li key={i}>{iss}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex gap-2 text-sm">
                <span>✅</span>
                <p className="text-emerald-300">Semua komponen kompatibel.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Build Summary — single source of truth (store, sync dari AI chat) ===== */}
      <div className="mt-8 bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,200,255,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            🤖 Build Summary
            {hasAnyComponent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                DIREKOMENDASIKAN AI
              </span>
            )}
          </h3>
          {hasAnyComponent && (
            <Link href="/quotes" className="text-xs text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
              Minta Penawaran →
            </Link>
          )}
        </div>

        {!hasAnyComponent ? (
          <p className="text-sm text-slate-400">
            Mulai chat dengan AI untuk mendapat rekomendasi build — atau klik{" "}
            <span className="text-cyan-300 font-medium">🚀 Buat Rekomendasi</span>.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {COMP_TYPE_LABELS.map(([key, label]) =>
                selectedComponents[key] ? (
                  <div key={key} className="flex justify-between text-sm py-1.5 border-b border-slate-800 last:border-0">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-200">{selectedComponents[key]}</span>
                  </div>
                ) : null
              )}
            </div>
            <div className="flex justify-between mt-4 pt-3 border-t border-slate-800">
              <span className="font-semibold text-white">Total Estimasi</span>
              <span className="font-bold text-cyan-300">{formatIDR(totalEstimasi)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <SaveBuildButton parts={partsFromStore} buildType={useCase} />
              <RequestQuoteModal buildTitle="Build Rekomendasi AI" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}