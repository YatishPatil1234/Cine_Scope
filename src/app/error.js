"use client";

export default function GlobalError({ error, reset }) {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="bg-card/70 backdrop-blur-md border border-slate-800 rounded-2xl p-10 max-w-md shadow-xl shadow-black/30">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>

        <p className="text-muted-foreground mb-8 text-sm">
          An unexpected error occurred. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition shadow-lg shadow-indigo-500/20"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
