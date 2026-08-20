"use client";

import { useState } from "react";
import Link from "next/link";
import SaveBuildButton from "./SaveBuildButton";
import RequestQuoteModal from "./builder/RequestQuoteModal";
import PCBuilderCanvas from "./builder/PCBuilderCanvas";

import { useBuilderStore, type SelectedComponents, type RecommendedBuild } from "@/store/builderStore";
import { Bot, Gamepad2, Rocket, Wrench, Clapperboard, Briefcase, Banknote, AlertTriangle, ShoppingCart, Check, Link2, FileText, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { parsePsuWatt, checkClearances } from "@/lib/builderEstimator";

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


// icon map
const USE_CASES_ICON: Record<string, React.ReactNode> = {
  gaming: <Gamepad2 size={16} />, productivity: <Briefcase size={16} />, "content-creator": <Clapperboard size={16} />, budget: <Banknote size={16} />,
};
const USE_CASES = [
  { value: "gaming", label: "Gaming", desc: "FPS tinggi, 1440p/4K" },
  { value: "productivity", label: "Productivity", desc: "Office, coding, multitask" },
  { value: "content-creator", label: "Content Creator", desc: "Video editing, streaming, 3D" },
  { value: "budget", label: "Budget", desc: "Hemat, value terbaik" },
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

function priceOf(result: RecommendResult | null, type: string): number {
  return result?.parts.find((rp) => rp.type === type)?.price ?? 0;
}

export default function PcBuilder() {
  const [useCase, setUseCase] = useState("gaming");
  const [budget, setBudget] = useState(15000000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [error, setError] = useState("");
  // Store: single source of truth (sync dari AI chat / recommend button)
  const store = useBuilderStore();
  const { selectedComponents, totalEstimasi, applyRecommendation, updateBudget } = store;
  const router = useRouter();
  const addItem = useCartStore((s) => s.add);
  const [buyToast, setBuyToast] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const [addonRakit, setAddonRakit] = useState(true);
  const [bomOpen, setBomOpen] = useState(false);

  const toast = (fn: (v: boolean) => void) => {
    fn(true);
    setTimeout(() => fn(false), 2500);
  };

  const shareBuild = async () => {
    if (!hasAnyComponent) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast(setShareToast);
  };

  const exportSummary = async () => {
    if (!hasAnyComponent) return;
    const lines = COMP_TYPE_LABELS
      .filter(([key]) => selectedComponents[key])
      .map(([labelKey, label]) => `- ${label}: ${selectedComponents[labelKey]}`);
    const text = ["Rakitan PC TeknoHub", ...lines, `Total Estimasi: ${formatIDR(totalEstimasi)}`].join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast(setExportToast);
  };

  const RAKIT_FEE = 150000;
  const buyAll = () => {
    const list = partsFromStore.filter((pp) => pp && pp.id);
    if (list.length === 0) return;
    list.forEach((pp) => addItem({ id: pp.id, name: pp.name, price: priceOf(result, pp.type), image_url: null, slug: pp.name, stock: 99 }));
    if (addonRakit) {
      addItem({ id: "ai-jasa-rakit", name: "Jasa Rakit & Cable Management", price: RAKIT_FEE, image_url: null, slug: "jasa-rakit-cable-management", stock: 999 });
    }
    setBuyToast(true);
    setTimeout(() => router.push("/shop/cart"), 700);
  };

  const hasAnyComponent = Object.values(selectedComponents).some(Boolean);
  // Estimasi daya per tipe komponen (approksimasi umum)
  const TYPE_WATT: Record<string, number> = { cpu: 105, gpu: 250, ram: 15, storage: 8, motherboard: 60, psu: 0, casing: 0, cooler: 10 };
  const estWattage = COMP_TYPE_LABELS.reduce((acc, [key]) => (selectedComponents[key] ? acc + (TYPE_WATT[key] ?? 0) : acc), 0);
  const wattStatus = (() => {
    const psu = estWattage <= 0 ? 0 : Math.ceil((estWattage * 1.35) / 50) * 50;
    const pct = estWattage <= 0 ? 0 : Math.min(100, (estWattage / 650) * 100);
    if (estWattage <= 0) return { pct: 0, bar: "bg-slate-600", dot: "text-slate-400", label: "Belum ada komponen", psu: 0 };
    if (estWattage < 500) return { pct, bar: "bg-emerald-500", dot: "text-emerald-400", label: "Aman", psu };
    if (estWattage < 650) return { pct, bar: "bg-amber-500", dot: "text-amber-400", label: "Perhatian", psu };
    return { pct, bar: "bg-red-500", dot: "text-red-400", label: "Butuh PSU besar", psu };
  })();
  const psuWatt = selectedComponents.psu ? parsePsuWatt(selectedComponents.psu) : null;
  const psuWarn = psuWatt ? parseInt(String(psuWatt)) < estWattage * 1.2 : false;
  const clearance = checkClearances(
    selectedComponents.motherboard,
    selectedComponents.gpu,
    selectedComponents.cooler,
    selectedComponents.casing
  );
  const calcGrand = totalEstimasi + (addonRakit ? RAKIT_FEE : 0);



  // parts utk SaveBuildButton dari store
  const partsFromStore = COMP_TYPE_LABELS
    .filter(([key]) => selectedComponents[key])
    .map(([key]) => ({
      id: `ai-${key}`,
      name: selectedComponents[key] ?? "",
      type: key,
      price: 0,
    }));


  // Preset Budget Tier: set use case, budget, lalu langsung rekomendasi
  const presets = [
    { label: "💰 Budget Hemat (Rp 8-10 Juta)", useCase: "budget", budget: 9000000 },
    { label: "🎮 Gaming 1440p (Rp 15-18 Juta)", useCase: "gaming", budget: 17000000 },
    { label: "🚀 AI & 4K Creator (Rp 25-30 Juta)", useCase: "content-creator", budget: 28000000 },
  ];
  const applyPreset = async (p: { useCase: string; budget: number }) => {
    setUseCase(p.useCase);
    setBudget(p.budget);
    updateBudget(p.budget);
    recommend(p.useCase, p.budget);
  };

  const recommend = async (overrideUc?: string, overrideBg?: number) => {
    const activeUc = overrideUc ?? useCase;
    const activeBg = overrideBg ?? budget;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pc-builder/recommend?stream=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase: activeUc, budget: activeBg }),
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
        updateBudget(activeBg);
        setResult({
          useCase: activeUc,
          budget: activeBg,
          build: {},
          total: partsData.total,
          within_budget: partsData.total <= activeBg,
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Visualisasi Chassis PC Interaktif */}
      <PCBuilderCanvas />
      <div className="bg-surface-2/60 p-6 rounded-xl shadow-lg border border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Rakit PC dengan AI</h2>

        {/* Preset Budget Tier Instan */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Preset Cepat</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                disabled={loading}
                className={`p-3 rounded-xl border text-left transition ${
                  budget === p.budget
                    ? "border-accent bg-accent-dim text-accent"
                    : "border-border bg-surface-2 hover:border-accent"
                }`}
              >
                <div className="text-sm font-bold">{p.label}</div>
                <div className="text-[11px] text-tertiary mt-0.5">{p.useCase === "budget" ? "Komponen gaming hemat" : p.useCase === "gaming" ? "Target performa tinggi" : "Komponen enthusiast"}</div>
              </button>
            ))}
          </div>
        </div>


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
                  : "border-border bg-surface-2 hover:border-border"
              }`}
            >
              <div className="font-medium">{USE_CASES_ICON[uc.value]}
                {uc.label}</div>
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
          onClick={() => recommend()}
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Menghitung..." : <span className="inline-flex items-center gap-1.5"><Rocket size={16} /> Buat Rekomendasi</span>}
        </button>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          {/* AI analysis */}
          <div className="bg-surface-2/60 p-6 rounded-xl shadow-lg border border-border">
            <h4 className="font-semibold text-foreground mb-3">Analisis AI</h4>
            {result.bottleneck ? (
              <div className="flex gap-2 text-sm mb-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
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
                <Wrench size={16} className="mt-1 shrink-0" />
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
            <span className="inline-flex items-center gap-1.5"><Bot size={16} /> Build Summary</span>
            {hasAnyComponent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                DIREKOMENDASIKAN AI
              </span>
            )}
          </h3>
          {hasAnyComponent && (
            <Link href="/admin/quotes" className="text-xs text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
              Minta Penawaran →
            </Link>
          )}
        </div>

        {!hasAnyComponent ? (
          <p className="text-sm text-slate-400">
            Mulai chat dengan AI untuk mendapat rekomendasi build — atau klik{" "}
            <span className="text-cyan-300 font-medium"><span className="inline-flex items-center gap-1.5"><Rocket size={16} /> Buat Rekomendasi</span></span>.
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
            {/* Wattage estimator + PSU warning */}
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">⚡ Estimasi Konsumsi Daya (TDP)</span>
                <span className="font-bold text-white">{estWattage}W</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${wattStatus.bar}`} style={{ width: `${wattStatus.pct}%` }} />
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                <span className={wattStatus.dot} /> {wattStatus.label} · Disarankan PSU: Minimal {wattStatus.psu}W 80+
              </div>
              {psuWarn && (
                <div className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold text-orange-400">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  <span>Kapasitas PSU Kurang — total TDP + 20% headroom melebihi PSU terpilih ({psuWatt}W). Naikkan PSU ke ≥{wattStatus.psu}W.</span>
                </div>
              )}
            </div>

            {/* Physical clearance & form factor */}
            {clearance && (
              <div className="mt-2 space-y-1 text-[11px]">
                {clearance.formFactor && (
                  <p className={clearance.formFactor.ok ? "text-emerald-400" : "text-orange-400"}>{clearance.formFactor.msg}</p>
                )}
                {clearance.gpuLength && (
                  <p className={clearance.gpuLength.ok ? "text-emerald-400" : "text-orange-400"}>{clearance.gpuLength.msg}</p>
                )}
                {clearance.coolerHeight && (
                  <p className={clearance.coolerHeight.ok ? "text-emerald-400" : "text-orange-400"}>{clearance.coolerHeight.msg}</p>
                )}
                {clearance.all && partsFromStore.length > 0 && (
                  <p className="text-emerald-400">✅ Dimensi Fisik Pas & form factor kompatibel.</p>
                )}
              </div>
            )}
            <div className="mt-4 flex gap-2 flex-wrap">
              <SaveBuildButton parts={partsFromStore} buildType={useCase} />
              <RequestQuoteModal buildTitle="Build Rekomendasi AI" />
            </div>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={addonRakit} onChange={(e) => setAddonRakit(e.target.checked)} className="accent-emerald-500" />
                Tambahkan Jasa Rakit &amp; Cable Management (+{formatIDR(RAKIT_FEE)})
              </label>
              <button
                onClick={buyAll}
                disabled={partsFromStore.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition disabled:opacity-50"
              >
                <ShoppingCart size={16} /> Beli Semua Komponen ({partsFromStore.length} Item) — {formatIDR(calcGrand)}
              </button>
            </div>
            {buyToast && (
              <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Check size={14} /> {partsFromStore.length} komponen ditambahkan ke keranjang — mengarahkan ke keranjang...
              </div>
            )}
            {shareToast && (
              <div className="mt-2 flex items-center gap-2 text-cyan-300 text-xs font-semibold">
                <Check size={14} /> Link rakitan disalin!
              </div>
            )}
            {exportToast && (
              <div className="mt-2 flex items-center gap-2 text-cyan-300 text-xs font-semibold">
                <Check size={14} /> Ringkasan build disalin.
              </div>
            )}
            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={shareBuild}
                disabled={!hasAnyComponent}
                className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                <Link2 size={14} /> Bagikan Rakitan
              </button>
              <button
                onClick={exportSummary}
                disabled={!hasAnyComponent}
                className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                <FileText size={14} /> Export Ringkasan
              </button>
              <button
                onClick={() => setBomOpen(true)}
                disabled={!hasAnyComponent}
                className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                <Printer size={14} /> Cetak / BOM
              </button>
            </div>
          </>
        )}
      </div>

      {/* BOM / Cetak modal */}
      {bomOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setBomOpen(false)}>
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-6 my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Bill of Materials — Estimasi Rakitan</h3>
              <button onClick={() => setBomOpen(false)} className="text-slate-500 hover:text-slate-800 font-bold">✕</button>
            </div>
            <table className="w-full text-sm border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-2 border border-slate-300">Komponen</th>
                  <th className="p-2 border border-slate-300">Produk</th>
                  <th className="p-2 border border-slate-300 text-right">Harga</th>
                </tr>
              </thead>
              <tbody>
                {partsFromStore.map((pp) => (
                  <tr key={pp.type} className="border-t border-slate-200">
                    <td className="p-2 border border-slate-300 font-medium">{TYPE_LABEL[pp.type] ?? pp.type}</td>
                    <td className="p-2 border border-slate-300">{pp.name}</td>
                    <td className="p-2 border border-slate-300 text-right">{formatIDR(priceOf(result, pp.type))}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-400 font-bold">
                  <td className="p-2" colSpan={2}>Total Estimasi</td>
                  <td className="p-2 text-right">{formatIDR(totalEstimasi)}</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-2" colSpan={2}>Estimasi Konsumsi Daya</td>
                  <td className="p-2 text-right">{estWattage}W</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-2" colSpan={2}>Budget Target</td>
                  <td className="p-2 text-right">{formatIDR(budget)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setBomOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">Tutup</button>
              <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Cetak / PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}