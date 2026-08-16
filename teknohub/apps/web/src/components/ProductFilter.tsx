"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  initialCategory?: string;
  initialSearch?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

interface CategoryNode {
  value: string;
  label: string;
  children?: CategoryNode[];
}

const CATEGORY_TREE: CategoryNode[] = [
  { value: "", label: "Semua" },
  { value: "laptop", label: "Laptop" },
  { value: "smartphone", label: "HP" },
  { value: "monitor", label: "Monitor" },
  { value: "gpu", label: "GPU" },
  { value: "cpu", label: "CPU" },
  { value: "ram", label: "RAM" },
  { value: "storage", label: "Storage" },
  { value: "motherboard", label: "Motherboard" },
  { value: "psu", label: "PSU" },
];

export default function ProductFilter({ initialCategory = "", initialSearch = "", initialMinPrice = "", initialMaxPrice = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cats, setCats] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [term, setTerm] = useState(initialSearch);
  const [min, setMin] = useState(initialMinPrice);
  const [max, setMax] = useState(initialMaxPrice);
  const [readyStock, setReadyStock] = useState(false);

  // sync URL -> state
  useEffect(() => {
    setCats(searchParams.get("category") ? [searchParams.get("category")!] : []);
    setTerm(searchParams.get("search") || "");
    setMin(searchParams.get("min_price") || "");
    setMax(searchParams.get("max_price") || "");
  }, [searchParams]);

  const buildParams = (cat: string[] = cats, search: string = term, mn: string = min, mx: string = max) => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("category"); p.delete("search"); p.delete("min_price"); p.delete("max_price");
    const c = cat.join(",");
    if (c) p.set("category", c);
    if (cat.length === 0) p.delete("category");
    if (search) p.set("search", search);
    if (mn) p.set("min_price", mn);
    if (mx) p.set("max_price", mx);
    return p.toString();
  };

  const push = (qs: string) => router.push(qs ? `?${qs}` : "?");

  const toggleCat = (v: string) => {
    const next = v === "" ? [] : (ids.includes(v) ? ids.filter((x) => x !== v) : [...ids, v]);
    // hanya 1 kategori akif kotak centang? multi-select
    push(buildParams(next, term, min, max));
  };

  const aply = () => push(buildParams(cats, term, min, max));
  const rset = () => { push(buildParams([], "", "", "")); };

  // multi-select state: pakai cats yg mungkin comma-separated
  const ids = cats.join(",").split(",").filter(Boolean);

  return (
    <div className="space-y-5 bg-surface-2/60 p-5 rounded-2xl shadow-sm border border-border">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <SlidersHorizontal size={16} className="text-accent" /> Filter Produk
        </h2>
      </div>

      {/* Kategori */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-tertiary mb-2">Kategori</p>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input type="checkbox" checked={ids.length === 0} onChange={() => toggleCat("")} className="accent-accent" />
            Semua
          </label>
          {CATEGORY_TREE.filter((n) => n.value).map((n) => (
            <label key={n.value} className="flex items-center gap-2 text-sm text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={ids.includes(n.value)}
                onChange={() => toggleCat(n.value)}
                className="accent-accent"
              />
              {n.label}
            </label>
          ))}
        </div>
      </div>

      {/* Rentang Harga */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-tertiary mb-2">Rentang Harga (Rp)</p>
        <div className="flex items-center gap-2">
          <input
            type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)}
            placeholder="Min" className="w-1/2 p-2 border border-border rounded-lg bg-surface text-sm text-foreground"
          />
          <span className="text-tertiary">–</span>
          <input
            type="number" min={0} value={max} onChange={(e) => setMax(e.target.value)}
            placeholder="Max" className="w-1/2 p-2 border border-border rounded-lg bg-surface text-sm text-foreground"
          />
        </div>
      </div>

      {/* Kondisi */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-tertiary mb-2">Kondisi</p>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input type="checkbox" checked={readyStock} onChange={(e) => setReadyStock(e.target.checked)} className="accent-accent" />
            Ready Stock
          </label>
        </div>
      </div>

      {/* Aksi */}
      <div className="flex gap-2">
        <button onClick={aply} className="flex-1 bg-accent hover:bg-accent-secondary text-white text-sm font-bold py-2.5 rounded-xl transition">
          Terapkan Filter
        </button>
        <button onClick={rset} className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-muted hover:text-accent transition">
          Reset
        </button>
      </div>
    </div>
  );
}
