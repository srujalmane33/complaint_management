import API from "./api";

export const registerStudent = async (studentData) => {
  const response = await API.post("/auth/register", studentData);
  return response.data;
};

export const registerTeacher = async (teacherData) => {
  const response = await API.post("/auth/register-teacher", teacherData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};