import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent, registerTeacher } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

export default function Register() {
  const [role, setRole] = useState(ROLES.STUDENT);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Student Form State
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    roll_number: "",
    course: "B.Tech Computer Science",
    year: "3",
    department_id: "1",
  });

  // Teacher Form State
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    employee_id: "",
    department_id: "1",
  });

  const handleStudentChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleTeacherChange = (e) => {
    setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (role === ROLES.STUDENT) {
        data = await registerStudent({
          ...studentData,
          year: Number(studentData.year),
          department_id: Number(studentData.department_id),
        });
      } else {
        data = await registerTeacher({
          ...teacherData,
          department_id: Number(teacherData.department_id),
        });
      }

      const payload = data.data || data;
      const token = payload.token || data.token;
      const user = payload.user || data.user;

      login(token, user);

      if (user.role === ROLES.STUDENT) {
        navigate("/student/dashboard");
      } else if (user.role === ROLES.TEACHER) {
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Create an Account</h1>
      <p className="text-xs text-gray-500 text-center mt-1 mb-6">
        Register to access the college complaint & verification portal
      </p>

      {/* Role Switcher Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setRole(ROLES.STUDENT)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            role === ROLES.STUDENT
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Register as Student
        </button>
        <button
          type="button"
          onClick={() => setRole(ROLES.TEACHER)}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            role === ROLES.TEACHER
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Register as Faculty / Teacher
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={role === ROLES.STUDENT ? studentData.name : teacherData.name}
              onChange={role === ROLES.STUDENT ? handleStudentChange : handleTeacherChange}
              placeholder={role === ROLES.STUDENT ? "e.g. Rahul Sharma" : "e.g. Prof. R. K. Sharma"}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              {role === ROLES.STUDENT ? "Roll Number" : "Employee ID"}
            </label>
            <input
              type="text"
              name={role === ROLES.STUDENT ? "roll_number" : "employee_id"}
              required
              value={role === ROLES.STUDENT ? studentData.roll_number : teacherData.employee_id}
              onChange={role === ROLES.STUDENT ? handleStudentChange : handleTeacherChange}
              placeholder={role === ROLES.STUDENT ? "e.g. CS999" : "e.g. EMP1024"}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={role === ROLES.STUDENT ? studentData.email : teacherData.email}
              onChange={role === ROLES.STUDENT ? handleStudentChange : handleTeacherChange}
              placeholder={role === ROLES.STUDENT ? "student@college.edu" : "faculty@college.edu"}
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
              value={role === ROLES.STUDENT ? studentData.password : teacherData.password}
              onChange={role === ROLES.STUDENT ? handleStudentChange : handleTeacherChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Student Specific Fields */}
        {role === ROLES.STUDENT && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Course
              </label>
              <input
                type="text"
                name="course"
                required
                value={studentData.course}
                onChange={handleStudentChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Academic Year
              </label>
              <select
                name="year"
                value={studentData.year}
                onChange={handleStudentChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Department
              </label>
              <select
                name="department_id"
                value={studentData.department_id}
                onChange={handleStudentChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Computer Science</option>
                <option value="2">Information Technology</option>
                <option value="3">Electronics & TC</option>
                <option value="4">Mechanical Engg</option>
                <option value="5">Civil Engg</option>
              </select>
            </div>
          </div>
        )}

        {/* Teacher Specific Fields */}
        {role === ROLES.TEACHER && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Department
            </label>
            <select
              name="department_id"
              value={teacherData.department_id}
              onChange={handleTeacherChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Computer Science</option>
              <option value="2">Information Technology</option>
              <option value="3">Electronics & TC</option>
              <option value="4">Mechanical Engg</option>
              <option value="5">Civil Engg</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 mt-2"
        >
          {loading
            ? "Registering..."
            : role === ROLES.STUDENT
            ? "Register as Student"
            : "Register as Faculty"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        Already registered?{" "}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}