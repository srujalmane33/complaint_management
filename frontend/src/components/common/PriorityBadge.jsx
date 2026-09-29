// ─── PriorityBadge ───────────────────────────────────────────────────────────
const priorityConfig = {
  LOW:    { label: "Low",    bg: "bg-slate-100",  text: "text-slate-600",  icon: "↓" },
  MEDIUM: { label: "Medium", bg: "bg-sky-100",    text: "text-sky-700",    icon: "→" },
  HIGH:   { label: "High",   bg: "bg-orange-100", text: "text-orange-700", icon: "↑" },
  URGENT: { label: "Urgent", bg: "bg-rose-100",   text: "text-rose-700",   icon: "⚡" },
};

export default function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${cfg.bg} ${cfg.text} leading-none`}
    >
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}