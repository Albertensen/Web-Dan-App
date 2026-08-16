"use client";

import { useState, useRef } from "react";
import ProductImage from "./ProductImage";

interface Props { images: (string | null)[]; name: string; category: string; }

export default function ProductGallery({ images, name, category }: Props) {
  const list = (images && images.length ? images : [null]).slice(0, 5);
  const [active, setActive] = useState(0);
  const cur = list[active] ?? null;

  // Swipe kiri/kanan utk ganti foto di mobile
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    setActive((i) => {
      if (dx < 0) return list.length - 1 > i ? i + 1 : i; // swipe kiri → next
      return i > 0 ? i - 1 : i;                          // swipe kanan → prev
    });
  };

  return (
    <div>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer select-none"
      >
        <ProductImage src={cur} alt={name} category={category} fill sizes="(max-width:768px) 100vw,50vw" className="object-cover" />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 mt-2">
          {list.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition ${active===i ? "border-accent" : "border-slate-200 dark:border-slate-800 hover:border-accent/50"}`}>
              <ProductImage src={img} alt={`${name} ${i+1}`} category={category} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
