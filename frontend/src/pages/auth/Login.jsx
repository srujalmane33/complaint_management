import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(formData);
      console.log("Login Response:", res);

      // Support response wrapped in res.data or direct root
      const payload = res.data || res;
      const token = payload.token || res.token;
      
      // Extract user object or build from root fields
      const user = payload.user || res.user || {
        userId: payload.userId || res.userId || payload.id,
        email: payload.email || res.email,
        role: payload.role || res.role,
        name: payload.name || res.name,
      };

      if (!token || !user?.role) {
        throw new Error("Invalid response format received from server.");
      }

      // Ensure uppercase role matching
      user.role = String(user.role).toUpperCase();

      login(token, user);

      if (user.role === ROLES.STUDENT) {
        navigate("/student/dashboard");
      } else if (user.role === ROLES.TEACHER) {
        navigate("/teacher/dashboard");
      } else if (user.role === ROLES.ADMIN) {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h1>
      <p className="text-xs text-gray-500 text-center mt-1 mb-6">
        Sign in to access your complaint portal
      </p>

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. teststudent@gmail.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        Student without an account?{" "}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}