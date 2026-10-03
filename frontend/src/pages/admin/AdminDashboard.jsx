import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboardStats } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import { StatsSkeleton, ErrorAlert } from "../../components/common/Skeleton";

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, bg, text, subLabel, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 transition-all duration-150 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500 ${
        active ? "border-blue-400 ring-2 ring-blue-400/20" : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${bg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-2xl font-bold leading-none ${text}`}>{value ?? "—"}</p>
        <p className="text-xs font-medium text-gray-500 mt-1 leading-tight">{label}</p>
        {subLabel && <p className="text-[11px] text-gray-400 mt-0.5">{subLabel}</p>}
      </div>
    </button>
  );
}

const STAT_CONFIG = [
  { key: "total_complaints",   label: "Total Complaints",    icon: "📋", bg: "bg-blue-50",    text: "text-blue-700"   },
  { key: "pending_review",     label: "Pending Review",      icon: "⏳", bg: "bg-amber-50",   text: "text-amber-700", subLabel: "Awaiting teacher" },
  { key: "genuine_complaints", label: "Verified Genuine",    icon: "✅", bg: "bg-emerald-50", text: "text-emerald-700" },
  { key: "rejected_complaints",label: "Not Genuine",         icon: "❌", bg: "bg-rose-50",    text: "text-rose-700"   },
  { key: "in_progress",        label: "In Progress",         icon: "🔄", bg: "bg-indigo-50",  text: "text-indigo-700" },
  { key: "resolved",           label: "Resolved",            icon: "🎉", bg: "bg-green-50",   text: "text-green-700"  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminDashboardStats();
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const c = stats?.complaints || {};
  const u = stats?.users || {};

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening across the system today</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link
            to="/admin/complaints"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all duration-150 active:scale-95"
          >
            Manage Complaints →
          </Link>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchStats} />}

      {loading ? (
        <>
          <StatsSkeleton count={6} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-48 skeleton" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-48 skeleton" />
          </div>
        </>
      ) : (
        <>
          {/* ── Complaint Stats Grid ── */}
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Complaint Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {STAT_CONFIG.map(({ key, label, icon, bg, text, subLabel }) => (
                <StatCard
                  key={key}
                  label={label}
                  value={c[key]}
                  icon={icon}
                  bg={bg}
                  text={text}
                  subLabel={subLabel}
                />
              ))}
            </div>
          </section>

          {/* ── Users + Priority ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* User counts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Registered Users</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Students", value: u.total_students, bg: "from-blue-500 to-blue-600", icon: "🎓" },
                  { label: "Teachers", value: u.total_teachers, bg: "from-violet-500 to-violet-600", icon: "👨‍🏫" },
                ].map((item) => (
                  <div key={item.label} className={`bg-gradient-to-br ${item.bg} rounded-xl p-4 text-white`}>
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-3xl font-black">{item.value ?? "—"}</p>
                    <p className="text-xs text-white/80 font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Priority Breakdown</h2>
              {stats?.priorities?.length > 0 ? (
                <div className="space-y-3">
                  {stats.priorities.map((p) => {
                    const total = c.total_complaints || 1;
                    const pct = Math.round((p.count / total) * 100);
                    const bars = {
                      LOW: "bg-slate-300", MEDIUM: "bg-sky-500",
                      HIGH: "bg-orange-500", URGENT: "bg-rose-500",
                    };
                    const icons = { LOW: "↓", MEDIUM: "→", HIGH: "↑", URGENT: "⚡" };
                    return (
                      <div key={p.priority}>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-gray-700 flex items-center gap-1">
                            <span>{icons[p.priority]}</span> {p.priority}
                          </span>
                          <span className="text-gray-400 tabular-nums">{p.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${bars[p.priority] || "bg-gray-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
              )}
            </div>
          </div>

          {/* ── Department table ── */}
          {stats?.departments?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Complaints by Department</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-6">Department</th>
                      <th className="py-3 px-6 text-right">Complaints</th>
                      <th className="py-3 px-6 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.departments.map((dept) => {
                      const pct = c.total_complaints ? Math.round((dept.complaint_count / c.total_complaints) * 100) : 0;
                      return (
                        <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-6 font-medium text-gray-800">{dept.name}</td>
                          <td className="py-3 px-6 text-right">
                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold px-2">
                              {dept.complaint_count}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-right text-gray-400 tabular-nums">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
