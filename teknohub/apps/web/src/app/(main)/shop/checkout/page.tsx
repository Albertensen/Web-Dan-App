import CheckoutForm from "@/components/CheckoutForm";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Checkout</h1>
      <p className="text-tertiary text-sm mb-8">Lengkapi alamat pengiriman. Total dihitung dari keranjang belanja.</p>
      <CheckoutForm />
      <Link href="/shop/cart" className="text-sm text-tertiary hover:text-accent block mt-6">
        ← Kembali ke keranjang
      </Link>
    </main>
  );
}