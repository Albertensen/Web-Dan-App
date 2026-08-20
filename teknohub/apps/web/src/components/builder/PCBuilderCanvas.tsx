"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { computeWattage, type BuildPartLite } from "@/lib/builderEstimator";
import { Cpu, HardDrive, Disc, Zap, Fan, Sparkles, Check, Layers } from "lucide-react";

type RgbTheme = "cyan" | "violet" | "emerald" | "crimson" | "rainbow";

const RGB_THEMES: { id: RgbTheme; label: string; glow: string; color: string }[] = [
  { id: "cyan", label: "Royal Blue", glow: "shadow-[0_0_25px_rgba(37,99,235,0.4)] border-blue-500/60", color: "#2563eb" },
  { id: "violet", label: "Cyber Violet", glow: "shadow-[0_0_25px_rgba(139,92,246,0.4)] border-purple-400/60", color: "#8b5cf6" },
  { id: "emerald", label: "Matrix Green", glow: "shadow-[0_0_25px_rgba(16,185,129,0.4)] border-emerald-400/60", color: "#10b981" },
  { id: "crimson", label: "Rogue Red", glow: "shadow-[0_0_25px_rgba(239,68,68,0.4)] border-red-400/60", color: "#ef4444" },
  { id: "rainbow", label: "Rainbow RGB", glow: "shadow-[0_0_30px_rgba(236,72,153,0.4)] border-pink-400/60", color: "linear-gradient(45deg, #ef4444, #3b82f6, #10b981)" },
];

export default function PCBuilderCanvas() {
  const selected = useBuilderStore((s) => s.selectedComponents);
  const [theme, setTheme] = useState<RgbTheme>("cyan");

  const partsForWattage: BuildPartLite[] = Object.entries(selected)
    .filter(([, name]) => Boolean(name))
    .map(([type, name]) => ({
      id: type,
      name: name as string,
      type,
      price: 0,
    }));

  const wattage = computeWattage(partsForWattage);
  const activeTheme = RGB_THEMES.find((t) => t.id === theme) || RGB_THEMES[0];

  const partCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="bg-gradient-to-br from-[#0F2A4A] via-[#162F56] to-[#1E3A8A] rounded-3xl p-6 shadow-xl border border-blue-400/20 text-white space-y-6">
      {/* Top Bar: Info Rakitan + RGB Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🖥️</span>
            <h3 className="font-extrabold text-base sm:text-lg text-white">Visualisasi Casing &amp; Komponen</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Komponen terpasang: <span className="text-accent font-bold">{partCount}/8 Part</span> · Estimasi Daya: <span className="text-yellow-400 font-bold">{wattage.load}W</span>
          </p>
        </div>

        {/* RGB Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-full p-1.5 self-start sm:self-auto">
          <span className="text-[10px] text-slate-400 font-bold px-2 flex items-center gap-1">
            <Sparkles size={12} className="text-accent" /> RGB:
          </span>
          {RGB_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              title={t.label}
              className={`w-6 h-6 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                theme === t.id ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950" : "opacity-70 hover:opacity-100"
              }`}
              style={{ background: t.color }}
            />
          ))}
        </div>
      </div>

      {/* CHASSIS CANVAS (Tempered Glass PC Simulation) */}
      <div className={`relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 transition-all duration-500 overflow-hidden flex flex-col justify-between p-4 sm:p-6 ${activeTheme.glow}`}>
        {/* Top Exhaust Fans */}
        <div className="flex justify-around items-center opacity-60">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Fan size={16} className="animate-spin text-blue-400 duration-1000" /> Exhaust Top 1
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Fan size={16} className="animate-spin text-blue-400 duration-1000" /> Exhaust Top 2
          </div>
        </div>

        {/* Main Chamber: Motherboard Tray + Slots */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 my-auto h-full max-h-[70%]">
          {/* Motherboard & CPU/Cooler Area */}
          <div className={`col-span-8 rounded-xl p-3 sm:p-4 border transition-all flex flex-col justify-between ${
            selected.motherboard ? "bg-slate-900/80 border-slate-700 shadow-inner" : "bg-slate-900/30 border-dashed border-slate-800"
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Layers size={12} /> Motherboard
                </span>
                <p className="text-xs font-extrabold text-slate-200 line-clamp-1">
                  {selected.motherboard ? selected.motherboard : "Slot Motherboard Kosong"}
                </p>
              </div>

              {/* RAM Slots */}
              <div className="flex gap-1.5">
                <div className={`w-2.5 h-12 rounded-sm border transition-all ${
                  selected.ram ? "bg-accent border-blue-400 shadow-[0_0_8px_#2563eb]" : "bg-slate-800 border-slate-700"
                }`} title={selected.ram || "Slot RAM 1"} />
                <div className={`w-2.5 h-12 rounded-sm border transition-all ${
                  selected.ram ? "bg-accent border-blue-400 shadow-[0_0_8px_#2563eb]" : "bg-slate-800 border-slate-700"
                }`} title={selected.ram || "Slot RAM 2"} />
              </div>
            </div>

            {/* CPU Socket & Cooler Fan */}
            <div className="my-2 flex items-center gap-3">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                selected.cooler ? "bg-gradient-to-tr from-blue-950 to-slate-900 border-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.5)]" : selected.cpu ? "bg-slate-800 border-slate-600" : "border-dashed border-slate-800 bg-slate-900/20"
              }`}>
                {selected.cooler ? (
                  <Fan size={24} className="animate-spin text-blue-300 duration-700" />
                ) : (
                  <Cpu size={20} className={selected.cpu ? "text-accent" : "text-slate-600"} />
                )}
                <span className="text-[8px] font-bold text-slate-400 mt-1">
                  {selected.cooler ? "Cooler" : selected.cpu ? "CPU Ready" : "Socket"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-white truncate">{selected.cpu || "CPU Belum Dipilih"}</p>
                <p className="text-[10px] text-slate-400 truncate">{selected.cooler || "Cooler Bawaan / Belum Terpasang"}</p>
              </div>
            </div>

            {/* GPU / VGA PCIe Slot */}
            <div className={`rounded-xl p-2.5 border transition-all flex items-center justify-between ${
              selected.gpu ? "bg-slate-800/90 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-slate-900/30 border-dashed border-slate-800"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <Disc size={18} className={selected.gpu ? "text-blue-400" : "text-slate-600"} />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">PCIe Slot (GPU)</span>
                  <p className="text-xs font-bold text-white truncate">{selected.gpu || "Belum Ada GPU Terpasang"}</p>
                </div>
              </div>
              {selected.gpu && <Check size={14} className="text-emerald-400 shrink-0 ml-2" />}
            </div>
          </div>

          {/* Front Intake Fans & Storage Drives */}
          <div className="col-span-4 flex flex-col justify-between gap-2 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <HardDrive size={12} /> Storage (SSD/HDD)
              </span>
              <p className="text-[11px] font-semibold text-slate-200 truncate mt-0.5">
                {selected.storage || "Slot M.2 / SATA"}
              </p>
            </div>

            {/* Front Intake Fans */}
            <div className="space-y-1.5 opacity-70">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                <Fan size={14} className="animate-spin text-blue-400 duration-1000" /> Front Intake 1
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                <Fan size={14} className="animate-spin text-blue-400 duration-1000" /> Front Intake 2
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Shroud: PSU Basement */}
        <div className={`rounded-xl p-2.5 sm:p-3 border transition-all flex items-center justify-between ${
          selected.psu ? "bg-slate-900 border-slate-700" : "bg-slate-950 border-dashed border-slate-800"
        }`}>
          <div className="flex items-center gap-2">
            <Zap size={16} className={selected.psu ? "text-yellow-400" : "text-slate-600"} />
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Power Supply Unit</span>
              <p className="text-xs font-bold text-white">{selected.psu || "PSU Shroud Kosong"}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400">{wattage.recommended}W Recom.</span>
        </div>
      </div>
    </div>
  );
}
