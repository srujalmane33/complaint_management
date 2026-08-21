import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { getPendingComplaints } from "../../services/teacherService";
import PriorityBadge from "../../components/common/PriorityBadge";
import StatusBadge from "../../components/common/StatusBadge";
import { getPendingComplaints } from "../../services/teacherService";

export default function TeacherDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPending();
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Complaints Verification</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review student grievances and verify authenticity before forwarding to Admin
          </p>
        </div>
        <button
          onClick={fetchPending}
          className="px-3.5 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition"
        >
          Refresh List
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs">Fetching pending reviews...</div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-500 text-sm">All caught up! No complaints currently pending review.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Complaint #</th>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Title & Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {complaints.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-900">
                      {item.complaint_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-800">{item.student_name}</p>
                      <p className="text-[11px] text-gray-400">
                        {item.roll_number} • {item.department_name || "Department"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-[11px] text-gray-500">{item.location}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/teacher/complaints/${item.id}/verify`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition inline-block"
                      >
                        Review & Verify
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