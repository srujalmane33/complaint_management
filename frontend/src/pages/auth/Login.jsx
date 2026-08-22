import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InteractiveBackground from "../../components/common/InteractiveBackground";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await loginUser(formData);
      const payload = response.data || response;
      const token = payload.token || response.token;
      const user = payload.user || response.user;

      login(token, user);

      if (user.role === ROLES.STUDENT || user.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (user.role === ROLES.TEACHER || user.role === "TEACHER") {
        navigate("/teacher/dashboard");
      } else if (user.role === ROLES.ADMIN || user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none">
      
      {/* Interactive Cursor Spotlight Background */}
      <InteractiveBackground />

      {/* Main Glassmorphic Split Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[880px] min-h-[520px] sm:min-h-[550px] max-h-[92vh] bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.55)] border border-white/20 flex flex-col md:flex-row overflow-hidden z-10"
      >
        {/* Left Electric Blue Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden"
        >
          <div className="relative z-10">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl font-black mb-6 shadow-inner cursor-pointer"
            >
              C
            </motion.div>

            <h2 className="text-3xl font-extrabold tracking-tight leading-snug mb-3 text-white">
              Welcome to<br />CMS Portal
            </h2>
            <p className="text-blue-100/90 text-xs sm:text-sm font-normal leading-relaxed mb-8">
              Log in to track your grievance status, teacher notes, and administrative escalations.
            </p>

            <div className="space-y-4">
              {[
                "Instant status tracking",
                "Teacher verification & notes",
                "Direct administrative escalations",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm text-blue-50 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[11px] text-blue-200/80 font-medium tracking-wide">
            College Grievance & Resolution System
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="w-full max-w-md mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Enter your credentials to access your account
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#1d5bd8] hover:bg-[#184ebd] text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-150 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            <p className="mt-6 text-xs text-center text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#1d5bd8] font-bold hover:underline transition"
              >
                Register
              </Link>
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}