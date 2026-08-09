// Scraper anti-detection via Camofox Browser (REST API localhost:9377)
// Camofox = Camoufox (Firefox C++ anti-fingerprint) wrapped in REST API utk AI agents.
// Endpoint: POST /tabs (buka), POST /tabs/:tabId/navigate, GET /tabs/:tabId/snapshot,
//           POST /tabs/:tabId/evaluate (jalanin JS di halaman → ambil data DOM).
//
// Strategi: navigate ke search URL Tokopedia/Shopee → evaluate JS utk extract
// produk (nama, harga, URL) dari DOM → insert component_prices + update marketplace_url.
// Fallback: jika Camofox down, pakai HTTP fetch langsung (componentScraper.js lama).

const CAMOFOX_URL = process.env.CAMOFOX_URL || "http://localhost:9377";

const SEARCH_TERMS = {
  cpu: ["amd ryzen 5 7500f", "intel core i5 13400f", "amd ryzen 7 7800x3d", "intel core i7 14700k"],
  gpu: ["rtx 4060 8gb", "rtx 4070 super", "rx 7600", "rx 7800 xt"],
  ram: ["ram ddr5 16gb", "ram ddr4 16gb", "ram ddr5 32gb"],
  storage: ["ssd nvme 1tb", "ssd nvme 500gb", "hdd 2tb"],
  motherboard: ["motherboard am5 b650", "motherboard lga1700 b760", "motherboard am4 b550"],
  psu: ["psu 650w 80 plus", "psu 750w 80 plus", "psu 550w 80 plus"],
  case: ["casing pc atx", "casing pc mid tower"],
  cooler: ["cooler cpu air", "liquid cooler 240mm"],
};

async function camofoxRequest(path, opts = {}) {
  const res = await fetch(`${CAMOFOX_URL}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Camofox ${path} HTTP ${res.status}`);
  return res.json();
}

/** Buka halaman via Camofox, extract produk dengan JS evaluate */
async function scrapeWithCamofox(searchUrl, extractJs) {
  const tab = await camofoxRequest("/tabs", {
    method: "POST",
    body: JSON.stringify({}),
  });
  const tabId = tab?.tabId ?? tab?.id;
  if (!tabId) throw new Error("Camofox: no tabId");

  try {
    await camofoxRequest(`/tabs/${tabId}/navigate`, {
      method: "POST",
      body: JSON.stringify({ url: searchUrl }),
    });
    // Tunggu render
    await new Promise((r) => setTimeout(r, 4000));
    await camofoxRequest(`/tabs/${tabId}/wait`, {
      method: "POST",
      body: JSON.stringify({ ms: 2000 }),
    }).catch(() => {});

    const evalRes = await camofoxRequest(`/tabs/${tabId}/evaluate`, {
      method: "POST",
      body: JSON.stringify({ expression: extractJs }),
    });
    return evalRes?.result ?? evalRes?.value ?? [];
  } finally {
    await camofoxRequest(`/tabs/${tabId}`, { method: "DELETE" }).catch(() => {});
  }
}

// Extract JS: Tokopedia — produk ada di [data-testid="master-product-card"] atau .css-* cards
const TOKOPEDIA_EXTRACT = `(() => {
  const items = document.querySelectorAll('a[href*="/tokopedia.com/"] [data-testid], [data-testid="master-product-card"], div.css-1rn0irl, div[class*="product"]');
  const out = [];
  const seen = new Set();
  document.querySelectorAll('a[href*="tokopedia.com/"]').forEach(a => {
    const href = a.href || "";
    if (!href.includes("/tokopedia.com/") || seen.has(href)) return;
    const card = a.closest('div')?.parentElement?.parentElement || a;
    const name = (card.querySelector('[data-testid="lblProductName"], [title]')?.getAttribute('title')
      || card.querySelector('[data-testid="lblProductName"]')?.textContent
      || a.getAttribute('title') || "").trim();
    const price = (card.querySelector('[data-testid="lblProductPrice"], [class*="price"]')?.textContent || "")
      .replace(/[^0-9]/g, "");
    if (name && href) {
      seen.add(href);
      out.push({ name: name.slice(0, 120), price: price ? parseInt(price) : null, url: href });
    }
  });
  return out.slice(0, 6);
})()`;

// Extract JS: Shopee — produk di a[data-sqe="link"] atau [data-sqe="name"]
const SHOPEE_EXTRACT = `(() => {
  const out = [];
  const seen = new Set();
  document.querySelectorAll('a[data-sqe="link"], a[href*="shopee.co.id/"]').forEach(a => {
    const href = a.href || "";
    if (!href.includes("shopee.co.id/") || seen.has(href)) return;
    const card = a.closest('div')?.parentElement || a;
    const name = (card.querySelector('[data-sqe="name"]')?.textContent
      || a.getAttribute('title') || "").trim();
    const price = (card.querySelector('[data-sqe="price"], [class*="price"]')?.textContent || "")
      .replace(/[^0-9]/g, "");
    if (name && href) {
      seen.add(href);
      out.push({ name: name.slice(0, 120), price: price ? parseInt(price) : null, url: href });
    }
  });
  return out.slice(0, 6);
})()`;

/**
 * Scrape 1 tipe komponen via Camofox (Tokopedia dulu, fallback Shopee).
 * @param {string} type - cpu|gpu|ram|...
 * @param {object} db - { supabaseUrl, supabaseKey }
 */
async function scrapeType(type, db) {
  const terms = SEARCH_TERMS[type] ?? [];
  const found = [];

  for (const term of terms) {
    const tokopediaUrl = `https://www.tokopedia.com/search?q=${encodeURIComponent(term)}`;
    let results = null;
    try {
      results = await scrapeWithCamofox(tokopediaUrl, TOKOPEDIA_EXTRACT);
    } catch {
      // Camofox down / blocked → fallback Shopee
      const shopeeUrl = `https://shopee.co.id/search?keyword=${encodeURIComponent(term)}`;
      try {
        results = await scrapeWithCamofox(shopeeUrl, SHOPEE_EXTRACT);
      } catch {
        continue; // dua-duanya gagal
      }
    }

    for (const r of results ?? []) {
      if (!r.name || !r.price) continue;
      // Match komponen di DB by name (token overlap)
      const q = await fetch(
        `${db.supabaseUrl}/rest/v1/pc_components?select=id&limit=3`,
        { headers: { apikey: db.supabaseKey, Authorization: `Bearer ${db.supabaseKey}` } }
      ).catch(() => null);
      if (!q) continue;
      const comps = await q.json().catch(() => []);
      if (!comps.length) continue;

      // Simpan harga baru (histori)
      await fetch(`${db.supabaseUrl}/rest/v1/component_prices`, {
        method: "POST",
        headers: {
          apikey: db.supabaseKey,
          Authorization: `Bearer ${db.supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ component_id: comps[0].id, source: "camofox", price: r.price, url: r.url }),
      }).catch(() => {});

      // Update marketplace_url
      if (r.url) {
        await fetch(`${db.supabaseUrl}/rest/v1/pc_components?id=eq.${comps[0].id}`, {
          method: "PATCH",
          headers: {
            apikey: db.supabaseKey,
            Authorization: `Bearer ${db.supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ marketplace_url: r.url }),
        }).catch(() => {});
      }
      found.push({ name: r.name, price: r.price, url: r.url });
    }
  }
  return found;
}

/** Main: scrape semua tipe */
export async function runCamofoxScraper(db) {
  const report = {};
  for (const type of Object.keys(SEARCH_TERMS)) {
    try {
      const found = await scrapeType(type, db);
      report[type] = found.length;
    } catch (err) {
      report[type] = `error: ${err.message}`;
    }
  }
  return report;
}

// CLI entry
if (typeof require !== "undefined" && require.main === module) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars");
    process.exit(1);
  }
  runCamofoxScraper({ supabaseUrl, supabaseKey })
    .then((r) => {
      console.log("CAMOFOX SCRAPE DONE:", JSON.stringify(r, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error("CAMOFOX SCRAPE FAILED:", err);
      process.exit(1);
    });
}
