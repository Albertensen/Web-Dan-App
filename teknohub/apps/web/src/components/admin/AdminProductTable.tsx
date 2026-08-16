"use client";

import { useState } from "react";
import Image from "next/image";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  slug: string;
  is_active?: boolean;
  description?: string | null;
}

const CATEGORIES = [
  "all", "laptop", "smartphone", "monitor", "cpu", "gpu", "ram", "storage",
  "motherboard", "psu", "case", "cooler", "aksesoris"
];

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function AdminProductTable({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = products.filter((p) => {
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  async function handleToggleActive(p: ProductItem) {
    const nextStatus = !p.is_active;
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, is_active: nextStatus }),
    });
    if (res.ok) {
      setProducts(products.map((item) => item.id === p.id ? { ...item, is_active: nextStatus } : item));
    }
  }

  async function handleQuickStock(p: ProductItem, delta: number) {
    const nextStock = Math.max(0, p.stock + delta);
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, stock: nextStock }),
    });
    if (res.ok) {
      setProducts(products.map((item) => item.id === p.id ? { ...item, stock: nextStock } : item));
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        setProducts(products.map((item) => item.id === editingProduct.id ? editingProduct : item));
        setEditingProduct(null);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Controls: Search & Category */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk / brand..."
          className="flex-1 px-4 py-2 text-sm bg-surface border border-slate-300 rounded-xl"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 text-sm bg-surface border border-slate-300 rounded-xl uppercase font-semibold text-xs"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 bg-surface rounded-2xl border border-dashed border-slate-300 text-center">
          <p className="text-tertiary text-sm">Tidak ada produk yang cocok.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-2 text-xs text-tertiary uppercase border-b border-slate-300">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3 text-right">Harga</th>
                  <th className="p-3 text-center">Stok</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} width={40} height={40} sizes="40px" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                        ) : (
                          <span className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center text-sm shrink-0">📦</span>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-xs">{p.name}</p>
                          <p className="text-xs text-tertiary">{p.brand || "No Brand"} · <span className="font-mono">{p.slug}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted uppercase font-semibold">{p.category}</td>
                    <td className="p-3 text-right font-bold text-foreground">{formatIDR(Number(p.price))}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickStock(p, -1)}
                          className="w-6 h-6 rounded bg-surface-2 hover:bg-slate-300 text-xs font-bold"
                        >
                          −
                        </button>
                        <span className={`w-8 text-center text-xs font-bold ${p.stock <= 5 ? "text-amber-700" : "text-foreground"}`}>
                          {p.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickStock(p, +1)}
                          className="w-6 h-6 rounded bg-surface-2 hover:bg-slate-300 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                          p.is_active !== false
                            ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                            : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                        }`}
                      >
                        {p.is_active !== false ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(p)}
                        className="px-3 py-1 rounded-lg bg-surface-2 border border-slate-300 hover:border-accent text-xs font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-300">
              <h2 className="font-bold text-foreground text-lg">Edit Produk</h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Harga (IDR)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Stok</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Brand</label>
                <input
                  type="text"
                  value={editingProduct.brand ?? ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Deskripsi</label>
                <textarea
                  value={editingProduct.description ?? ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 text-sm bg-surface border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 text-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-accent text-white hover:bg-accent-secondary disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
