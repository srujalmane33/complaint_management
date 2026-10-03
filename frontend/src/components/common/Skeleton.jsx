// ─── Skeleton Placeholder ──────────────────────────────────────────────────
// Usage: <Skeleton className="h-4 w-32 rounded-lg" />

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`skeleton rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

// ─── Card Skeleton ──────────────────────────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

// ─── Stats Grid Skeleton ────────────────────────────────────────────────────
export function StatsSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Table Skeleton ─────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={`h-3 ${i === 0 ? "w-24" : i === cols - 1 ? "w-16 ml-auto" : "w-20"}`} />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-4 flex items-center gap-6">
            <Skeleton className="h-3.5 w-24 flex-shrink-0" />
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Spinner ────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", color = "blue" }) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-8 h-8 border-3" };
  const colors = {
    blue:   "border-blue-600 border-t-transparent",
    rose:   "border-rose-600 border-t-transparent",
    purple: "border-purple-600 border-t-transparent",
    white:  "border-white border-t-transparent",
  };
  return (
    <div
      className={`rounded-full animate-spin ${sizes[size]} ${colors[color]}`}
      style={{ animation: "spin 0.7s linear infinite" }}
      aria-label="Loading"
    />
  );
}

// ─── Full Page Loader ───────────────────────────────────────────────────────
export function PageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-50 gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-600/30">
        C
      </div>
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}

// ─── Inline Content Loader ──────────────────────────────────────────────────
export function ContentLoader({ message = "Fetching data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner size="md" />
      <p className="text-xs text-gray-400 font-medium">{message}</p>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl text-center px-6 animate-fade-in">
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <p className="text-gray-700 text-sm font-semibold">{title}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Error Alert ────────────────────────────────────────────────────────────
export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-slide-up">
      <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold">Something went wrong</p>
        <p className="text-xs mt-0.5 text-red-600">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-red-700 underline hover:no-underline flex-shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  );
}
