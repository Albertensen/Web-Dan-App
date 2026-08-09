interface TagBadgeProps {
  tag: string;
  href?: string;
}

export default function TagBadge({ tag, href }: TagBadgeProps) {
  const cls = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-blue-300 border border-slate-700 hover:border-blue-500/50 transition";

  if (href) {
    return (
      <a href={href} className={cls}>
        #{tag}
      </a>
    );
  }
  return <span className={cls}>#{tag}</span>;
}
