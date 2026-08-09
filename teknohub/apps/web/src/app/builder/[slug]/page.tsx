import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface BuildPageProps {
  params: { slug: string };
}

const TYPE_LABEL: Record<string, string> = {
  cpu: "CPU", gpu: "GPU", ram: "RAM", storage: "Storage",
  motherboard: "Motherboard", psu: "PSU", case: "Casing", cooler: "Cooler",
};

export const dynamic = "force-dynamic";

export default async function BuildDetailPage({ params }: BuildPageProps) {
  const { data: build } = await supabase
    .from("pc_builds")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!build) notFound();

  const { data: parts } = await supabase
    .from("pc_build_parts")
    .select("quantity, component:pc_components(id, name, brand, component_type)")
    .eq("build_id", build.id);

  const fmt = (n: number | null) =>
    n == null ? "—" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <Link href="/builder/saved" className="text-sm text-slate-400 hover:text-blue-400">
          ← Build Saya
        </Link>
        <Link href="/builder" className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium hover:opacity-90">
          Buat Baru
        </Link>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{build.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
            {build.build_type}
          </span>
          <span className="font-semibold text-blue-400">{fmt(build.total_price)}</span>
          <span>❤️ {build.like_count}</span>
          <span>{build.is_public ? "🌍 Publik" : "🔒 Privat"}</span>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/70">
              <th className="text-left p-4 text-slate-400 font-medium">Tipe</th>
              <th className="text-left p-4 text-slate-400 font-medium">Komponen</th>
              <th className="text-left p-4 text-slate-400 font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            {(parts as unknown as { quantity: number; component: { id: string; name: string; brand: string | null; component_type: string } }[] ?? []).map((p) => (
              <tr key={p.component.id} className="border-b border-slate-800">
                <td className="p-4 text-slate-400 whitespace-nowrap">{TYPE_LABEL[p.component.component_type] ?? p.component.component_type}</td>
                <td className="p-4 text-slate-200">
                  {p.component.brand ? <span className="text-slate-500 mr-1">{p.component.brand}</span> : null}
                  {p.component.name}
                </td>
                <td className="p-4 text-slate-300">{p.quantity}</td>
              </tr>
            ))}          </tbody>
        </table>
      </div>
    </main>
  );
}
