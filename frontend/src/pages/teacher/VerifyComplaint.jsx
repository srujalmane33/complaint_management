import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getTeacherComplaintById,
  verifyComplaint,
} from "../../services/teacherService";
import { COMPLAINT_STATUS } from "../../constants/complaintStatus";
import PriorityBadge from "../../components/common/PriorityBadge";
import StatusBadge from "../../components/common/StatusBadge";
<<<<<<< HEAD
import ImageModal from "../../components/common/ImageModal";
import { getImageUrl } from "../../utils/getImageUrl";
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2

export default function VerifyComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
<<<<<<< HEAD
  const [previewImage, setPreviewImage] = useState(null);
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
  const [decision, setDecision] = useState({
    status: COMPLAINT_STATUS.GENUINE,
    remark: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getTeacherComplaintById(id);
        setData(res.data || res);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load complaint");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (decision.remark.trim().length < 5) {
      return setError("Please provide a remark of at least 5 characters.");
    }

    try {
      setSubmitting(true);
      setError("");
      await verifyComplaint(id, decision);
      navigate("/teacher/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint verification");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-400 text-xs">Loading complaint details...</div>;
  }

  if (error && !data) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {error}
        </div>
        <Link to="/teacher/dashboard" className="text-blue-600 text-xs font-semibold hover:underline">
          &larr; Back to Pending List
        </Link>
      </div>
    );
  }

  const complaint = data.complaint || data;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
<<<<<<< HEAD
      <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />

=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
      <Link
        to="/teacher/dashboard"
        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
      >
        &larr; Back to Pending Reviews
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {complaint.complaint_number}
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-2">{complaint.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <p className="font-semibold text-gray-700">Submitted By:</p>
            <p className="text-gray-900 mt-0.5 font-medium">{complaint.student_name}</p>
            <p className="text-gray-500">{complaint.roll_number} • {complaint.course} (Yr {complaint.year})</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Location & Dept:</p>
            <p className="text-gray-900 mt-0.5 font-medium">{complaint.location}</p>
            <p className="text-gray-500">{complaint.department_name || "N/A"}</p>
          </div>
        </div>

<<<<<<< HEAD
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Complaint Description
            </h2>
            <p className="text-xs text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-gray-100">
              {complaint.description}
            </p>
          </div>

          {(complaint.image_url || complaint.attachment_url) && (
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Attached Problem Photo
              </h2>
              <button
                type="button"
                onClick={() => setPreviewImage(getImageUrl(complaint.image_url || complaint.attachment_url))}
                className="inline-block group text-left cursor-pointer"
              >
                <img
                  src={getImageUrl(complaint.image_url || complaint.attachment_url)}
                  alt="Problem photo"
                  className="max-h-64 w-auto object-cover rounded-xl border border-gray-200 shadow-sm group-hover:opacity-95 transition"
                />
                <span className="block text-xs text-blue-600 font-semibold mt-1.5">📸 Click to preview image</span>
              </button>
            </div>
          )}
=======
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Complaint Description
          </h2>
          <p className="text-xs text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-gray-100">
            {complaint.description}
          </p>
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-gray-900">Teacher Verification Assessment</h2>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Decision
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  decision.status === COMPLAINT_STATUS.GENUINE
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={COMPLAINT_STATUS.GENUINE}
                  checked={decision.status === COMPLAINT_STATUS.GENUINE}
                  onChange={(e) => setDecision({ ...decision, status: e.target.value })}
                  className="text-blue-600"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">Mark GENUINE</p>
                  <p className="text-[11px] text-gray-500">Forwards complaint directly to Admin</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  decision.status === COMPLAINT_STATUS.NOT_GENUINE
                    ? "border-rose-600 bg-rose-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={COMPLAINT_STATUS.NOT_GENUINE}
                  checked={decision.status === COMPLAINT_STATUS.NOT_GENUINE}
                  onChange={(e) => setDecision({ ...decision, status: e.target.value })}
                  className="text-rose-600"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">Mark NOT GENUINE</p>
                  <p className="text-[11px] text-gray-500">Rejects complaint back to student</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Teacher Remark / Note
            </label>
            <textarea
              rows={3}
              required
              value={decision.remark}
              onChange={(e) => setDecision({ ...decision, remark: e.target.value })}
              placeholder="e.g. Verified on site, projector bulb is fused and requires replacement."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/teacher/dashboard"
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}