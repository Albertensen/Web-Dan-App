"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";

interface ProductFilterProps {
  initialCategory?: string;
  initialSearch?: string;
}

const CATEGORIES = [
  { value: "", label: "Semua" },
  { value: "laptop", label: "Laptop" },
  { value: "smartphone", label: "Smartphone" },
  { value: "monitor", label: "Monitor" },
  { value: "gpu", label: "GPU" },
  { value: "cpu", label: "CPU" },
  { value: "ram", label: "RAM" },
];

export default function ProductFilter({ initialCategory = "", initialSearch = "" }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(initialCategory);
  const [term, setTerm] = useState(initialSearch);

  const applyFilters = useCallback(
    (category: string, search: string) => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?");
    },
    [router]
  );

  const handleCategory = (cat: string) => {
    setActive(cat);
    applyFilters(cat, term);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    applyFilters(active, e.target.value);
  };

  // sync with browser back/forward
  useState(() => {
    const cat = searchParams.get("category") || "";
    const s = searchParams.get("search") || "";
    setActive(cat);
    setTerm(s);
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Filter Produk</h2>

        <div className="flex flex-wrap gap-3 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm transition duration-150 ${
                active === cat.value
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2 text-slate-300">
            Cari Produk:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Masukkan nama produk..."
            value={term}
            onChange={handleSearch}
            className="w-full p-3 border border-slate-600 rounded-lg bg-[#1a1a20] text-slate-200 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>
    </div>
  );
}
