import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import AdminProductForm from "@/components/admin/AdminProductForm";

export const metadata = {
  title: "Admin Produk — TeknoHub",
};

export const dynamic = "force-dynamic";

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default async function AdminProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, brand, price, stock, image_url, slug")
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Admin Produk</h1>
      <p className="text-tertiary mb-8">Kelola katalog produk TeknoHub</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-foreground mb-4">Daftar Produk ({products?.length ?? 0})</h2>
          {error || !products || products.length === 0 ? (
            <div className="p-8 bg-surface-2/60 border border-dashed border-slate-300 rounded-xl text-center">
              <p className="text-tertiary">Belum ada produk</p>
            </div>
          ) : (
            <div className="overflow-x-auto glow-card">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-tertiary border-b border-slate-300">
                    <th className="p-3 sticky left-0 bg-surface z-10">Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-right">Harga</th>
                    <th className="p-3 text-center">Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-slate-300/50 hover:bg-surface-2/50">
                      <td className="p-3 sticky left-0 bg-surface z-10">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                                                      <Image src={p.image_url} alt={p.name} width={40} height={40} sizes="40px" className="w-10 h-10 object-cover rounded-lg" />
                                                    ) : (
                            <span className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center text-sm">📦</span>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.brand} · {p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted">{p.category}</td>
                      <td className="p-3 text-right text-foreground font-medium">{formatIDR(Number(p.price))}</td>
                      <td className={`p-3 text-center ${Number(p.stock) <= 5 ? "text-amber-400" : "text-muted"}`}>
                        {p.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Tambah Produk</h2>
          <div className="glow-card p-5">
            <AdminProductForm />
          </div>
        </div>
      </div>
    </main>
  );
}
