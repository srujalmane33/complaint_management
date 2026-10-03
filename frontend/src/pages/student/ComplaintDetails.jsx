import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComplaintById } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
<<<<<<< HEAD
import ImageModal from "../../components/common/ImageModal";
import { getImageUrl } from "../../utils/getImageUrl";
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2

export default function ComplaintDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
<<<<<<< HEAD
  const [previewImage, setPreviewImage] = useState(null);
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getComplaintById(id);
        setData(res.data || res);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load complaint details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-16 text-gray-400 text-xs">Loading record...</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {error || "Complaint details unavailable."}
        </div>
        <Link to="/student/dashboard" className="text-blue-600 text-xs font-semibold hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const complaint = data.complaint || data;
  const history = data.history || data.updates || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
<<<<<<< HEAD
      <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />

=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
      <Link
        to="/student/dashboard"
        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
      >
        &larr; Back to Complaints
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 text-xs text-gray-600 border-b border-gray-100">
          <div>
            <span className="font-semibold text-gray-900">Location:</span> {complaint.location}
          </div>
          <div>
            <span className="font-semibold text-gray-900">Created:</span>{" "}
            {new Date(complaint.created_at).toLocaleString()}
          </div>
        </div>

<<<<<<< HEAD
        <div className="pt-4 space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Description
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
        <div className="pt-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Description
          </h2>
          <p className="text-xs text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-gray-100">
            {complaint.description}
          </p>
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-6">Status Timeline & History</h2>
        {history.length === 0 ? (
          <p className="text-xs text-gray-500">Initial submission registered. Pending faculty review.</p>
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
            {history.map((item, index) => (
              <div key={index} className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></span>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      {item.new_status || item.status}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  {item.remark && <p className="text-gray-600">{item.remark}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}