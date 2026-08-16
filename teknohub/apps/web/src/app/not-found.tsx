import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 min-h-[60vh] text-center">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center text-4xl mx-auto mb-4 border border-border">
          🔍
        </div>
        <h1 className="text-4xl font-extrabold text-foreground mb-2">404</h1>
        <h2 className="text-lg font-bold text-foreground mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-tertiary mb-6 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau tautan rusak.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-accent text-white font-semibold text-xs hover:bg-accent-secondary transition"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/shop/products"
            className="px-6 py-2.5 rounded-full bg-surface-2 border border-border text-foreground font-semibold text-xs hover:border-accent transition"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </main>
  );
}
