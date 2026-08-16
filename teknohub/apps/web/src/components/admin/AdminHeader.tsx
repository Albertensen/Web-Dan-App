import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

/** Top header admin: judul halaman + status DB/AI/Cron */
export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-slate-300 px-6 h-14 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-tertiary truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 border border-green-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> DB
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> AI
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Cron
        </span>
        <Link href="/" className="ml-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-2 border border-slate-300 text-muted hover:border-accent hover:text-accent transition">
          ← Kembali ke Toko
        </Link>
      </div>
    </header>
  );
}
