import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyComplaints } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import { TableSkeleton, ErrorAlert, EmptyState } from "../../components/common/Skeleton";
import { useAuth } from "../../context/AuthContext";

const summaryConfig = [
  { key: "total",          label: "Total",    icon: "📋", bg: "bg-blue-50 text-blue-700 border-blue-100",    filterKey: "" },
  { key: "PENDING_REVIEW", label: "Pending",  icon: "⏳", bg: "bg-amber-50 text-amber-700 border-amber-100",  filterKey: "PENDING_REVIEW" },
  { key: "GENUINE",        label: "Verified", icon: "✅", bg: "bg-emerald-50 text-emerald-700 border-emerald-100", filterKey: "GENUINE" },
  { key: "RESOLVED",       label: "Resolved", icon: "🎉", bg: "bg-green-50 text-green-700 border-green-100",  filterKey: "RESOLVED" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyComplaints();
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.complaints)) list = res.complaints;
      else if (Array.isArray(res?.data?.complaints)) list = res.data.complaints;
      else if (Array.isArray(res?.data?.data)) list = res.data.data;
      setComplaints(list);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    total: complaints.length,
    PENDING_REVIEW: complaints.filter((c) => c.status === "PENDING_REVIEW").length,
    GENUINE: complaints.filter((c) => c.status === "GENUINE").length,
    RESOLVED: complaints.filter((c) => c.status === "RESOLVED").length,
  };

  const filtered = activeFilter ? complaints.filter((c) => c.status === activeFilter) : complaints;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Student Portal</p>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hello, <span className="font-semibold text-gray-700">{user?.name}</span> — track all your submitted grievances
          </p>
        </div>
        <Link
          to="/student/complaints/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-600/25 transition-all duration-150 active:scale-95 flex-shrink-0"
        >
          <span className="text-base leading-none">+</span> File New Complaint
        </Link>
      </div>

      {/* ── Summary Cards (clickable filters) ── */}
      {!loading && complaints.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaryConfig.map(({ key, label, icon, bg, filterKey }) => {
            const isActive = activeFilter === filterKey;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(isActive ? "" : filterKey)}
                className={`${bg} border rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.97] hover:opacity-90 ${
                  isActive ? "ring-2 ring-current ring-offset-1 opacity-100" : "opacity-80 hover:opacity-100"
                }`}
              >
                <p className="text-xl mb-1.5">{icon}</p>
                <p className="text-2xl font-black leading-none">{counts[key]}</p>
                <p className="text-[11px] font-bold mt-1 opacity-70 uppercase tracking-wide">{label}</p>
              </button>
            );
          })}
        </div>
      )}

      {error && <ErrorAlert message={error} onRetry={fetchComplaints} />}

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={activeFilter ? "🔍" : "📋"}
          title={activeFilter ? "No complaints with this status" : "No complaints yet"}
          subtitle={activeFilter ? "Try selecting a different category above" : "Submit your first complaint and track its progress here"}
          action={
            !activeFilter ? (
              <Link to="/student/complaints/new" className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition active:scale-95">
                + File New Complaint
              </Link>
            ) : (
              <button onClick={() => setActiveFilter("")} className="px-4 py-2 text-blue-600 text-xs font-bold hover:underline">
                Show all complaints
              </button>
            )
          }
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="py-3.5 px-5">Complaint #</th>
                  <th className="py-3.5 px-5">Title</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Filed On</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="py-3.5 px-5 font-mono font-bold text-gray-700 text-[11px]">
                      {item.complaint_number}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-gray-800 max-w-[200px]">
                      <p className="truncate">{item.title}</p>
                      {item.category && <p className="text-[11px] text-gray-400 mt-0.5">{item.category}</p>}
                    </td>
                    <td className="py-3.5 px-5"><PriorityBadge priority={item.priority} /></td>
                    <td className="py-3.5 px-5"><StatusBadge status={item.status} /></td>
                    <td className="py-3.5 px-5 text-gray-400 tabular-nums">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "N/A"}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/student/complaints/${item.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-xs transition group-hover:gap-2"
                      >
                        View <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeFilter && (
            <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {complaints.length} complaints</p>
              <button onClick={() => setActiveFilter("")} className="text-xs text-blue-600 font-bold hover:underline">Clear filter</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}