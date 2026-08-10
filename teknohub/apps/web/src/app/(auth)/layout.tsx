import Link from "next/link";

/** Layout split: kiri branding dark premium, kanan konten form auth */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-10rem)]">
      {/* Panel kiri — branding TeknoZone */}
      <aside className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-accent via-accent-secondary to-accent p-12 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-zone-blue/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent-secondary/20 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2.5 z-10">
          <span className="w-3.5 h-3.5 bg-zone-blue rounded-full" />
          <span className="text-2xl font-extrabold tracking-tight">
            <span>Tekno</span>
            <span className="text-zone-blue">Zone</span>
          </span>
        </Link>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            Pusat Hardware &amp; Komunitas Teknologi Terpercaya
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Rakit PC, belanja komponen, dan diskusi dengan komunitas. Satu akun untuk
            semua — dari marketplace sampai forum.
          </p>
          <div className="flex flex-col gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">🛒</span>
              Marketplace komponen &amp; gadget
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">💬</span>
              Forum komunitas &amp; reputasi member
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">🤖</span>
              PC Builder dengan bantuan Agent AI
            </div>
          </div>
        </div>
        <p className="relative z-10 text-[11px] text-slate-400">
          © 2026 TeknoZone. Rakit mudah, komunitas aktif.
        </p>
      </aside>

      {/* Panel kanan — form */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
