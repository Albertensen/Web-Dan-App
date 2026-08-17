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

  if (!mounted) {
    return (
      <div className="min-h-[140px] p-4 rounded-xl bg-surface-2 border border-slate-300 dark:border-slate-800 animate-pulse text-xs text-muted flex items-center justify-center">
        Memuat editor balasan...
      </div>
    );
  }

  return (
    <div className="border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden bg-surface">
      <EditorContent editor={editor} />
    </div>
  );
}
