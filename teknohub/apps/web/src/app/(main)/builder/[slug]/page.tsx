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
        <Link href="/builder/saved" className="text-sm text-tertiary hover:text-accent">
          ← Build Saya
        </Link>
        <Link href="/builder" className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90">
          Buat Baru
        </Link>
      </div>

      <div className="bg-surface-2/60 p-6 rounded-xl shadow-lg border border-slate-300 mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{build.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-tertiary">
          <span className="px-2 py-0.5 rounded-full bg-accent-dim text-accent border border-accent/30">
            {build.build_type}
          </span>
          <span className="font-semibold text-accent">{fmt(build.total_price)}</span>
          <span>❤️ {build.like_count}</span>
          <span>{build.is_public ? "🌍 Publik" : "🔒 Privat"}</span>
        </div>
      </div>

      <div className="bg-surface-2/60 rounded-xl shadow-lg border border-slate-300 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-300 bg-surface-2/70">
              <th className="text-left p-4 text-tertiary font-medium">Tipe</th>
              <th className="text-left p-4 text-tertiary font-medium">Komponen</th>
              <th className="text-left p-4 text-tertiary font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            {(parts as unknown as { quantity: number; component: { id: string; name: string; brand: string | null; component_type: string } }[] ?? []).map((p) => (
              <tr key={p.component.id} className="border-b border-slate-300">
                <td className="p-4 text-tertiary whitespace-nowrap">{TYPE_LABEL[p.component.component_type] ?? p.component.component_type}</td>
                <td className="p-4 text-foreground">
                  {p.component.brand ? <span className="text-slate-500 mr-1">{p.component.brand}</span> : null}
                  {p.component.name}
                </td>
                <td className="p-4 text-muted">{p.quantity}</td>
              </tr>
            ))}          </tbody>
        </table>
      </div>
    </main>
  );
}
