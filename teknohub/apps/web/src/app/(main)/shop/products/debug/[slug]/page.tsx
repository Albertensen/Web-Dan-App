import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default async function DebugPage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();
  return (
    <div>
      <p>DATA: {JSON.stringify(data?.name ?? "NONE")}</p>
      <p>ERR: {JSON.stringify(error?.message ?? "none")}</p>
    </div>
  );
}
