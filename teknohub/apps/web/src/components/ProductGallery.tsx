"use client";

import { useState } from "react";
import ProductImage from "./ProductImage";

interface Props { images: (string | null)[]; name: string; category: string; }

export default function ProductGallery({ images, name, category }: Props) {
  const list = (images && images.length ? images : [null]).slice(0, 5);
  const [active, setActive] = useState(0);
  const cur = list[active] ?? null;

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
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
