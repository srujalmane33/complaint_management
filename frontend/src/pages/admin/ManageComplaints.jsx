import { useEffect, useState, useCallback } from "react";
import { getAllComplaints, resolveComplaint } from "../../services/adminService";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import { TableSkeleton, ErrorAlert, EmptyState, Spinner } from "../../components/common/Skeleton";
import ImageModal from "../../components/common/ImageModal";
import { getImageUrl } from "../../utils/getImageUrl";

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "GENUINE",        label: "Genuine" },
  { value: "NOT_GENUINE",    label: "Not Genuine" },
  { value: "IN_PROGRESS",    label: "In Progress" },
  { value: "RESOLVED",       label: "Resolved" },
  { value: "CLOSED",         label: "Closed" },
];

const PRIORITIES = [
  { value: "", label: "All Priorities" },
  { value: "LOW",    label: "↓ Low" },
  { value: "MEDIUM", label: "→ Medium" },
  { value: "HIGH",   label: "↑ High" },
  { value: "URGENT", label: "⚡ Urgent" },
];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "1", label: "Classroom & Infrastructure" },
  { value: "2", label: "Laboratory & Equipment" },
  { value: "3", label: "Hostel & Mess" },
  { value: "4", label: "Library Services" },
  { value: "5", label: "Electrical / Maintenance" },
];

// ── Resolve Modal ─────────────────────────────────────────────────────────
function ResolveModal({ complaint, onClose, onSuccess, onOpenImage }) {
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.admin_remarks || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resolveComplaint(complaint.id, { status, admin_remarks: remarks });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint");
    } finally {
      setLoading(false);
    }
  };

  const quickStatuses = [
    { value: "IN_PROGRESS", label: "In Progress", color: "indigo" },
    { value: "RESOLVED",    label: "Resolved",    color: "emerald" },
    { value: "CLOSED",      label: "Closed",      color: "gray" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-[11px] font-mono mb-0.5">#{complaint.complaint_number}</p>
            <h3 className="text-white font-bold text-base leading-snug line-clamp-1">{complaint.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition flex-shrink-0 ml-3 mt-0.5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Info strip */}
          <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-1.5 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Student</span>
              <span className="font-semibold text-gray-800">{complaint.student_name} · {complaint.roll_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Department</span>
              <span className="font-medium text-gray-700">{complaint.department_name || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Teacher Verified</span>
              {complaint.verified_by_teacher
                ? <span className="text-emerald-700 font-semibold">✓ {complaint.verified_by_teacher}</span>
                : <span className="text-amber-600 font-medium">Not yet</span>
              }
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Current Status</span>
              <StatusBadge status={complaint.status} />
            </div>
            {(complaint.image_url || complaint.attachment_url) && (
              <div className="pt-2 border-t border-slate-200/60 mt-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Attached Problem Photo</p>
                <button
                  type="button"
                  onClick={() => onOpenImage(getImageUrl(complaint.image_url || complaint.attachment_url))}
                  className="inline-block group text-left cursor-pointer"
                >
                  <img
                    src={getImageUrl(complaint.image_url || complaint.attachment_url)}
                    alt="Problem attachment"
                    className="h-28 w-auto max-w-full object-cover rounded-xl border border-gray-200 shadow-xs group-hover:opacity-90 transition"
                  />
                  <span className="block text-[11px] text-blue-600 font-semibold mt-1">🔍 Click to preview image</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Quick action buttons */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Quick Actions
            </label>
            <div className="flex gap-2 flex-wrap">
              {quickStatuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 border ${
                    status === s.value
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Set Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition"
            >
              {STATUSES.filter((s) => s.value).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Admin Remarks <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Add notes or remarks about this complaint..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold shadow-sm transition active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner size="sm" color="white" /> Saving...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Complaint Row ──────────────────────────────────────────────────────────
function ComplaintRow({ complaint, onManage, onOpenImage }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="hover:bg-blue-50/20 transition-colors cursor-pointer group"
        onClick={() => setExpanded((p) => !p)}
      >
        <td className="py-3.5 px-5 font-mono text-xs font-bold text-gray-700">
          {complaint.complaint_number}
        </td>
        <td className="py-3.5 px-5 max-w-[180px]">
          <p className="font-semibold text-gray-800 text-xs truncate">{complaint.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{complaint.department_name || complaint.category || "—"}</p>
        </td>
        <td className="py-3.5 px-5">
          <p className="text-xs font-semibold text-gray-800">{complaint.student_name}</p>
          <p className="text-[11px] text-gray-400">{complaint.roll_number}</p>
        </td>
        <td className="py-3.5 px-5"><PriorityBadge priority={complaint.priority} /></td>
        <td className="py-3.5 px-5"><StatusBadge status={complaint.status} /></td>
        <td className="py-3.5 px-5 text-xs">
          {complaint.verified_by_teacher
            ? <span className="text-emerald-700 font-medium">✓ {complaint.verified_by_teacher}</span>
            : <span className="text-amber-500 font-medium">Pending</span>
          }
        </td>
        <td className="py-3.5 px-5 text-xs text-gray-400 tabular-nums">
          {complaint.created_at
            ? new Date(complaint.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "N/A"}
        </td>
        <td className="py-3.5 px-5 text-right">
          <button
            onClick={(e) => { e.stopPropagation(); onManage(complaint); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition active:scale-95"
          >
            Manage
          </button>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-slate-50/60">
          <td colSpan={8} className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</p>
                <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 rounded-xl p-3">
                  {complaint.description || "No description provided"}
                </p>
              </div>
              <div className="space-y-3">
                {complaint.latest_remark && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Latest Remark</p>
                    <p className="text-gray-700 bg-white border border-gray-100 rounded-xl p-3">{complaint.latest_remark}</p>
                  </div>
                )}
                {complaint.location && (
                  <p className="text-gray-500">📍 {complaint.location}</p>
                )}
                {(complaint.image_url || complaint.attachment_url) && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Problem Photo</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImage(getImageUrl(complaint.image_url || complaint.attachment_url));
                      }}
                      className="inline-block group text-left cursor-pointer"
                    >
                      <img
                        src={getImageUrl(complaint.image_url || complaint.attachment_url)}
                        alt="Problem Photo"
                        className="h-32 w-auto max-w-full object-cover rounded-xl border border-gray-200 shadow-sm group-hover:scale-[1.02] transition"
                      />
                      <span className="block text-[11px] text-blue-600 font-semibold mt-1">📸 Click to preview image</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Summary Pill ───────────────────────────────────────────────────────────
function SummaryPill({ label, value, color }) {
  const colors = {
    blue:    "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber:   "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${colors[color]}`}>
      <p className="text-xl font-black">{value}</p>
      <p className="text-[11px] font-semibold mt-0.5 opacity-80">{label}</p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", priority: "", category_id: "", search: "" });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllComplaints(filters);
      setComplaints(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ status: "", priority: "", category_id: "", search: "" });
  const hasFilters = filters.status || filters.priority || filters.category_id || filters.search;

  const verifiedCount   = complaints.filter((c) => c.verified_by_teacher).length;
  const unverifiedCount = complaints.filter((c) => !c.verified_by_teacher).length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Image Preview Modal */}
      <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[60] bg-emerald-700 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl shadow-emerald-700/30 flex items-center gap-2 animate-slide-up">
          <span>✅</span> {toast}
        </div>
      )}

      {/* Modal */}
      {selectedComplaint && (
        <ResolveModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onOpenImage={setPreviewImage}
          onSuccess={() => {
            setSelectedComplaint(null);
            showToast("Complaint updated successfully!");
            fetchComplaints();
          }}
        />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-2xl font-bold text-gray-900">Manage Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">View, filter, and resolve all student complaints</p>
        </div>
        <button
          onClick={fetchComplaints}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-xl transition active:scale-95 disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Summary Pills ── */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3">
          <SummaryPill label="Total" value={complaints.length} color="blue" />
          <SummaryPill label="Teacher Verified" value={verifiedCount} color="emerald" />
          <SummaryPill label="Unverified" value={unverifiedCount} color="amber" />
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search complaint, student, or ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition"
            />
          </div>
          <select
            value={filters.category_id}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white"
          >
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white"
          >
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white"
          >
            {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2.5 text-xs font-semibold text-gray-400 hover:text-red-600 transition flex items-center gap-1"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchComplaints} />}

      {/* ── Table ── */}
      {loading ? (
        <TableSkeleton rows={6} cols={8} />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon="📭"
          title={hasFilters ? "No complaints match your filters" : "No complaints found"}
          subtitle={hasFilters ? "Try adjusting your search or filters" : "Complaints will appear here once students submit them"}
          action={hasFilters ? (
            <button onClick={clearFilters} className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl transition hover:bg-blue-700">
              Clear Filters
            </button>
          ) : null}
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-5">Complaint</th>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Verification</th>
                  <th className="py-3.5 px-5">Filed</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map((c) => (
                  <ComplaintRow key={c.id} complaint={c} onManage={setSelectedComplaint} onOpenImage={setPreviewImage} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
              {hasFilters ? " (filtered)" : ""}
              &ensp;·&ensp;Click any row to expand details
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
