const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-sky-100 text-sky-800",
  HIGH: "bg-orange-100 text-orange-800 font-semibold",
  URGENT: "bg-rose-100 text-rose-800 font-bold",
};

export default function PriorityBadge({ priority }) {
  const normalized = priority || "MEDIUM";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
        priorityStyles[normalized] || "bg-gray-100 text-gray-700"
      }`}
    >
      {normalized}
    </span>
  );
}