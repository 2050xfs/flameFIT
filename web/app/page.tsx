export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[var(--background)]">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[var(--primary)] to-[var(--secondary)] pb-2">
          FLAMEFIT
        </h1>
      </div>
      <div className="mt-8">
        <a href="/dashboard" className="px-8 py-4 rounded-xl bg-[var(--primary)] text-black font-bold text-lg hover:opacity-90 transition-opacity">
          Enter App
        </a>
      </div>

      <div className="mt-12 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-6">
        <div className="glass p-8 rounded-2xl card-hover cursor-pointer border border-[var(--border)]">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            AI Companion{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50 text-[var(--foreground)]">
            Chat with The Spark to log meals and request workouts instantly.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl card-hover cursor-pointer border border-[var(--border)]">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--success)]">
            Dynamic Plans{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50 text-[var(--foreground)]">
            Generated schedules for Bulk, Cut, or Maintenance phases.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl card-hover cursor-pointer border border-[var(--border)]">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--warning)]">
            Pro Stats{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50 text-[var(--foreground)]">
            Deep dive into your macros and progress metrics.
          </p>
        </div>
      </div>
    </main>
  );
}
