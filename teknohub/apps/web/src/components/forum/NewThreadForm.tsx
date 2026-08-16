"use client";

import { useState } from "react";
import TagSelector from "./TagSelector";
import TipTapEditor from "./TipTapEditor";

interface CategoryOption {
  slug: string;
  name: string;
}

interface NewThreadFormProps {
  categories: CategoryOption[];
}

export default function NewThreadForm({ categories }: NewThreadFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.slug ?? "hardware");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    const plainContent = content.replace(/<[^>]*>/g, "").trim();
    if (title.trim().length < 5) {
      setError("Judul minimal 5 karakter");
      return;
    }
    if (plainContent.length < 10) {
      setError("Konten diskusi minimal 10 karakter");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category_slug: category, content, tags }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error || "Gagal membuat thread. Pastikan Anda sudah login.");
        return;
      }

      window.location.href = `/forum/${category}/${json.data?.id || ""}`;
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 sm:p-8 bg-surface rounded-2xl shadow-xl border border-slate-300">
      {error && (
        <div className="p-3.5 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wide">
          Judul Thread
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Rekomendasi Build PC Gaming Budget 10 Juta"
          className="w-full p-3 border border-slate-300 rounded-xl bg-surface text-foreground text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition placeholder:text-tertiary"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wide">
          Kategori Forum
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-xl bg-surface text-foreground text-sm focus:ring-2 focus:ring-accent/40 focus:border-accent transition cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wide">
          Isi Diskusi
        </label>
        <TipTapEditor value={content} onChange={setContent} placeholder="Tulis rincian pertanyaan, panduan, atau topik diskusi Anda..." />
      </div>

      <div>
        <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wide">
          Tagar Diskusi (Maks 5)
        </label>
        <TagSelector value={tags} onChange={setTags} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-secondary transition disabled:opacity-50 shadow-lg shadow-accent/20"
      >
        {submitting ? "Membuat Diskusi..." : "+ Publikasikan Thread"}
      </button>
    </form>
  );
}
