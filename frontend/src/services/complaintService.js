import API from "./api";

export const createComplaint = async (complaintData) => {
  const response = await API.post("/complaints", complaintData);
  return response.data;
};

export const getMyComplaints = async () => {
  const response = await API.get("/complaints/my");
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await API.get(`/complaints/${id}`);
  return response.data;
};