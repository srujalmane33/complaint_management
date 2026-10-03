import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PriorityBadge from "../../components/common/PriorityBadge";
import StatusBadge from "../../components/common/StatusBadge";
import { getPendingComplaints } from "../../services/teacherService";
import { TableSkeleton, ErrorAlert, EmptyState } from "../../components/common/Skeleton";
import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPendingComplaints();
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.complaints)) list = res.complaints;
      setComplaints(list);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pending complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.complaint_number?.toLowerCase().includes(q) ||
        item.student_name?.toLowerCase().includes(q) ||
        item.roll_number?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q);

      const matchesPriority =
        priorityFilter === "ALL" ||
        item.priority?.toUpperCase() === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [complaints, searchQuery, priorityFilter]);

  const urgentCount = useMemo(
    () => complaints.filter((c) => c.priority?.toUpperCase() === "HIGH" || c.priority?.toUpperCase() === "URGENT").length,
    [complaints]
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-violet-50 text-violet-700 tracking-wider uppercase">
              Teacher Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Pending Verifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-700">{user?.name || "Teacher"}</span>. Manage and review pending student grievances.
          </p>
        </div>

        <button
          onClick={fetchPending}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          <svg
            className={`w-3.5 h-3.5 text-gray-500 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* ── Metric Cards ── */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xl">
              📋
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Awaiting Review</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{complaints.length}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">High / Urgent</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{urgentCount}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              ✨
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                {complaints.length === 0 ? "All Cleared" : "Action Needed"}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <ErrorAlert message={error} onRetry={fetchPending} />}

      {/* ── Search & Filter Bar ── */}
      {!loading && complaints.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by student, roll number, complaint #, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none transition font-medium text-gray-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {(searchQuery || priorityFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPriorityFilter("ALL");
                }}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 underline transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Table Content ── */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="You're all caught up!"
          subtitle="No student complaints are currently pending your verification."
        />
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-sm">No complaints match your current search or filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Complaint ID</th>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Issue & Location</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-violet-50/30 transition-colors group">
                    <td className="py-4 px-5">
                      <span className="font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded text-[11px]">
                        {item.complaint_number}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                          {item.student_name ? item.student_name.slice(0, 2) : "ST"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 leading-tight">{item.student_name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                            {item.roll_number} · {item.department_name || "Dept"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 max-w-[240px]">
                      <p className="font-medium text-gray-800 truncate leading-snug" title={item.title}>
                        {item.title}
                      </p>
                      {item.location && (
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <span>📍</span> {item.location}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/teacher/complaints/${item.id}/verify`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl shadow-xs transition active:scale-95"
                      >
                        Review
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>
              Showing {filteredComplaints.length} of {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}