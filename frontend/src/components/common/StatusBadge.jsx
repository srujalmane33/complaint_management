// ─── StatusBadge ────────────────────────────────────────────────────────────
const statusConfig = {
  PENDING_REVIEW: { label: "Pending Review", dot: "bg-amber-400",  bg: "bg-amber-50",  text: "text-amber-800",  border: "border-amber-200" },
  GENUINE:        { label: "Genuine",         dot: "bg-blue-500",   bg: "bg-blue-50",   text: "text-blue-800",   border: "border-blue-200"  },
  NOT_GENUINE:    { label: "Not Genuine",     dot: "bg-rose-500",   bg: "bg-rose-50",   text: "text-rose-800",   border: "border-rose-200"  },
  ASSIGNED:       { label: "Assigned",        dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200"},
  IN_PROGRESS:    { label: "In Progress",     dot: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200"},
  RESOLVED:       { label: "Resolved",        dot: "bg-emerald-500",bg: "bg-emerald-50",text: "text-emerald-800",border: "border-emerald-200"},
  CLOSED:         { label: "Closed",          dot: "bg-gray-400",   bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200"  },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.PENDING_REVIEW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} leading-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}