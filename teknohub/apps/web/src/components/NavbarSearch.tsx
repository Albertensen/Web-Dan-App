"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setTerm("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Cari produk..."
        className="w-full px-4 py-2 pl-10 text-sm bg-[#12121a] border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
      />
      <svg
        className="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </form>
  );
}
