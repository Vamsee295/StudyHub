export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 pb-12 w-full animate-pulse">
      {/* PAGE HEADER SKELETON */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]/80">
        <div>
          <div className="h-9 w-64 bg-[var(--border)]/70 rounded-lg"></div>
          <div className="h-4 w-72 bg-[var(--border)]/50 rounded-md mt-3"></div>
        </div>
        
        {/* Quick Stats Skeleton */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="h-16 w-36 bg-[var(--surface)] border border-[var(--border)] rounded-lg"></div>
          <div className="h-16 w-44 bg-[var(--surface)] border border-[var(--border)] rounded-lg"></div>
          <div className="h-16 w-32 bg-[var(--surface)] border border-[var(--border)] rounded-lg"></div>
        </div>
      </section>

      {/* MAIN DASHBOARD GRID SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] h-52"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[var(--surface)] h-28 rounded-xl border border-[var(--border)]"></div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] h-72"></div>
          <div className="bg-[var(--accent-soft)] rounded-xl p-6 border border-[var(--accent-soft-border)] h-40"></div>
        </div>
      </div>
    </div>
  );
}
