"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductFilterProps {
  initialCategory?: string;
  initialSearch?: string;
}

interface CategoryNode {
  value: string;
  label: string;
  children?: CategoryNode[];
}

// Hierarki kategori: parent → child (sub-kategori)
const CATEGORY_TREE: CategoryNode[] = [
  { value: "", label: "Semua" },
  { value: "laptop", label: "Laptop" },
  { value: "smartphone", label: "HP" },
  { value: "monitor", label: "Monitor" },
  {
    value: "komponen",
    label: "Komponen PC",
    children: [
      { value: "cpu", label: "CPU" },
      { value: "gpu", label: "GPU" },
      { value: "ram", label: "RAM" },
      { value: "storage", label: "Storage" },
      { value: "motherboard", label: "Motherboard" },
      { value: "psu", label: "PSU" },
      { value: "case", label: "Casing" },
      { value: "cooler", label: "Cooler" },
    ],
  },
  { value: "aksesoris", label: "Aksesoris" },
];

const PARENT_LOOKUP: Record<string, string> = {};
for (const node of CATEGORY_TREE) {
  for (const child of node.children ?? []) {
    PARENT_LOOKUP[child.value] = node.value;
  }
}

export default function ProductFilter({ initialCategory = "", initialSearch = "" }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(initialCategory);
  const [term, setTerm] = useState(initialSearch);

  // sync URL → state (browser back/forward, link langsung)
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    const s = searchParams.get("search") || "";
    setActive(cat);
    setTerm(s);
  }, [searchParams]);

  const applyFilters = (category: string, search: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  };

  const handleCategory = (cat: string) => {
    setActive(cat);
    applyFilters(cat, term);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTerm(v);
    applyFilters(active, v);
  };

  const activeParent = PARENT_LOOKUP[active] ?? (active === "komponen" ? "komponen" : "");

  return (
    <div className="space-y-6">
      <div className="bg-surface-2/60 p-6 rounded-2xl shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Filter Produk</h2>

        {/* Level 1: parent kategori */}
        <div className="flex flex-wrap gap-3 mb-4">
          {CATEGORY_TREE.map((node) => (
            <button
              key={node.value}
              onClick={() => {
                // parent tanpa children → langsung pilih; parent dgn children → tampilkan children
                if (!node.children) {
                  handleCategory(node.value);
                } else {
                  // toggle: pilih parent (semua komponen) atau buka sub-kategori
                  setActive(node.value);
                  applyFilters(node.value, term);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm transition duration-150 ${
                active === node.value || activeParent === node.value
                  ? "bg-accent text-white shadow-md"
                  : "bg-surface-2 border border-border hover:bg-slate-200 text-muted"
              }`}
            >
              {node.label}
            </button>
          ))}
        </div>

        {/* Level 2: sub-kategori (hanya tampil saat parent aktif) */}
        {activeParent === "komponen" && (
          <div className="flex flex-wrap gap-2 mb-4 pl-2 border-l-2 border-blue-500/30">
            {CATEGORY_TREE.find((n) => n.value === "komponen")?.children?.map((child) => (
              <button
                key={child.value}
                onClick={() => handleCategory(child.value)}
                className={`px-3 py-1.5 rounded-full text-xs transition duration-150 ${
                  active === child.value
                    ? "bg-accent-dim text-accent border border-accent/40"
                    : "bg-surface-2 hover:bg-slate-200 text-tertiary border border-border"
                }`}
              >
                {child.label}
              </button>
            ))}
          </div>
        )}

        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2 text-muted">
            Cari Produk:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Masukkan nama produk..."
            value={term}
            onChange={handleSearch}
            className="w-full p-3 border border-border rounded-xl bg-surface text-foreground focus:ring-2 focus:ring-accent/25 focus:border-accent transition"
          />
        </div>
      </div>
    </div>
  );
}
