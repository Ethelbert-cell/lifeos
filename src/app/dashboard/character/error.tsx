"use client";
export default function CharacterError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-rose-400 font-semibold">Failed to load Character page</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-all">
        Try again
      </button>
    </div>
  );
}
