import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllComplaints, resolveComplaint } from "../../services/adminService";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import { TableSkeleton, ErrorAlert, EmptyState, Spinner } from "../../components/common/Skeleton";
import ImageModal from "../../components/common/ImageModal";
import { getImageUrl } from "../../utils/getImageUrl";

const CATEGORY_META = {
  "Infrastructure":              { icon: "🏫", color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Classroom & Infrastructure":  { icon: "🏫", color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Laboratory & Equipment":      { icon: "🔬", color: "bg-purple-50 text-purple-700 border-purple-200" },
  "Cleanliness":                 { icon: "🧹", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "Hostel & Mess":               { icon: "🏢", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "Hostel":                      { icon: "🏢", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "Internet":                    { icon: "📶", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  "Library Services":            { icon: "📚", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "Academic":                    { icon: "🎓", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  "Electrical":                  { icon: "⚡", color: "bg-rose-50 text-rose-700 border-rose-200" },
  "Electrical / Maintenance":    { icon: "⚡", color: "bg-rose-50 text-rose-700 border-rose-200" },
  "Transport":                   { icon: "🚌", color: "bg-teal-50 text-teal-700 border-teal-200" },
  "Other":                       { icon: "📌", color: "bg-gray-50 text-gray-700 border-gray-200" },
};

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

function CategoryBadge({ category }) {
  const meta = CATEGORY_META[category] || { icon: "📋", color: "bg-gray-50 text-gray-700 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${meta.color}`}>
      <span>{meta.icon}</span>
      <span>{category || "General"}</span>
    </span>
  );
}

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
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED",    label: "Resolved" },
    { value: "CLOSED",      label: "Closed" },
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
              <span className="text-gray-500">Category</span>
              <CategoryBadge category={complaint.category} />
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
            {(complaint.image_url || complaint.attachment_url || complaint.image) && (
              <div className="pt-2 border-t border-slate-200/60 mt-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Attached Problem Photo</p>
                <button
                  type="button"
                  onClick={() => onOpenImage(getImageUrl(complaint.image_url || complaint.attachment_url || complaint.image))}
                  className="inline-block group text-left cursor-pointer"
                >
                  <img
                    src={getImageUrl(complaint.image_url || complaint.attachment_url || complaint.image)}
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
          <p className="text-[11px] text-gray-400 mt-0.5">{complaint.department_name || "General"}</p>
        </td>
        <td className="py-3.5 px-5">
          <CategoryBadge category={complaint.category} />
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
          <td colSpan={9} className="px-5 py-4">
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
                {(complaint.image_url || complaint.attachment_url || complaint.image) && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Problem Photo</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImage(getImageUrl(complaint.image_url || complaint.attachment_url || complaint.image));
                      }}
                      className="inline-block group text-left cursor-pointer"
                    >
                      <img
                        src={getImageUrl(complaint.image_url || complaint.attachment_url || complaint.image)}
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
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
    sortBy: "category_frequency",
  });
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
      // Fetch complaints from server without filtering category on the API, 
      // so we have the complete data to calculate global category rankings and sort client-side accurately
      const apiFilters = {
        status: filters.status,
        priority: filters.priority,
        search: filters.search,
      };
      const res = await getAllComplaints(apiFilters);
      setComplaints(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.search]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ status: "", priority: "", category: "", search: "", sortBy: "category_frequency" });
  const hasFilters = filters.status || filters.priority || filters.category || filters.search || filters.sortBy !== "category_frequency";

  const verifiedCount   = complaints.filter((c) => c.verified_by_teacher).length;
  const unverifiedCount = complaints.filter((c) => !c.verified_by_teacher).length;

  // ── Calculate category complaint counts & ranking dynamically from loaded complaints ──
  const categoryStats = useMemo(() => {
    const counts = {};

    complaints.forEach((c) => {
      const cat = c.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    let topCategory = null;
    let maxCount = 0;

    // Sort categories by descending count
    const rankedCategories = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ name: cat, count }));

    if (rankedCategories.length > 0) {
      topCategory = rankedCategories[0].name;
      maxCount = rankedCategories[0].count;
    }

    return { counts, topCategory, maxCount, rankedCategories };
  }, [complaints]);

  // ── Compute sorted and filtered complaints ───────────────────────────────
  const sortedComplaints = useMemo(() => {
    let list = [...complaints];

    // 1. Client-side category filter (matches by name or ID)
    if (filters.category) {
      list = list.filter((c) => {
        const cat = c.category || "General";
        return cat.toLowerCase() === filters.category.toLowerCase() || String(c.category_id) === String(filters.category);
      });
    }

    // 2. Sorting
    if (filters.sortBy === "category_frequency") {
      // Prioritize complaints from the category having the most complaints overall
      list.sort((a, b) => {
        const catA = a.category || "General";
        const catB = b.category || "General";
        const countA = categoryStats.counts[catA] || 0;
        const countB = categoryStats.counts[catB] || 0;

        // Highest total complaints category at top
        if (countB !== countA) {
          return countB - countA;
        }

        // Group identical categories together
        if (catA !== catB) {
          return catA.localeCompare(catB);
        }

        // Within the same category: Urgent priority first, then newest
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        const prioDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (prioDiff !== 0) return prioDiff;

        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
    } else if (filters.sortBy === "category_az") {
      list.sort((a, b) => {
        const catA = a.category || "General";
        const catB = b.category || "General";
        return catA.localeCompare(catB);
      });
    } else if (filters.sortBy === "priority") {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      list.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    } else if (filters.sortBy === "newest") {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (filters.sortBy === "status") {
      list.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    }

    return list;
  }, [complaints, filters.category, filters.sortBy, categoryStats]);

  // List of all unique categories available for filter dropdown
  const availableCategories = useMemo(() => {
    const list = categoryStats.rankedCategories.map((r) => r.name);
    return list;
  }, [categoryStats.rankedCategories]);

  return (
    <div className="space-y-6 animate-fade-in">
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
          <p className="text-sm text-gray-500 mt-1">View, prioritize, and resolve student complaints by category</p>
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

      {/* ── Category Quick-Filter Cards & Ranking ── */}
      {!loading && categoryStats.rankedCategories.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Category Rankings & Complaint Distribution
            </h3>
            {categoryStats.topCategory && categoryStats.maxCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                🔥 Top Priority Category: <span className="underline font-extrabold">{categoryStats.topCategory}</span> ({categoryStats.maxCount} complaints)
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {categoryStats.rankedCategories.map((cat, idx) => {
              const meta = CATEGORY_META[cat.name] || { icon: "📋", color: "" };
              const isSelected = filters.category.toLowerCase() === cat.name.toLowerCase();
              const isTop = idx === 0 && cat.count > 0;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleFilterChange("category", isSelected ? "" : cat.name)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20"
                      : isTop
                      ? "bg-amber-50/80 border-amber-300 text-gray-800 hover:bg-amber-100/80"
                      : "bg-gray-50/70 border-gray-200 text-gray-700 hover:bg-gray-100/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{meta.icon}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : isTop
                        ? "bg-amber-200 text-amber-900 font-bold"
                        : "bg-gray-200 text-gray-800 font-bold"
                    }`}>
                      {cat.count}
                    </span>
                  </div>
                  <p className={`text-xs font-bold mt-2 truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {cat.name}
                  </p>
                  {isTop ? (
                    <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? "text-amber-200" : "text-amber-700"}`}>
                      ★ Priority 1 (Most Complaints)
                    </p>
                  ) : (
                    <p className={`text-[10px] font-medium mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                      Priority #{idx + 1}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Summary Pills ── */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3">
          <SummaryPill label="Total Complaints" value={complaints.length} color="blue" />
          <SummaryPill label="Teacher Verified" value={verifiedCount} color="emerald" />
          <SummaryPill label="Pending Verification" value={unverifiedCount} color="amber" />
        </div>
      )}

      {/* ── Filters & Sorting Bar ── */}
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

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white"
          >
            <option value="">📋 All Categories</option>
            {availableCategories.map((catName) => {
              const meta = CATEGORY_META[catName] || { icon: "📋" };
              const count = categoryStats.counts[catName] || 0;
              return (
                <option key={catName} value={catName}>
                  {meta.icon} {catName} ({count})
                </option>
              );
            })}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white"
          >
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition bg-white"
          >
            {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={filters.sortBy || "category_frequency"}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-blue-200 text-sm text-blue-950 bg-blue-50 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition"
          >
            <option value="category_frequency">📊 Sort: Category with Most Complaints First (Priority)</option>
            <option value="category_az">🔤 Sort: Category (A to Z)</option>
            <option value="priority">⚡ Sort: Priority (Urgent First)</option>
            <option value="newest">🕒 Sort: Newest First</option>
            <option value="status">📌 Sort: By Status</option>
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
        <TableSkeleton rows={6} cols={9} />
      ) : sortedComplaints.length === 0 ? (
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
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Verification</th>
                  <th className="py-3.5 px-5">Filed</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedComplaints.map((c) => (
                  <ComplaintRow
                    key={c.id}
                    complaint={c}
                    onManage={setSelectedComplaint}
                    onOpenImage={setPreviewImage}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {sortedComplaints.length} of {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}
              {hasFilters ? " (filtered)" : ""}
              &ensp;·&ensp;Sorted by category volume (highest complaints category prioritized at top)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
