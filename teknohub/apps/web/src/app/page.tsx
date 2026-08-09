const featured = [
  {
    badge: null,
    label: "Ultrabook",
    title: "SilverBook Pro X",
    desc: "Bodi aluminium silver elegan dengan performa komputasi tinggi tanpa kompromi.",
    price: "Rp 12.499.000",
    image: "[Laptop / Ultrabook]",
    featured: false,
  },
  {
    badge: "Pro Choice",
    label: "Hardware Bundle",
    title: "AI Engine Station",
    desc: "Paket komponen tervalidasi AI untuk kecepatan pemrosesan dan rendering maksimal.",
    price: "Rp 16.800.000",
    image: "[AI Rig Component]",
    featured: true,
  },
  {
    badge: null,
    label: "Peripherals",
    title: "Chrome Mechanical KB",
    desc: "Keyboard mekanikal presisi tinggi dirancang khusus untuk kenyamanan kerja harian.",
    price: "Rp 1.299.000",
    image: "[Peripherals]",
    featured: false,
  },
];

const tiers = [
  {
    icon: "⭐",
    name: "Silver Tier",
    range: "1-9 Transaksi",
    desc: "Pembeli baru. Ulasan buruk (bintang 1-2) memiliki bobot peredam khusus agar lapak terhindar dari persaingan kotor instan, namun bukti valid tetap transparan.",
    border: "border-slate-300",
    badge: null,
  },
  {
    icon: "⭐⭐",
    name: "Gold Tier",
    range: "10-50 Transaksi",
    desc: "Pelanggan setia platform. Memberikan bobot ulasan yang adil dan membangun kepercayaan penuh bagi calon pembeli lain.",
    border: "border-2 border-amber-600",
    badge: { text: "Standard Weight", cls: "bg-amber-600" },
  },
  {
    icon: "⭐⭐⭐",
    name: "Diamond Tier",
    range: ">50 Transaksi",
    desc: "Power user & veteran forum. Memiliki tingkat kepercayaan tertinggi dalam menilai kualitas produk dan layanan seller.",
    border: "border-2 border-accent",
    badge: { text: "Highest Trust", cls: "bg-accent" },
  },
];

const reviews = [
  {
    badge: "💎 Diamond Member",
    badgeCls: "bg-accent",
    meta: "• 64 Transaksi Sukses",
    title: "Review Jasa Rakit PC TeknoZone: Rapi dan Kabel Manajemen Sempurna!",
    desc: "Sangat terbantu dengan konsultasi AI agent kemarin, komponen datang sesuai janji dan dirakit tanpa cela.",
    stars: "⭐⭐⭐⭐⭐",
    starsCls: "text-amber-600",
  },
  {
    badge: "⭐ Silver Member",
    badgeCls: "bg-slate-600",
    meta: "• 2 Transaksi Sukses",
    evidence: "Verified Evidence Attached",
    title: "Kendala Pengiriman Kurir (Ada Bukti Foto Dus Penyok)",
    desc: "Kotak luar agak peyot karena ekspedisi, tapi seller responsif membantu klaim garansi asuransi.",
    stars: "⭐⭐⭐",
    starsCls: "text-amber-600",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-40 px-8 max-w-5xl mx-auto text-center">
        <span className="text-accent font-semibold tracking-wider uppercase text-[11px] px-3 py-1 rounded-full bg-accent-dim border border-accent/20 inline-block mb-6">
          Designed for Performance
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground leading-[1.08]">
          Inovasi di setiap <br />
          <span className="text-accent">komponen pilihan.</span>
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          E-commerce elektronik, konsultasi AI agent cerdas, dan forum teknologi
          terpercaya dalam satu ekosistem mulus.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/products"
            className="w-full sm:w-auto bg-accent text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-black transition shadow-md shadow-accent/15"
          >
            Jelajahi Katalog
          </a>
          <a
            href="/builder"
            className="w-full sm:w-auto bg-surface border border-slate-400 text-foreground px-7 py-3.5 rounded-full text-sm font-medium hover:border-accent transition"
          >
            Coba AI Builder &rarr;
          </a>
        </div>
      </section>

      {/* ================= STORE — Featured ================= */}
      <section id="store" className="py-24 px-8 max-w-7xl mx-auto border-t border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs uppercase font-semibold text-accent tracking-widest mb-2 block">
              Hardware Lineup
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Featured Electronics.</h2>
          </div>
          <a href="/products" className="text-sm font-medium text-accent hover:underline mt-4 md:mt-0">
            Lihat semua produk →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((p) => (
            <div
              key={p.title}
              className={`bg-surface rounded-[2.5rem] p-8 flex flex-col justify-between transition duration-300 shadow-sm ${
                p.featured
                  ? "border-2 border-accent shadow-xl shadow-accent/10 relative"
                  : "border border-slate-300 hover:border-accent"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3.5 right-8 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {p.badge}
                </div>
              )}
              <div>
                <div className="h-60 bg-surface-2/60 rounded-3xl mb-6 flex items-center justify-center text-muted text-xs font-medium">
                  {p.image}
                </div>
                <span className="text-[11px] text-muted font-semibold uppercase tracking-wider">
                  {p.label}
                </span>
                <h3 className="text-2xl font-bold mt-1 mb-2 tracking-tight">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-8">{p.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <span className={`text-base font-semibold ${p.featured ? "text-accent" : "text-foreground"}`}>
                  {p.price}
                </span>
                <a
                  href="/products"
                  className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                    p.featured
                      ? "bg-accent hover:bg-black text-white shadow-sm"
                      : "bg-surface-2 hover:bg-accent hover:text-white text-foreground"
                  }`}
                >
                  Beli
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AI BUILDER ================= */}
      <section
        id="ai-builder"
        className="py-24 px-8 max-w-7xl mx-auto border-t border-border bg-surface-2/40 rounded-[3rem] my-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase font-semibold text-accent tracking-widest mb-2 block">
              Intelligence Built-In
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Konsultasi Rakit PC Cerdas dengan AI.
            </h2>
            <p className="text-muted font-medium leading-relaxed mb-6">
              Bingung memilih spesifikasi hardware? AI Agent kami mengecek tingkat
              kompatibilitas daya (watt), mencegah bottleneck, dan membandingkan harga
              terbaik secara real-time.
            </p>
            <ul className="space-y-3 text-sm text-foreground font-medium mb-8">
              <li className="flex items-center gap-3">✓ Cek kompatibilitas komponen otomatis</li>
              <li className="flex items-center gap-3">✓ Kalkulasi kebutuhan daya PSU akurat</li>
              <li className="flex items-center gap-3">✓ Rekomendasi harga termurah di lapak terverifikasi</li>
            </ul>
            <a
              href="/builder"
              className="inline-block bg-accent text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-black transition shadow-md shadow-accent/15"
            >
              Mulai Konsultasi →
            </a>
          </div>
          <div className="bg-foreground text-white p-8 rounded-[2.5rem] shadow-xl border border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> AI Assistant Online
              </span>
              <span className="text-[11px] text-slate-400">TeknoZone Intelligence</span>
            </div>
            <div className="space-y-4 text-xs text-slate-300 mb-6">
              <div className="bg-white/5 p-4 rounded-2xl">
                Halo! Ada yang bisa saya bantu untuk spesifikasi rakit PC atau pengecekan komponen hari ini?
              </div>
              <div className="bg-accent text-white p-4 rounded-2xl ml-auto max-w-[80%]">
                Tolong carikan rakitan PC gaming dan editing budget 15 jutaan aman tanpa bottleneck.
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                Siap! Berdasarkan data stok e-commerce kami, kombinasi RTX 4060 dan i5-13400F sangat optimal. Daya aman (550W PSU).
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/builder"
                className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3 text-xs text-white text-center hover:border-accent transition"
              >
                Buka AI PC Builder
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FORUM & REPUTATION ================= */}
      <section id="forum" className="py-24 px-8 max-w-7xl mx-auto border-t border-border">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold text-accent tracking-widest mb-2 block">
            Community Trust
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Forum &amp; Sistem Reputasi Transparan.
          </h2>
          <p className="text-muted font-medium">
            Diskusi terbuka dengan sistem anti-fake review berbasis tier transaksi (Silver, Gold, Diamond).
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((t) => (
            <div key={t.name} className={`bg-surface border ${t.border} p-6 rounded-[2rem] shadow-sm relative`}>
              {t.badge && (
                <div className={`absolute -top-3 right-6 ${t.badge.cls} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase`}>
                  {t.badge.text}
                </div>
              )}
              <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${t.name.includes("Gold") ? "text-amber-800" : t.name.includes("Diamond") ? "text-accent" : "text-slate-700"}`}>
                {t.icon} {t.name} ({t.range})
              </div>
              <p className="text-xs text-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="bg-surface border border-slate-300 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <h3 className="text-2xl font-bold tracking-tight">Diskusi &amp; Ulasan Terbaru</h3>
            <a
              href="/forum"
              className="bg-accent text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition"
            >
              Buka Forum
            </a>
          </div>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.title}
                className="p-5 bg-surface-2/70 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`${r.badgeCls} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {r.badge}
                    </span>
                    <span className="text-xs text-muted">{r.meta}</span>
                    {r.evidence && (
                      <span className="bg-red-200 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {r.evidence}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{r.title}</h4>
                  <p className="text-xs text-muted mt-0.5">{r.desc}</p>
                </div>
                <div className={`${r.starsCls} font-bold text-sm`}>{r.stars}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border py-16 px-8 text-center text-muted text-xs font-medium tracking-wide">
        <p>© 2026 Tekno Zone. Apple-Inspired Minimalist Typography &amp; Deep Slate Edition.</p>
      </footer>
    </main>
  );
}
