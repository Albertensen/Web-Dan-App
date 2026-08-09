import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import NewThreadForm from "@/components/forum/NewThreadForm";

export const metadata = {
  title: "Buat Thread — TeknoHub Forum",
};

export default async function NewThreadPage() {
  const { data: categories } = await supabase
    .from("forum_categories")
    .select("slug, name")
    .order("sort_order", { ascending: true });

  return (
    <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/forum" className="hover:text-blue-400">
          Forum
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-medium">Buat Thread</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">Buat Thread Baru</h1>
      <p className="text-slate-400 mb-8">Mulai diskusi topik tech atau AI</p>

      <div className="glow-card p-6">
        <NewThreadForm categories={categories ?? []} />
      </div>
    </main>
  );
}
