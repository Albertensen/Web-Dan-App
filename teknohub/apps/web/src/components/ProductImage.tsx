"use client";

import Image from "next/image";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  category?: string | null;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

const ICONS: Record<string, React.ReactNode> = {
  laptop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20M7 16v2M12 16v2M17 16v2" />
    </svg>
  ),
  smartphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  gpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <path d="M7 10v4M11 10v4M15 10v4M19 10v4" />
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </svg>
  ),
  ram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9v6M12 9v6M17 9v6M3 12h2M19 12h2" />
    </svg>
  ),
  storage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
};

export default function ProductImage({ src, alt, category, fill, className = "", sizes }: ProductImageProps) {
  if (src) {
    if (fill) {
      return <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover ${className}`} />;
    }
    return <Image src={src} alt={alt} width={800} height={1000} sizes={sizes} className={`object-cover ${className}`} />;
  }
  const icon = ICONS[category ?? ""] ?? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-slate-500 ${className}`}>
      {icon}
    </div>
  );
}
