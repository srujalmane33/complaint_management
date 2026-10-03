import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createComplaint } from "../../services/complaintService";
import { COMPLAINT_PRIORITY } from "../../constants/complaintPriority";

export default function CreateComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category_id: "1",
    title: "",
    description: "",
    location: "",
    priority: COMPLAINT_PRIORITY.MEDIUM,
  });
<<<<<<< HEAD
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return setError("Image size must be less than 10MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.title.trim().length < 5) {
      return setError("Title must be at least 5 characters long.");
    }
    if (formData.description.trim().length < 10) {
      return setError("Description must be at least 10 characters long.");
    }

    try {
      setLoading(true);
      await createComplaint({
        ...formData,
        category_id: Number(formData.category_id),
<<<<<<< HEAD
        image: imageFile,
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
      });
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Submit New Complaint</h1>
        <p className="text-xs text-gray-500 mt-1">
          Provide accurate issue details for teacher verification and administrative action
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Category
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Classroom & Infrastructure</option>
              <option value="2">Laboratory & Equipment</option>
              <option value="3">Hostel & Mess</option>
              <option value="4">Library Services</option>
              <option value="5">Electrical / Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={COMPLAINT_PRIORITY.LOW}>Low</option>
              <option value={COMPLAINT_PRIORITY.MEDIUM}>Medium</option>
              <option value={COMPLAINT_PRIORITY.HIGH}>High</option>
              <option value={COMPLAINT_PRIORITY.URGENT}>Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Complaint Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Faulty projector in Room 302"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Physical Location
          </label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. CSE Department, 3rd Floor, Lab 4"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Detailed Description
          </label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide context on when the problem started, symptoms, or any related details..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

<<<<<<< HEAD
        {/* Optional Problem Image Upload */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Problem Photo / Image <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          {imagePreview ? (
            <div className="relative inline-block border border-gray-200 rounded-xl overflow-hidden group">
              <img src={imagePreview} alt="Problem Preview" className="h-44 w-auto object-cover rounded-xl" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition">
              <div className="flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-2xl">📸</span>
                <p className="text-xs font-semibold text-gray-700">Click to upload an image of the problem</p>
                <p className="text-[11px] text-gray-400">PNG, JPG, WEBP up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Link
            to="/student/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
}