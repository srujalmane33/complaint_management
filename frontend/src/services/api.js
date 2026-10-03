import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3004/api";

const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseURL = cleanBaseUrl.endsWith("/api") ? cleanBaseUrl : `${cleanBaseUrl}/api`;

const API = axios.create({
  baseURL,
});

// Auth pages — no redirect should happen on these paths
const AUTH_PATHS = ["/login", "/register", "/admin/login", "/admin/register"];

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = AUTH_PATHS.some(
      (path) => window.location.pathname === path
    );

    // Only auto-redirect on 401 when NOT on an auth/login page
    if (error.response?.status === 401 && !isAuthPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;