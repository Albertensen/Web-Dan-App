"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";

interface MentionProduct {
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  category: string;
}

export function extractProductMentions(text: string): string[] {
  const re = /@product:([a-z0-9-]+)/gi;
  const found: string[] = [];
  let m;
  while ((m = re.exec(text || "")) !== null) {
    if (!found.includes(m[1])) found.push(m[1]);
  }
  return found;
}

export function renderMentions(html: string): string {
  return (html || "").replace(/@product:([a-z0-9-]+)/gi, (match, slug) => {
    return `<span data-product-mention="${slug}" class="product-mention-chip inline-block px-2 py-0.5 rounded-full bg-accent-dim text-accent text-xs font-semibold">@${slug}</span>`;
  });
}

// Component utk merender kartu mini produk dari mention di content
export default function ProductMention({ text }: { text: string }) {
  const slugs = extractProductMentions(text);
  const [products, setProducts] = useState<MentionProduct[]>([]);

  useEffect(() => {
    if (!slugs.length) { setProducts([]); return; }
    let alive = true;
    fetch(`/api/products?limit=50&brands=&in_stock=`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const all: MentionProduct[] = j.data ?? [];
        setProducts(all.filter((p) => slugs.includes(p.slug)));
      })
      .catch(() => setProducts([]));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!products.length) return null;
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col gap-2 my-3">
      {products.map((p) => (
        <div key={p.slug} className="flex items-center gap-3 p-2 border border-accent/40 rounded-xl bg-surface">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
            <ProductImage src={p.image_url} alt={p.name} category={p.category} fill sizes="40px" className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
            <p className="text-xs font-bold text-accent">{fmt(p.price)}</p>
          </div>
          <Link
            href={`/shop/products/${p.slug}`}
            className="shrink-0 px-3 py-1.5 rounded-full bg-accent text-white text-[11px] font-bold hover:bg-accent-secondary transition"
          >
            Beli Sekarang
          </Link>
        </div>
      ))}
    </div>
  );
}
