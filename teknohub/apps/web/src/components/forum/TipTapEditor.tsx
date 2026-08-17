"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { useState, useEffect } from "react";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ value, onChange, placeholder = "Tulis konten..." }: TipTapEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Image.configure({ inline: true, allowBase64: false })],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[140px] px-4 py-3 text-foreground",
        placeholder: placeholder,
      },
    },
  });

  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  if (!mounted) {
    return (
      <div className="min-h-[140px] p-4 rounded-2xl bg-surface-2/60 border border-slate-200 dark:border-slate-800 animate-pulse text-xs text-muted flex items-center justify-center">
        Memuat editor teks...
      </div>
    );
  }

  const insertImage = (url: string, alt = "gambar") => {
    if (editor) {
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setUploadErr("Hanya file gambar yang diizinkan");
      return;
    }
    setUploading(true);
    setUploadErr("");
    try {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase() || ".jpg";
      const path = `forum/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const tokenRes = await fetch("/api/forum/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, contentType: file.type }),
      });
      const tokenJson = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenJson.error || "Gagal buat upload");
      await fetch(tokenJson.signedUrl, { method: "PUT", body: file });
      insertImage(tokenJson.publicUrl);
    } catch {
      setUploadErr("Upload gambar gagal. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`px-2.5 py-1.5 rounded text-sm transition ${
        active ? "bg-blue-500/30 text-accent" : "text-tertiary hover:bg-surface-2 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-300 dark:border-slate-800 rounded-2xl bg-surface overflow-hidden shadow-sm">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-300 dark:border-slate-800 bg-surface-2/60 flex-wrap">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton label="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>S</s>
        </ToolbarButton>
        <span className="w-px h-5 bg-surface-2 mx-1" />
        <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •≡
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1≡
        </ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </ToolbarButton>
        <span className="w-px h-5 bg-surface-2 mx-1" />
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </ToolbarButton>
        <label className="cursor-pointer px-2.5 py-1.5 rounded text-sm text-tertiary hover:bg-surface-2 hover:text-foreground" title="Upload gambar/screenshot">
          🖼
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
        </label>
      </div>
      <div className="px-3 py-1.5 border-t border-slate-300 dark:border-slate-800 bg-surface-2/40 flex items-center gap-2">
        {uploading ? <span className="text-xs text-accent">Mengunggah gambar...</span> : null}
        {uploadErr && <span className="text-xs text-red-600">{uploadErr}</span>}
        <span className="text-[10px] text-tertiary ml-auto">@product:slug utk sematkan kartu produk</span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
