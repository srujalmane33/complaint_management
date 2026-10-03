import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerStudent, registerTeacher } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [role, setRole] = useState("STUDENT");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    course: "B.Tech",
    year: 3,
    departmentId: 1,
    employeeId: "",
  });
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
      let response;
      if (role === "STUDENT") {
        response = await registerStudent({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roll_number: formData.rollNumber,
          course: formData.course,
          year: Number(formData.year),
          department_id: Number(formData.departmentId),
        });
      } else {
        response = await registerTeacher({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          employee_id: formData.employeeId,
          department_id: Number(formData.departmentId),
        });
      }

      const payload = response.data || response;
      const token = payload.token || response.token;
      const user = payload.user || response.user;

      if (token && user) {
        login(token, user);
        navigate(role === "STUDENT" ? "/student/dashboard" : "/teacher/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0d1527] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none">
      
      {/* Animated Glowing Ambient Orbs */}
      <motion.div
        animate={{
          x: [0, 70, -60, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-[8%] w-96 h-96 bg-blue-600/30 rounded-full blur-[110px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -70, 60, 0],
          y: [0, 60, -50, 0],
          scale: [1, 1.25, 0.85, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[8%] right-[8%] w-[420px] h-[420px] bg-indigo-500/25 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Blueprint Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Glassmorphic Split Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[920px] min-h-[560px] sm:min-h-[600px] max-h-[92vh] bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] border border-white/20 flex flex-col md:flex-row overflow-hidden z-10"
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
              Join CMS<br />Portal
            </h2>
            <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed mb-8">
              Create your account and manage your campus grievances efficiently.
            </p>

            <div className="space-y-4">
              {[
                "Easy complaint submission",
                "Real-time complaint tracking",
                "Transparent resolution process",
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
        <div className="w-full md:w-7/12 p-7 sm:p-9 lg:p-11 flex flex-col justify-center bg-white overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="w-full max-w-md mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create account
            </h1>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Register for the Complaint Management System
            </p>

            {/* Role Toggle Selector */}
            <div className="grid grid-cols-2 gap-2.5 mb-5 relative">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`relative py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  role === "STUDENT"
                    ? "border-blue-600 text-blue-600 shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {role === "STUDENT" && (
                  <motion.div
                    layoutId="activeRoleTab"
                    className="absolute inset-0 bg-blue-50/70 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`relative py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  role === "TEACHER"
                    ? "border-blue-600 text-blue-600 shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {role === "TEACHER" && (
                  <motion.div
                    layoutId="activeRoleTab"
                    className="absolute inset-0 bg-blue-50/70 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Faculty</span>
              </button>
            </div>

            {error && (
              <div className="mb-3.5 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Row 1: Name & Role Identifier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {role === "STUDENT" ? (
                    <motion.div
                      key="student-roll"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                        Roll Number
                      </label>
                      <input
                        type="text"
                        name="rollNumber"
                        required
                        value={formData.rollNumber}
                        onChange={handleChange}
                        placeholder="24BT0203"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="faculty-id"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        required
                        value={formData.employeeId}
                        onChange={handleChange}
                        placeholder="EMP0023"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Row 2: Email */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@college.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition"
                />
              </div>

              {/* Row 3: Password & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition"
                  >
                    <option value={1}>Computer Science</option>
                    <option value={12}>Information Tech</option>
                    <option value={14}>AI & Data Science</option>
                    <option value={3}>Electrical</option>
                    <option value={2}>Mechanical</option>
                    <option value={11}>Civil</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#1d5bd8] hover:bg-[#184ebd] text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-150 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </form>

            <p className="mt-5 text-xs text-center text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1d5bd8] font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}