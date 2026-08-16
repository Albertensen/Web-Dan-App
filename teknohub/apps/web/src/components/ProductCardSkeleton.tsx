export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col animate-pulse">
      <div className="aspect-square rounded-xl mb-3 bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-800 mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-1" />
      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-3" />
      <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
      <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
  );
}
