import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-slate-300 px-4 sm:px-6 h-14 flex items-center justify-between gap-3 w-full">
      <div className="min-w-0 flex-1">
        <h1 className="text-sm sm:text-base font-bold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-[10px] sm:text-xs text-tertiary truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800 border border-green-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> DB
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> AI
        </span>
        <Link
          href="/"
          className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-semibold bg-surface-2 border border-slate-300 text-muted hover:border-accent hover:text-accent transition whitespace-nowrap"
        >
          ← Toko
        </Link>
      </div>
    </header>
  );
}
