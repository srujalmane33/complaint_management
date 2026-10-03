import API from "./api";

// Admin login (uses dedicated admin login endpoint)
export const adminLogin = async (credentials) => {
  const response = await API.post("/admin/auth/login", credentials);
  return response.data;
};

// Get dashboard statistics
export const getAdminDashboardStats = async () => {
  const response = await API.get("/admin/dashboard-stats");
  return response.data;
};

// Get all complaints with optional filters
export const getAllComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
<<<<<<< HEAD
  if (filters.category_id) params.append("category_id", filters.category_id);
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
  if (filters.department_id) params.append("department_id", filters.department_id);
  if (filters.search) params.append("search", filters.search);

  const response = await API.get(`/admin/complaints?${params.toString()}`);
  return response.data;
};

// Resolve / update a complaint
export const resolveComplaint = async (id, payload) => {
  const response = await API.put(`/admin/complaints/${id}/resolve`, payload);
  return response.data;
};

// Get all teachers
export const getAllTeachers = async () => {
  const response = await API.get("/admin/teachers");
  return response.data;
};

// Get all students
export const getAllStudents = async () => {
  const response = await API.get("/admin/students");
  return response.data;
};
