export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
        </div>
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
          Loading
        </span>
      </div>
    </div>
  );
}
