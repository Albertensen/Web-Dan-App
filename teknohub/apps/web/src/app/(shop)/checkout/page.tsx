import CheckoutForm from "@/components/CheckoutForm";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2 text-slate-200">Checkout</h1>
      <p className="text-slate-400 text-sm mb-8">Lengkapi alamat pengiriman. Total dihitung dari keranjang belanja.</p>
      <CheckoutForm />
      <Link href="/cart" className="text-sm text-slate-400 hover:text-blue-400 block mt-6">
        ← Kembali ke keranjang
      </Link>
    </main>
  );
}