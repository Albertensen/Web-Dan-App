import Link from "next/link";

export const metadata = { title: "Syarat & Ketentuan — TeknoHub" };

export default function TermsPage() {
  return (
    <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Syarat &amp; Ketentuan</h1>
      <p className="text-sm text-tertiary mb-8">Terakhir diperbarui: 15 Agustus 2026</p>
      <div className="space-y-6 text-tertiary leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Penggunaan Layanan</h2>
          <p>Dengan menggunakan TeknoHub, Anda menyetujui syarat berikut. TeknoHub menyediakan katalog produk elektronik, forum komunitas, dan layanan rekomendasi PC Builder berbasis AI.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Akun Pengguna</h2>
          <p>Anda bertanggung jawab menjaga kerahasiaan kredensial akun dan semua aktivitas yang terjadi di akun Anda. Dilarang membuat akun palsu atau menyalahgunakan fitur forum.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Transaksi</h2>
          <p>Harga produk tercantum dalam Rupiah. Pembayaran diproses melalui Midtrans. Pesanan diproses sesuai ketersediaan stok yang tertera.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Batasan Tanggung Jawab</h2>
          <p>Rekomendasi dari AI PC Builder bersifat informatif dan tidak mengikat. TeknoHub tidak bertanggung jawab atas kerugian akibat keputusan pembelian berdasarkan rekomendasi tersebut.</p>
        </section>
      </div>
      <p className="mt-10 text-sm text-tertiary">
        Ada pertanyaan? Hubungi kami melalui forum atau <Link href="/" className="text-accent hover:underline">halaman utama</Link>.
      </p>
    </main>
  );
}
