import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase/client";
import OrderList from "@/components/OrderList";

export const metadata = {
  title: "Riwayat Pesanan — TeknoHub",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Riwayat Pesanan</h1>
      <p className="text-tertiary mb-6">Semua transaksi kamu di TeknoHub</p>
      <OrderList orders={orders ?? []} />
    </main>
  );
}
