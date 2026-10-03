import API from "./api";

export const getPendingComplaints = async () => {
  const response = await API.get("/teacher/complaints/pending");
  return response.data;
};

export const getTeacherComplaintById = async (id) => {
  const response = await API.get(`/teacher/complaints/${id}`);
  return response.data;
};

export const verifyComplaint = async (id, verificationData) => {
  const response = await API.put(`/teacher/complaints/${id}/verify`, verificationData);
  return response.data;
};

export default {
  getPendingComplaints,
  getTeacherComplaintById,
  verifyComplaint,
};