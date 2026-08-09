import Link from "next/link";

export const metadata = { title: "Produk — TeknoHub" };

const products = [
  { name: "RTX 4060 8GB", category: "GPU", price: "Rp 4.5 Jt" },
  { name: "Ryzen 5 7600", category: "CPU", price: "Rp 3.2 Jt" },
  { name: "32GB DDR5 6000", category: "RAM", price: "Rp 1.8 Jt" },
  { name: "1TB NVMe Gen4", category: "Storage", price: "Rp 1.2 Jt" },
  { name: "B650 Motherboard", category: "Motherboard", price: "Rp 2.4 Jt" },
  { name: "650W 80+ Gold PSU", category: "PSU", price: "Rp 1.1 Jt" },
];

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Katalog Produk</h1>
      <p className="text-slate-600 mb-8">
        Database produk gadget & komponen PC dengan harga terkini.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.name}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-primary bg-blue-50 px-2 py-1 rounded">
              {p.category}
            </span>
            <h2 className="text-lg font-semibold mt-3">{p.name}</h2>
            <p className="text-slate-600 mt-1">{p.price}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-400 mt-8">
        Data contoh — akan diganti dengan data dari database.
      </p>
    </div>
  );
}
