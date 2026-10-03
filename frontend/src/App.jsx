import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ROLES } from "./constants/roles";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import CreateComplaint from "./pages/student/CreateComplaint";
import ComplaintDetails from "./pages/student/ComplaintDetails";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import VerifyComplaint from "./pages/teacher/VerifyComplaint";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageComplaints from "./pages/admin/ManageComplaints";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";

<<<<<<< HEAD
import { useAuth } from "./context/AuthContext";
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
import NotFound from "./pages/NotFound";

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-3xl mb-4">
        🚫
      </div>
      <h1 className="text-2xl font-bold text-gray-900">403 — Access Denied</h1>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        You don't have permission to view this page. Please contact your administrator.
      </p>
      <a
        href="/login"
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
      >
        Back to Login
      </a>
    </div>
  );
}

<<<<<<< HEAD
function RootRedirect() {
  const { user, token, loading } = useAuth();

  if (loading) return null;

  if (token && user) {
    if (user.role === ROLES.STUDENT || user.role === "STUDENT") {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (user.role === ROLES.TEACHER || user.role === "TEACHER") {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    if (user.role === ROLES.ADMIN || user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <Navigate to="/login" replace />;
}

=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
export default function App() {
  return (
    <Routes>
      {/* Full-Screen Auth Pages */}
<<<<<<< HEAD
      <Route path="/" element={<RootRedirect />} />
=======
      <Route path="/" element={<Navigate to="/login" replace />} />
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Authenticated Application Pages */}
      <Route element={<Layout />}>
        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/complaints/new" element={<CreateComplaint />} />
          <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
        </Route>

        {/* Teacher Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/complaints/:id/verify" element={<VerifyComplaint />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<ManageComplaints />} />
        </Route>

        {/* Catch-All Inside Layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}