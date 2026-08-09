// Scraper harga komponen PC dari marketplace (Tokopedia/Shopee)
// Dipanggil manual: node scripts/scraper/componentScraper.js
// Dipanggil cron: POST /api/cron/update-prices (import handler)

const SEARCH_TERMS = {
  cpu: ["processor ryzen 5", "processor intel i5", "processor ryzen 7", "processor intel i7"],
  gpu: ["vga rtx 4060", "vga rtx 4070", "vga rx 7600", "vga rx 7800"],
  ram: ["ram ddr5 16gb", "ram ddr4 16gb", "ram ddr5 32gb"],
  storage: ["ssd nvme 1tb", "ssd nvme 500gb", "hdd 2tb"],
  motherboard: ["motherboard am5 b650", "motherboard lga1700 b760", "motherboard am4 b550"],
  psu: ["psu 650w 80 plus", "psu 750w 80 plus", "psu 550w 80 plus"],
  case: ["casing pc atx", "casing pc mid tower"],
  cooler: ["cooler cpu air", "liquid cooler 240mm"],
};

/**
 * Cari harga di Tokopedia via API pencarian publik.
 * NOTE: endpoint bisa berubah; fallback ke estimasi jika gagal.
 */
async function searchTokopedia(term) {
  try {
    const url = `https://ace.tokopedia.com/search/v2.5/product?q=${encodeURIComponent(term)}&ob=23&rows=3`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) TeknoHubBot/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const products = json?.data?.products ?? [];
    return products.map((p) => ({
      name: p.name,
      price: p.price,
      url: p.uri ? `https://www.tokopedia.com${p.uri}` : null,
    }));
  } catch {
    return null;
  }
}

/** Scrape 1 tipe: update component_prices + marketplace_url utk komponen match */
async function scrapeType(type, supabaseUrl, supabaseKey) {
  const terms = SEARCH_TERMS[type] ?? [];
  const found = [];

  for (const term of terms) {
    const results = await searchTokopedia(term);
    if (!results) continue;

    // Match komponen di DB by name (ilike)
    for (const r of results) {
      const q = await fetch(`${supabaseUrl}/rest/v1/pc_components?name=ilike.*${encodeURIComponent(r.name.split(" ").slice(0, 3).join(" "))}*&select=id`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        signal: AbortSignal.timeout(6000),
      });
      if (!q.ok) continue;
      const matches = await q.json();
      if (matches.length === 0) continue;

      const compId = matches[0].id;
      // Insert harga baru
      await fetch(`${supabaseUrl}/rest/v1/component_prices`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ component_id: compId, source: "tokopedia", price: r.price, url: r.url }),
      });
      // Update marketplace_url
      if (r.url) {
        await fetch(`${supabaseUrl}/rest/v1/pc_components?id=eq.${compId}`, {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ marketplace_url: r.url }),
        });
      }
      found.push({ name: r.name, price: r.price, url: r.url });
    }
  }

  return found;
}

/**
 * Main: scrape semua tipe.
 * @param {object} cfg { supabaseUrl, supabaseKey }
 */
export async function runScraper(cfg) {
  const { supabaseUrl, supabaseKey } = cfg;
  const report = {};
  for (const type of Object.keys(SEARCH_TERMS)) {
    try {
      const found = await scrapeType(type, supabaseUrl, supabaseKey);
      report[type] = found.length;
    } catch (err) {
      report[type] = `error: ${err.message}`;
    }
  }
  return report;
}

// CLI entry (node scripts/scraper/componentScraper.js)
if (typeof require !== "undefined" && require.main === module) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars");
    process.exit(1);
  }
  runScraper({ supabaseUrl, supabaseKey })
    .then((r) => {
      console.log("SCRAPE DONE:", JSON.stringify(r, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error("SCRAPE FAILED:", err);
      process.exit(1);
    });
}
