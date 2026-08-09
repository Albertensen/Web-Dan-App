"use client"
import { useState } from "react"
import TagSelector from "./TagSelector"
import TipTapEditor from "./TipTapEditor"

interface CategoryOption {
  slug: string
  name: string
}

interface NewThreadFormProps {
  categories: CategoryOption[]
}

export default function NewThreadForm({ categories }: NewThreadFormProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(categories[0]?.slug ?? "")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError("")

    const plainContent = content.replace(/<[^>]*>/g, "").trim()
    if (title.trim().length < 5) {
      setError("Judul minimal 5 karakter")
      return
    }
    if (plainContent.length < 10) {
      setError("Konten minimal 10 karakter")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category_slug: category, content, tags }),
      })

      if (!res.ok) {
        throw new Error("Gagal membuat thread")
      }
      window.location.href = "/forum"
    } catch {
      setError("Gagal membuat thread. Pastikan sudah login.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-8 bg-surface rounded-xl shadow-2xl border border-slate-300">
      {error && <p className="text-red-400 text-sm p-3 bg-red-900/30 rounded-lg">{error}</p>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-muted mb-1">Judul Thread</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Rekomendasi GPU budget 3 juta"
          className="w-full p-3 border border-slate-300 rounded-lg bg-surface text-foreground focus:ring-accent/40 focus:border-accent transition duration-150 placeholder:text-tertiary"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-muted mb-1">Kategori</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg bg-surface text-foreground focus:ring-accent/40 focus:border-accent transition duration-150 appearance-none cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-muted mb-1">Konten</label>
        <TipTapEditor value={content} onChange={setContent} placeholder="Tulis detail pertanyaan atau topik diskusi..." />
      </div>

      <TagSelector value={tags} onChange={setTags} />

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-accent font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-accent/20"
      >
        {submitting ? "Membuat..." : "Buat Thread"}
      </button>
    </form>
  )
}