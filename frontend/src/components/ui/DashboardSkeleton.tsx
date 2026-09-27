export function DashboardSkeleton() {
  return (
    <div className="animate-pulse p-6 md:p-8">
      <div className="mb-8 h-8 w-64 rounded-lg bg-slate-200" />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
          <div className="h-56 rounded-xl border border-slate-200 bg-white" />
        </div>
        <div className="space-y-4">
          <div className="h-48 rounded-xl border border-slate-200 bg-white" />
          <div className="h-56 rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}
