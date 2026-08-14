"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    router.push(q ? `/shop/products?search=${encodeURIComponent(q)}` : "/shop/products");
    setTerm("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl min-w-0 hidden sm:block">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Cari produk elektronik, komponen PC, atau topik forum..."
        className="w-full px-4 py-2 pl-10 text-xs bg-surface border border-slate-300 rounded-full text-foreground placeholder:text-slate-500 focus:ring-accent/40 focus:border-accent focus:outline-none transition shadow-sm"
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
