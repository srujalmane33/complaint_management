const statusStyles = {
  PENDING_REVIEW: "bg-amber-100 text-amber-800 border-amber-300",
  GENUINE: "bg-blue-100 text-blue-800 border-blue-300",
  NOT_GENUINE: "bg-rose-100 text-rose-800 border-rose-300",
  ASSIGNED: "bg-purple-100 text-purple-800 border-purple-300",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800 border-indigo-300",
  RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function StatusBadge({ status }) {
  const normalized = status || "PENDING_REVIEW";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        statusStyles[normalized] || "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      {normalized.replace(/_/g, " ")}
    </span>
  );
}