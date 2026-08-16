"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap } from "lucide-react";

interface ComponentPrice {
  id: string;
  source: string;
  price: number;
  currency: string;
  fetched_at: string;
}

interface ComponentItem {
  id: string;
  name: string;
  brand: string | null;
  component_type: string;
  socket: string | null;
  specs: Record<string, unknown>;
  image_url: string | null;
  marketplace_url: string | null;
  component_prices?: ComponentPrice[];
}

const TYPES = ["all", "cpu", "gpu", "motherboard", "ram", "storage", "psu", "case", "cooler"];

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function AdminComponentsPage() {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedComp, setSelectedComp] = useState<ComponentItem | null>(null);
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editMarketplace, setEditMarketplace] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSocket, setEditSocket] = useState("");

  const fetchComponents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/components?type=${typeFilter}`);
      const json = await res.json();
      if (res.ok) setComponents(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  function openEdit(c: ComponentItem) {
    setSelectedComp(c);
    setEditName(c.name);
    setEditBrand(c.brand ?? "");
    setEditMarketplace(c.marketplace_url ?? "");
    setEditSocket(c.socket ?? "");
    const latestPrice = c.component_prices?.[0]?.price;
    setEditPrice(latestPrice !== undefined ? String(latestPrice) : "");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedComp) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/components", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedComp.id,
          name: editName,
          brand: editBrand,
          marketplace_url: editMarketplace,
          socket: editSocket,
          price: editPrice ? Number(editPrice) : undefined,
        }),
      });
      if (res.ok) {
        setSelectedComp(null);
        fetchComponents();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleTriggerScraper() {
    setScraping(true);
    setScrapeResult(null);
    try {
      const res = await fetch("/api/admin/components/scrape", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setScrapeResult("Scraping berhasil dijalankan.");
        fetchComponents();
      } else {
        setScrapeResult(`Error: ${json.error ?? "Gagal"}`);
      }
    } catch {
      setScrapeResult("Terjadi kesalahan jaringan.");
    } finally {
      setScraping(false);
    }
  }

  const filtered = components.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.brand ?? "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Komponen PC &amp; Scraper</h1>
          <p className="text-xs text-tertiary">Database 34+ komponen, mapping marketplace, dan trigger update harga</p>
        </div>
        {/* Tombol Scraper */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerScraper}
            disabled={scraping}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent text-white hover:bg-accent-secondary transition disabled:opacity-50 flex items-center gap-2"
          >
            <span><Zap size={16} className="inline mr-1" /></span>
            {scraping ? "Menjalankan Scraper..." : "Trigger Scraper Manual"}
          </button>
        </div>
      </div>

      {scrapeResult && (
        <div className="mb-4 p-3 rounded-xl bg-blue-100 border border-blue-300 text-blue-900 text-xs flex justify-between items-center">
          <span>{scrapeResult}</span>
          <button type="button" onClick={() => setScrapeResult(null)} className="text-blue-700 font-bold">✕</button>
        </div>
      )}

      {/* Filter Type & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari komponen..."
          className="flex-1 px-4 py-2 text-sm bg-surface border border-slate-300 rounded-xl"
        />
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                typeFilter === t
                  ? "bg-accent text-white"
                  : "bg-surface border border-slate-300 text-muted hover:border-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Components Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-tertiary">Memuat komponen...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-tertiary text-sm">Tidak ada komponen ditemukan.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-2 text-xs text-tertiary uppercase border-b border-slate-300">
                <tr>
                  <th className="p-3">Komponen</th>
                  <th className="p-3">Tipe / Socket</th>
                  <th className="p-3 text-right">Harga Terbaru</th>
                  <th className="p-3">Marketplace Link</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((c) => {
                  const latest = c.component_prices?.[0];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{c.name}</p>
                        <p className="text-xs text-tertiary">{c.brand || "No Brand"}</p>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-2 text-muted uppercase">
                          {c.component_type}
                        </span>
                        {c.socket && <span className="ml-1.5 text-xs text-tertiary font-mono">[{c.socket}]</span>}
                      </td>
                      <td className="p-3 text-right font-bold text-foreground">
                        {latest?.price ? formatIDR(Number(latest.price)) : <span className="text-slate-400 italic text-xs">Belum ada</span>}
                      </td>
                      <td className="p-3 max-w-xs truncate text-xs">
                        {c.marketplace_url ? (
                          <a href={c.marketplace_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate block">
                            {c.marketplace_url}
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Belum di-mapping</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="px-3 py-1.5 rounded-lg bg-surface-2 border border-slate-300 hover:border-accent text-xs font-semibold"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {selectedComp && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-300">
              <h2 className="font-bold text-foreground text-lg">Edit Komponen</h2>
              <button
                type="button"
                onClick={() => setSelectedComp(null)}
                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Nama Komponen</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Brand</label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Socket (jika ada)</label>
                  <input
                    type="text"
                    value={editSocket}
                    onChange={(e) => setEditSocket(e.target.value)}
                    placeholder="AM5 / LGA1700"
                    className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Update Harga Manual (IDR)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Harga terbaru"
                  className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">URL Tokopedia / Shopee</label>
                <input
                  type="url"
                  value={editMarketplace}
                  onChange={(e) => setEditMarketplace(e.target.value)}
                  placeholder="https://www.tokopedia.com/..."
                  className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setSelectedComp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 text-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-accent text-white hover:bg-accent-secondary disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
