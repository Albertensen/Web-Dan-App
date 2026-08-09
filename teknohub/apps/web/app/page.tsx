import Link from "next/link";

const features = [
  {
    title: "Forum Diskusi",
    desc: "Tanya jawab, sharing pengalaman, dan diskusi hangat seputar teknologi.",
    href: "/forum",
  },
  {
    title: "Review Produk",
    desc: "Database produk gadget & PC lengkap dengan harga terkini.",
    href: "/products",
  },
  {
    title: "Rakitan PC",
    desc: "Bagikan build PC kamu, minta saran, atau tiru rakitan terbaik.",
    href: "/pc-builds",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Komunitas Teknologi{" "}
            <span className="text-primary">Indonesia</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Diskusi, review produk, dan rakitan PC — semua di satu tempat.
            Bergabung dengan ribuan pecinta teknologi lainnya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-primary px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Daftar Gratis
            </Link>
            <Link
              href="/forum"
              className="border border-white/30 px-8 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              Jelajahi Forum
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          Semua Kebutuhan Teknologi Kamu
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold mb-2 text-primary">
                {f.title}
              </h3>
              <p className="text-slate-600">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
