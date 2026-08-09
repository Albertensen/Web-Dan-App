import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

interface ComponentRow {
  id: string;
  name: string;
  brand: string | null;
  component_type: string;
  socket: string | null;
  specs: Record<string, unknown>;
  component_prices?: { price: number; source: string; fetched_at: string }[];
}

// Bobot alokasi budget per use case (% dari total)
const BUDGET_ALLOCATION: Record<string, Record<string, number>> = {
  gaming: { cpu: 0.22, gpu: 0.35, ram: 0.08, storage: 0.08, motherboard: 0.09, psu: 0.07, case: 0.06, cooler: 0.05 },
  productivity: { cpu: 0.3, gpu: 0.15, ram: 0.15, storage: 0.12, motherboard: 0.1, psu: 0.07, case: 0.06, cooler: 0.05 },
  "content-creator": { cpu: 0.28, gpu: 0.25, ram: 0.14, storage: 0.12, motherboard: 0.09, psu: 0.07, case: 0.05, cooler: 0.05 },
  budget: { cpu: 0.25, gpu: 0.3, ram: 0.1, storage: 0.08, motherboard: 0.1, psu: 0.07, case: 0.06, cooler: 0.04 },
};

// Peringkat performa per tier (untuk bottleneck check)
const CPU_TIER: Record<string, number> = {
  "Ryzen 9 7950X": 5, "Core i9-14900K": 5, "Ryzen 7 7800X3D": 4, "Core i7-14700K": 4,
  "Ryzen 5 7600": 3, "Core i5-13600K": 3, "Ryzen 5 7500F": 2, "Ryzen 5 5600": 2,
};
const GPU_TIER: Record<string, number> = {
  "RTX 4090 24GB": 5, "RTX 4080 Super 16GB": 5, "RTX 4070 Super 12GB": 4, "RX 7800 XT 16GB": 4,
  "RTX 4060 8GB": 2, "RX 7600 8GB": 2,
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const useCase = body?.useCase || "gaming";
  const budget = Number(body?.budget) || 15000000;

  if (!["gaming", "productivity", "content-creator", "budget"].includes(useCase)) {
    return NextResponse.json({ error: "useCase tidak valid" }, { status: 400 });
  }
  if (budget < 3000000) {
    return NextResponse.json({ error: "Budget minimal Rp 3.000.000" }, { status: 400 });
  }

  const allocation = BUDGET_ALLOCATION[useCase];

  // Fetch semua komponen + harga terbaru
  const { data, error } = await supabase
    .from("pc_components")
    .select("id, name, brand, component_type, socket, specs, component_prices(price, source, fetched_at)");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as ComponentRow[];

  const comps = rows.map((c) => {
    const prices = c.component_prices ?? [];
    const latest = prices.length > 0 ? prices[0] : null;
    return { ...c, price: latest?.price ?? 0 };
  });

  const byType = (t: string) => comps.filter((c) => c.component_type === t && c.price > 0).sort((a, b) => a.price - b.price);

  // Pilih 1 terbaik per tipe sesuai alokasi budget
  const pick = (type: string, extra?: (c: ComponentRow & { price: number }) => boolean) => {
    const list = byType(type);
    if (list.length === 0) return null;
    const filtered = extra ? list.filter(extra) : list;
    if (filtered.length === 0) return null;
    const maxPrice = budget * allocation[type];
    const affordable = filtered.filter((c) => c.price <= maxPrice);
    return affordable.length > 0 ? affordable[affordable.length - 1] : filtered[0];
  };

  // Urutan: CPU → motherboard (cocok socket) → RAM (cocok mobo socket) → GPU → sisanya
  const build: Record<string, ComponentRow & { price: number } | null> = {};
  build.cpu = pick("cpu");
  build.motherboard = pick("motherboard", (m) => !build.cpu?.socket || m.socket === build.cpu.socket);
  if (build.motherboard) {
    const moboSocket = build.motherboard.socket;
    const ramTypes = moboSocket === "AM5" ? ["DDR5"] : moboSocket === "LGA1700" ? ["DDR4", "DDR5"] : ["DDR4", "DDR5"];
    build.ram = pick("ram", (r) => ramTypes.includes((r.specs as Record<string, unknown>).type as string));
  } else {
    build.ram = pick("ram");
  }
  build.gpu = pick("gpu");
  build.storage = pick("storage");
  build.psu = pick("psu");
  build.case = pick("case");
  build.cooler = pick("cooler");

  const parts = Object.values(build).filter(Boolean) as typeof comps;
  const total = parts.reduce((sum, p) => sum + p.price, 0);

  // Bottleneck check: CPU tier vs GPU tier
  let bottleneck: string | null = null;
  if (build.cpu && build.gpu) {
    const ct = CPU_TIER[build.cpu.name as string] ?? 2;
    const gt = GPU_TIER[build.gpu.name as string] ?? 2;
    if (gt - ct >= 2) {
      bottleneck = `CPU ${build.cpu.name} kurang seimbang dengan GPU ${build.gpu.name} — GPU jadi bottleneck di gaming. Pertimbangkan naik tier CPU atau turun GPU.`;
    } else if (ct - gt >= 2) {
      bottleneck = `GPU ${build.gpu.name} jadi bottleneck di gaming — CPU ${build.cpu.name} terlalu tinggi untuk GPU ini.`;
    } else {
      bottleneck = null;
    }
  }

  // Compatibility check
  const issues: string[] = [];
  if (build.cpu && build.motherboard) {
    if (build.cpu.socket && build.motherboard.socket && build.cpu.socket !== build.motherboard.socket) {
      issues.push(`Socket tidak cocok: CPU ${build.cpu.socket} vs Motherboard ${build.motherboard.socket}`);
    }
  }
  if (build.ram && build.motherboard) {
    const ramSpecs = build.ram.specs as Record<string, unknown>;
    const ramType = typeof ramSpecs.type === "string" ? ramSpecs.type : null;
    // Socket motherboard → tipe RAM yang didukung
    const moboSocket = build.motherboard.socket;
    const moboRamTypes = moboSocket === "AM5" ? ["DDR5"] : moboSocket === "LGA1700" ? ["DDR4", "DDR5"] : null;
    if (ramType && moboRamTypes && !moboRamTypes.includes(ramType)) {
      issues.push(`Tipe RAM tidak cocok: ${ramType} vs motherboard ${moboSocket} (mendukung ${moboRamTypes.join("/")})`);
    }
  }

  return NextResponse.json({
    useCase,
    budget,
    build: {
      cpu: build.cpu?.name ?? null,
      gpu: build.gpu?.name ?? null,
      ram: build.ram?.name ?? null,
      storage: build.storage?.name ?? null,
      motherboard: build.motherboard?.name ?? null,
      psu: build.psu?.name ?? null,
      case: build.case?.name ?? null,
      cooler: build.cooler?.name ?? null,
    },
    total,
    within_budget: total <= budget,
    bottleneck,
    compatibility_issues: issues,
    parts: parts.map((p) => ({ id: p.id, name: p.name, type: p.component_type, price: p.price })),
  });
}
