import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyComplaints } from "../../services/complaintService";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyComplaints();

      console.log("Complaints API Response:", res);

      // Extract array safely across different response formats
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.complaints)) {
        list = res.complaints;
      } else if (Array.isArray(res?.data?.complaints)) {
        list = res.data.complaints;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      }

      setComplaints(list);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor the status and verification lifecycle of your submitted issues
          </p>
        </div>
        <Link
          to="/student/complaints/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
        >
          + File New Complaint
        </Link>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs">Fetching complaint records...</div>
      ) : !Array.isArray(complaints) || complaints.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-500 text-sm mb-3">No complaints recorded yet.</p>
          <Link
            to="/student/complaints/new"
            className="text-blue-600 font-semibold text-xs hover:underline"
          >
            Submit your first complaint &rarr;
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Complaint #</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Filed On</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {complaints.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-900">
                      {item.complaint_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/student/complaints/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}