"use client";

const SUGGESTED_TAGS = ["Gaming", "AI", "Hardware", "Review", "Troubleshoot", "Build", "Budget", "Software"];

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ value, onChange }: TagSelectorProps) {
  const toggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (value.length < 5) {
      onChange([...value, tag]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-300">
        Tags (maks 5)
      </label>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              value.includes(tag)
                ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
      {value.length > 0 && (
        <div className="mt-2 text-xs text-slate-500">
          Dipilih: {value.map((t) => `#${t}`).join(", ")}
        </div>
      )}
    </div>
  );
}
