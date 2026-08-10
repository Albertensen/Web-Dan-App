import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface ComponentRow {
  id: string;
  name: string;
  brand: string | null;
  component_type: string;
  socket: string | null;
  specs: Record<string, unknown>;
  component_prices?: { price: number }[];
}

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma4:e4b";

// Rule-based fallback: parse intent dari pesan, panggil /recommend
async function ruleBasedReply(text: string) {
  const lower = text.toLowerCase();

  let useCase = "gaming";
  if (lower.includes("edit") || lower.includes("konten") || lower.includes("video") || lower.includes("stream")) {
    useCase = "content-creator";
  } else if (lower.includes("kerja") || lower.includes("office") || lower.includes("coding") || lower.includes("produktiv")) {
    useCase = "productivity";
  } else if (lower.includes("hemat") || lower.includes("budget") || lower.includes("murah")) {
    useCase = "budget";
  }

  const budgetMatch = text.match(/(\d+)\s*(jt|juta|mil)?/i);
  let budget = 15000000;
  if (budgetMatch) {
    const val = Number(budgetMatch[1]);
    if (budgetMatch[2]?.toLowerCase().startsWith("j") || budgetMatch[2]?.toLowerCase().startsWith("m")) {
      budget = val * 1000000;
    } else if (val > 1000) {
      budget = val;
    } else {
      budget = val * 1000000;
    }
  }
  if (budget < 3000000) budget = 3000000;
  if (budget > 50000000) budget = 50000000;

  const { data, error } = await supabase
    .from("pc_components")
    .select("id, name, brand, component_type, socket, specs, component_prices(price)")
    .limit(200);

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as unknown as ComponentRow[];
  const comps = rows.map((c) => ({ ...c, price: c.component_prices?.[0]?.price ?? 0 }));

  const allocation: Record<string, number> = {
    cpu: 0.22, gpu: 0.35, ram: 0.08, storage: 0.08,
    motherboard: 0.09, psu: 0.07, case: 0.06, cooler: 0.05,
  };
  if (useCase === "productivity") {
    allocation.gpu = 0.15;
    allocation.cpu = 0.3;
  }
  if (useCase === "content-creator") {
    allocation.gpu = 0.25;
    allocation.cpu = 0.28;
  }
  if (useCase === "budget") {
    allocation.gpu = 0.3;
    allocation.cpu = 0.25;
  }

  const byType = (t: string) => comps.filter((c) => c.component_type === t && c.price > 0).sort((a, b) => a.price - b.price);
  const pick = (t: string) => {
    const list = byType(t);
    if (list.length === 0) return null;
    const maxPrice = budget * (allocation[t] ?? 0.1);
    const affordable = list.filter((c) => c.price <= maxPrice);
    return affordable.length > 0 ? affordable[affordable.length - 1] : list[0];
  };

  const build: Record<string, { id: string; name: string; component_type: string; price: number } | null> = {};
  build.cpu = pick("cpu");
  build.motherboard = pick("motherboard");
  build.ram = pick("ram");
  build.gpu = pick("gpu");
  build.storage = pick("storage");
  build.psu = pick("psu");
  build.case = pick("case");
  build.cooler = pick("cooler");

  const parts = Object.values(build).filter(Boolean) as { id: string; name: string; component_type: string; price: number }[];
  const total = parts.reduce((s, p) => s + p.price, 0);

  const label: Record<string, string> = {
    gaming: "Gaming", productivity: "Productivity", "content-creator": "Content Creator", budget: "Budget",
  };

  return {
    reply: `Berikut rekomendasi build ${label[useCase]} untuk budget ${new Intl.NumberFormat("id-ID").format(budget)}:\n${parts
      .map((p) => `- ${p.name} (${new Intl.NumberFormat("id-ID").format(p.price)})`)
      .join("\n")}\nTotal: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}`,
    summary: {
      parts: parts.map((p) => ({ id: p.id, name: p.name, type: p.component_type, price: p.price })),
      total,
      useCase,
      budget,
    },
    recommendation: {
      cpu: build.cpu?.name,
      gpu: build.gpu?.name,
      ram: build.ram?.name,
      storage: build.storage?.name,
      psu: build.psu?.name,
      motherboard: build.motherboard?.name,
      casing: build.case?.name,
      cooler: build.cooler?.name,
      totalEstimasi: total,
      alasan: `Kombinasi optimal untuk ${label[useCase]} dengan budget Rp ${new Intl.NumberFormat("id-ID").format(budget)}`,
    },
    hasRecommendation: true,
    awaitingConfirmation: true,
  };
}

export async function POST(request: NextRequest) {
  // Rate limit: 15 POST/menit per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip, { limit: 15, windowSec: 60 })) {
    return NextResponse.json({ error: "Terlalu banyak request. Coba lagi nanti." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const message = String(body?.message ?? "").trim();

  if (!message) {
    return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });
  }

  try {
    // Coba Ollama dulu (jika reachable)
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah asisten rakit PC TeknoHub. Jawab singkat dalam Bahasa Indonesia. " +
              "Jika user menanyakan atau meminta rekomendasi build PC, SELALU berikan nama komponen " +
              "spesifik yang real dan ada di pasaran Indonesia (CPU, GPU, RAM, Storage, PSU, Motherboard, Casing, Cooler) " +
              "dalam format: NAMA KOMPONEN (harga). Jika user belum menyebut budget, tanyakan dulu budget-nya.",
          },
          { role: "user", content: message },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (ollamaRes.ok) {
      const json = await ollamaRes.json();
      const reply = String(json?.message?.content ?? "").trim();
      if (reply) {
        // Parse komponen dari reply (format "NAMA (harga)") utk recommendation
        const lines = reply.split("\n").map((l) => l.trim()).filter(Boolean);
        const comp = (key: string) => {
          const line = lines.find((l) => l.toLowerCase().includes(key));
          return line ? line.replace(/^[-•]\s*/, "").replace(/\s*\(.*\)\s*$/, "").trim() : undefined;
        };
        return NextResponse.json({
          reply,
          recommendation: {
            cpu: comp("cpu") ?? comp("processor"),
            gpu: comp("gpu") ?? comp("rtx") ?? comp("radeon"),
            ram: comp("ram"),
            storage: comp("storage") ?? comp("ssd") ?? comp("nvme"),
            psu: comp("psu") ?? comp("power"),
            motherboard: comp("motherboard") ?? comp("b650") ?? comp("b760"),
            casing: comp("casing") ?? comp("case"),
            cooler: comp("cooler") ?? comp("pendingin"),
          },
          hasRecommendation: /cpu|processor|gpu|rtx|ram|ssd|nvme|psu|motherboard|casing|cooler/i.test(reply),
          awaitingConfirmation: /cpu|processor|gpu|rtx|ram|ssd|nvme|psu|motherboard|casing|cooler/i.test(reply),
        });
      }
    }
  } catch {
    // Ollama down — fallback
  }

  // Fallback rule-based
  try {
    const result = await ruleBasedReply(message);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
