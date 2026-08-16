export interface BuildPartLite {
  id: string;
  name: string;
  type: string;
  price: number;
}

// --- Konsumsi daya (TDP) per tipe (approksimasi umum, Watt) ---
export const TYPE_WATT: Record<string, number> = {
  cpu: 105, gpu: 250, ram: 15, storage: 8, motherboard: 60, psu: 0, casing: 0, cooler: 10,
};

// Ambil watt dari nama PSU (mis. "750W", "1000W"), fallback 650
export function parsePsuWatt(name: string): number | null {
  const m = name?.match(/(\d{3,4})\s*W/i);
  return m ? Number(m[1]) : null;
}

export function computeWattage(parts: BuildPartLite[]): { load: number; recommended: number } {
  const load = parts.reduce((s, p) => s + (TYPE_WATT[p.type] ?? 0), 0);
  const recommended = load <= 0 ? 0 : Math.ceil((load * 1.35) / 50) * 50;
  return { load, recommended };
}

// --- Form factor & dimensi fisik ---
export const FF_RANK: Record<string, number> = { "mini-itx": 1, "m-itx": 1, mini: 1, itx: 1, "micro-atx": 2, matx: 2, atx: 3, "e-atx": 4, eatx: 4 };

export function detectFormFactor(text: string): number {
  const t = (text || "").toLowerCase();
  if (/(e-?atx|eatx)/.test(t)) return 4;
  if (/(atx)/.test(t)) return 3;
  if (/micro-?atx|m-?atx/.test(t)) return 2;
  if (/(mini-?itx|m-?itx|itx)/.test(t)) return 1;
  return 0;
}

export function firstNum(s: string): number | null {
  const m = s?.match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

export interface ClearanceMsg { ok: boolean; msg: string }
export interface ClearanceResult {
  formFactor?: ClearanceMsg;
  gpuLength?: ClearanceMsg;
  coolerHeight?: ClearanceMsg;
  all: boolean;
}

export function checkClearances(board: string | null, gpu: string | null, cooler: string | null, casing: string | null): ClearanceResult {
  const res: ClearanceResult = { all: true };
  const c = (casing || "").toLowerCase();
  const b = (board || "").toLowerCase();
  const ffBoard = detectFormFactor(b);
  const ffCase = detectFormFactor(c);

  if (ffBoard && ffCase && ffBoard > ffCase) {
    res.formFactor = { ok: false, msg: "⚠️ Peringatan Dimensi: Motherboard tidak muat di casing (form factor lebih besar)." };
    res.all = false;
  } else if (ffBoard && ffCase) {
    res.formFactor = { ok: true, msg: "✅ Form factor motherboard pas dengan casing." };
  }

  // GPU length vs max case GPU length
  const gpuMm = firstNum(gpu || "");
  const caseMaxGpu = c.match(/max.*?gpu.*?(\d{2,4})/i)?.[1] ? Number(c.match(/max.*?gpu.*?(\d{2,4})/i)![1]) : null;
  if (gpuMm && caseMaxGpu && gpuMm > caseMaxGpu) {
    res.gpuLength = { ok: false, msg: `⚠️ Panjang GPU (${gpuMm}mm) melebihi batas casing (${caseMaxGpu}mm).` };
    res.all = false;
  } else if (gpuMm && caseMaxGpu) {
    res.gpuLength = { ok: true, msg: `✅ Panjang GPU (${gpuMm}mm) aman di casing (max ${caseMaxGpu}mm).` };
  }

  // Cooler height vs max case cooler height
  const coolMm = firstNum(cooler || "");
  const caseMaxCool = c.match(/max.*?cpu.*?h.*?(\d{2,4})/i)?.[1] ? Number(c.match(/max.*?cpu.*?h.*?(\d{2,4})/i)![1]) : null;
  if (coolMm && caseMaxCool && coolMm > caseMaxCool) {
    res.coolerHeight = { ok: false, msg: `⚠️ Tinggi CPU Cooler (${coolMm}mm) melebihi batas casing (${caseMaxCool}mm).` };
    res.all = false;
  } else if (coolMm && caseMaxCool) {
    res.coolerHeight = { ok: true, msg: `✅ Tinggi CPU Cooler (${coolMm}mm) pas di casing (max ${caseMaxCool}mm).` };
  }

  // Jika casing ada tapi tidak ada angka dimensi spesifik, tetap lapor pas
  if (ffCase && !res.all && !res.formFactor) res.all = true;
  return res;
}
